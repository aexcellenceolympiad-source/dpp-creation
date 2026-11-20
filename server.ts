import 'dotenv/config';
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, ThinkingLevel, Type } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '4mb' }));

// Track model-specific daily quota exhaustion so we don't repeatedly hit a 429-exhausted model
let hydrogenCooldownUntil = 0;

function getAiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured in the server environment.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

function isQuotaExhaustedError(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err);
  const status = (err as { status?: number })?.status;
  return status === 429 || /429|RESOURCE_EXHAUSTED|quota exceeded|rate-limits/i.test(msg);
}

function isRetryableError(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err);
  const status = (err as { status?: number })?.status;
  if (status === 503 || status === 502 || status === 504 || status === 500 || status === 429) {
    return true;
  }
  return /503|502|504|429|UNAVAILABLE|RESOURCE_EXHAUSTED|overloaded|high demand|ECONNRESET|ETIMEDOUT|TIMEOUT|fetch failed/i.test(
    msg,
  );
}

function extractCleanErrorMessage(err: unknown): string {
  const raw = err instanceof Error ? err.message : String(err);
  if (/API_KEY_INVALID|PERMISSION_DENIED|GEMINI_API_KEY is not configured/i.test(raw)) {
    return 'Gemini API key is missing or invalid. Please check Settings > Secrets.';
  }
  if (/429|RESOURCE_EXHAUSTED|quota exceeded/i.test(raw)) {
    return 'Free-tier rate limit reached for this minute. Please wait 30–60 seconds and click Retry.';
  }
  if (/503|UNAVAILABLE|overloaded|high demand/i.test(raw)) {
    return 'AI service is temporarily busy. Please click Generate again in a few seconds.';
  }
  if (/TIMEOUT/i.test(raw)) {
    return 'Request took too long. Try generating fewer questions (e.g. 5–10) at once.';
  }
  // Try extracting nested JSON message if present
  try {
    const parsed = JSON.parse(raw);
    if (parsed?.error?.message) {
      return String(parsed.error.message).split('\n')[0];
    }
  } catch {
    // ignore
  }
  return raw.length > 220 ? raw.slice(0, 220) + '...' : raw;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`TIMEOUT: ${label} exceeded ${ms}ms`)), ms);
    promise
      .then((val) => {
        clearTimeout(timer);
        resolve(val);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });
}

async function callGeminiWithRetry<T = any>(
  ai: GoogleGenAI,
  prompt: string,
  schema: Record<string, unknown>,
  onProgress?: (msg: string) => void,
  options?: {
    aiMode?: 'deep' | 'fast';
    validate?: (parsed: T) => boolean;
  },
): Promise<T> {
  const now = Date.now();
  const isDeep = options?.aiMode === 'deep';
  const attempts: { model: string; thinkingLevel?: ThinkingLevel; timeoutMs: number }[] = [];

  if (isDeep && now > hydrogenCooldownUntil) {
    attempts.push({
      model: 'gemini-4-hydrogen',
      thinkingLevel: ThinkingLevel.HIGH,
      timeoutMs: 45000,
    });
  }

  attempts.push({ model: 'gemini-3.1-flash-lite', timeoutMs: 55000 });
  attempts.push({ model: 'gemini-3.1-flash-lite', timeoutMs: 55000 });

  if (!isDeep && now > hydrogenCooldownUntil) {
    attempts.push({
      model: 'gemini-4-hydrogen',
      thinkingLevel: ThinkingLevel.LOW,
      timeoutMs: 30000,
    });
  }

  let lastError: unknown;
  for (let i = 0; i < attempts.length; i++) {
    const attempt = attempts[i];
    try {
      onProgress?.(
        i === 0
          ? `Generating with ${attempt.model}${isDeep && attempt.thinkingLevel ? ' (Deep Reasoning)' : ''}...`
          : `Retrying with ${attempt.model} (attempt ${i + 1}/${attempts.length})...`,
      );

      const config: Record<string, unknown> = {
        responseMimeType: 'application/json',
        responseSchema: schema,
        temperature: isDeep ? 0.35 : 0.45,
      };
      if (attempt.thinkingLevel) {
        config.thinkingConfig = { thinkingLevel: attempt.thinkingLevel };
      }

      const response = await withTimeout(
        ai.models.generateContent({
          model: attempt.model,
          contents: prompt,
          config,
        }),
        attempt.timeoutMs,
        attempt.model,
      );

      const rawText = (response.text ?? '{}').trim();
      if (!rawText || rawText === '{}') {
        throw new Error('Empty JSON response from Gemini model.');
      }
      const parsed = JSON.parse(rawText) as T;
      if (options?.validate && !options.validate(parsed)) {
        throw new Error('Incomplete question batch returned by model.');
      }
      return parsed;
    } catch (err) {
      lastError = err;
      const isQuota = isQuotaExhaustedError(err);
      if (attempt.model === 'gemini-4-hydrogen' && isQuota) {
        // Put gemini-4-hydrogen on 1-hour cooldown so we immediately use gemini-3.1-flash-lite
        hydrogenCooldownUntil = Date.now() + 60 * 60 * 1000;
      }
      const reason = err instanceof Error ? err.message.slice(0, 140) : String(err);
      console.warn(`Gemini attempt ${i + 1} (${attempt.model}) failed: ${reason}`);
      if ((!isRetryableError(err) && !/Empty JSON|Incomplete question/i.test(reason)) || i === attempts.length - 1) {
        throw err;
      }
      // Longer backoff for free-tier RPM 429 on flash-lite to avoid tight retry loops
      const delayMs = isQuota && attempt.model === 'gemini-3.1-flash-lite' ? 3500 : 1200;
      await sleep(delayMs);
    }
  }
  throw lastError;
}

const diagramSchema = {
  type: Type.OBJECT,
  properties: {
    kind: {
      type: Type.STRING,
      description:
        "Diagram kind: 'none', 'svg', 'chemistry_smiles', or 'chemistry_reaction'. Use 'chemistry_smiles' or 'chemistry_reaction' for organic chemistry structures/benzene/reactions, and 'svg' for Physics/Math/Biology/Geometry diagrams.",
    },
    svgCode: {
      type: Type.STRING,
      description:
        "Self-contained SVG string with viewBox='0 0 360 200' using stroke='currentColor' and fill='none' (or subtle fill-opacity). Required when kind is 'svg'.",
    },
    smiles: {
      type: Type.STRING,
      description:
        "Valid canonical SMILES string for a single organic molecule (e.g. 'c1ccccc1' for benzene, 'O=[N+]([O-])c1ccccc1' for nitrobenzene). Required when kind is 'chemistry_smiles'.",
    },
    reaction: {
      type: Type.OBJECT,
      properties: {
        reactants: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: 'Array of valid SMILES strings for reactants.',
        },
        reagentsAbove: {
          type: Type.STRING,
          description: 'Reagents/conditions shown above the reaction arrow.',
        },
        reagentsBelow: {
          type: Type.STRING,
          description: 'Solvent/temperature/secondary step shown below the reaction arrow.',
        },
        products: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: 'Array of valid SMILES strings for products.',
        },
      },
    },
    caption: {
      type: Type.STRING,
      description: 'Short figure caption like Fig 1. Free-body diagram or Reaction scheme.',
    },
  },
  required: ['kind'],
};

const questionSchema = {
  type: Type.OBJECT,
  properties: {
    number: { type: Type.INTEGER },
    type: {
      type: Type.STRING,
      description:
        "Exact question type: 'mcq', 'multiple_correct', 'assertion_reason', 'true_false', 'fill_blank', 'match_following', or 'subjective'.",
    },
    pyqTag: {
      type: Type.STRING,
      description:
        "Exam & reference book alignment tag, e.g. 'JEE Adv 2022 Pattern · HC Verma', 'NEET PYQ Pattern · NCERT', 'JAC Class 10 Pattern', 'ICSE Selina Pattern'.",
    },
    stem: {
      type: Type.STRING,
      description:
        'Full question text. Use standard LaTeX math inside $...$ or $$...$$ and inorganic formulas inside $\\ce{...}$.',
    },
    options: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          label: { type: Type.STRING, description: 'A, B, C, or D' },
          text: { type: Type.STRING },
          smiles: {
            type: Type.STRING,
            description: 'Optional SMILES string if the option itself is an organic chemical structure.',
          },
        },
        required: ['label', 'text'],
      },
      description:
        'Provide 4 options A-D for mcq/multiple_correct/assertion_reason, or 2 options True/False for true_false.',
    },
    assertion: { type: Type.STRING, description: 'Only for assertion_reason type.' },
    reason: { type: Type.STRING, description: 'Only for assertion_reason type.' },
    matchColumns: {
      type: Type.OBJECT,
      properties: {
        leftHeader: { type: Type.STRING },
        rightHeader: { type: Type.STRING },
        leftItems: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              key: { type: Type.STRING },
              text: { type: Type.STRING },
            },
            required: ['key', 'text'],
          },
        },
        rightItems: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              key: { type: Type.STRING },
              text: { type: Type.STRING },
            },
            required: ['key', 'text'],
          },
        },
      },
    },
    diagram: diagramSchema,
    correctAnswer: {
      type: Type.STRING,
      description:
        'Concise final answer key value (e.g. "B", "A, C", "True", "4.5 m/s", "P->2, Q->4, R->1, S->3").',
    },
    solutionSteps: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'Clear step-by-step academic solution with LaTeX math and reasoning.',
    },
  },
  required: ['number', 'type', 'stem', 'correctAnswer', 'solutionSteps'],
};

const dppResponseSchema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING },
    subtitle: { type: Type.STRING },
    questions: {
      type: Type.ARRAY,
      items: questionSchema,
    },
  },
  required: ['title', 'subtitle', 'questions'],
};

function buildPedagogicalPrompt(
  body: {
    classLevel: string;
    juniorBoard: string;
    juniorTier: string;
    seniorExam: string;
    subject: string;
    chapter: string;
    topic: string;
    questionTypes: string[];
    diagramPercentage: number;
    medium: string;
    referenceBooks: string[];
    customInstructions?: string;
  },
  batchCount: number,
  startNumber: number,
  avoidStems: string[] = [],
) {
  const isJunior = parseInt(body.classLevel, 10) <= 10;
  const boardOrExam = isJunior ? body.juniorBoard : body.seniorExam;
  const tierOrLevel = isJunior ? body.juniorTier : body.seniorExam;
  const targetDiagramCount = Math.round((batchCount * body.diagramPercentage) / 100);

  let levelCalibration = '';
  if (isJunior) {
    if (body.juniorTier === 'Olympiad Level') {
      levelCalibration = `CRITICAL CALIBRATION (Class ${body.classLevel} ${body.juniorBoard} — OLYMPIAD LEVEL):
- Match the exact rigor of IOQM / PRMO / RMO / NSEJS / IJSO / SOF Level-2 / NTSE Stage-2 archives and books like Pathfinder Olympiad, Hall & Knight, S.L. Loney.
- Avoid trivial textbook recall; test multi-step analytical reasoning, hidden constraints, clever algebraic/geometric insight, or experimental logic.`;
    } else {
      levelCalibration = `CRITICAL CALIBRATION (Class ${body.classLevel} ${body.juniorBoard} — SCHOOL / BOARD LEVEL):
- Match the exact latest ${body.juniorBoard} Board blueprint and model question paper style (${body.juniorBoard === 'JAC' ? 'Jharkhand Academic Council / JCERT pattern' : body.juniorBoard === 'ICSE' ? 'CISCE ICSE Selina / ML Aggarwal / analytical board pattern' : 'CBSE Competency & Case-based NCERT / RD Sharma pattern'}).
- Maintain strict Class ${body.classLevel} syllabus boundaries.`;
    }
  } else {
    if (body.seniorExam === 'JEE Advanced') {
      levelCalibration = `CRITICAL CALIBRATION (Class ${body.classLevel} — JEE ADVANCED IIT PATTERN):
- Match genuine JEE Advanced (IIT) PYQ depth and elite books: H.C. Verma, Irodov, Pathfinder, Cengage (BM Sharma / G. Tewani), Vikas Gupta (Black Book), Sameer Bansal, A. Das Gupta, S.L. Loney, Hall & Knight, M.S. Chouhan, N. Awasthi.
- NEVER generate trivial one-line NEET/board recall questions! Every problem must require multi-concept synthesis, calculus/vectors/functional analysis where natural, edge-case traps, stereochemical/mechanistic rigor, or subtle physical principles.`;
    } else if (body.seniorExam === 'JEE Mains') {
      levelCalibration = `CRITICAL CALIBRATION (Class ${body.classLevel} — JEE MAIN NTA LATEST PATTERN):
- Match recent 2022–2026 NTA JEE Main PYQ shifts and Cengage (G. Tewani / BM Sharma) / Arihant Skills in Mathematics / HC Verma problem standards.
- Balanced numerical calculation, formula synthesis, statement/assertion-reason, and subtle conceptual traps.`;
    } else if (body.seniorExam === 'NEET') {
      levelCalibration = `CRITICAL CALIBRATION (Class ${body.classLevel} — NEET UG MEDICAL PATTERN):
- Match latest NTA NEET (UG) PYQ pattern: strict NCERT line-by-line conceptual precision, NCERT Exemplar traps, assertion-reason, statement matching, and crisp speed-solvable physics/chemistry numericals (no heavy JEE-Advanced calculus).`;
    } else {
      levelCalibration = `CRITICAL CALIBRATION (Class ${body.classLevel} — BOARD EXAMS CBSE/JAC/ISC):
- Match latest Board Exam blueprint (1-mark MCQs/A&R, 2/3/5-mark derivations, RD Sharma / ML Aggarwal / SL Arora numericals, and conceptual board PYQs).`;
    }
  }

  return `You are a Principal Indian Olympiad & JEE/NEET/Board Paper-Setter for Classes 7–12 (authoring at the international publication standard of HC Verma, Cengage, Vikas Gupta Black Book, Sameer Bansal, Arihant, MS Chouhan, N. Awasthi, NCERT, ICSE Selina, and JAC/CBSE Boards).

TASK: Generate EXACTLY ${batchCount} ORIGINAL, MATHEMATICALLY VERIFIED questions numbered starting from ${startNumber} (${startNumber} to ${startNumber + batchCount - 1}).

TARGET SPECIFICATION:
- Class: Class ${body.classLevel}
- Board / Exam: ${boardOrExam} (${tierOrLevel})
- Subject: ${body.subject}
- Chapter: ${body.chapter}
- EXACT LOCKED TOPIC: "${body.topic}"

MANDATORY EXACT-TOPIC LOCK (ZERO TOLERANCE FOR OFF-TOPIC DRIFT):
- EVERY SINGLE QUESTION (Q${startNumber} to Q${startNumber + batchCount - 1}) MUST strictly and directly test ONLY "${body.topic}" within "${body.chapter}".
- NEVER include questions from neighboring topics, other sub-topics of "${body.chapter}", or general chapter mixes.
- Even if "${body.topic}" is a single narrow sub-topic, theorem, formula, or named reaction, keep 100% of questions locked directly onto "${body.topic}" by varying numerical setups, graphs/diagrams, edge cases, and question formats.

- Language Medium: ${body.medium}${body.medium === 'Bilingual' ? ' (Write each question stem cleanly in English followed by its exact Hindi translation in Devanagari)' : body.medium === 'Hindi' ? ' (Write all stems, options, and solutions in pure academic Hindi Devanagari, keeping mathematical symbols/equations in LaTeX)' : ''}
- Reference Calibration: ${body.referenceBooks.join(', ')}
- Allowed Question Types (distribute cleanly across these selected types): ${body.questionTypes.join(', ')}
- Diagram / Figure Requirement: Generate high-precision diagrams for AT LEAST ${targetDiagramCount} out of ${batchCount} questions (${body.diagramPercentage}%). If ${body.diagramPercentage} === 0, set diagram.kind = 'none' for all questions.

${levelCalibration}

SELF-VERIFICATION & DISTRACTOR QUALITY PROTOCOL (MANDATORY BEFORE OUTPUT):
1. Verify every single calculation, algebraic sign, boundary limit, dimensional unit, and chemical stoichiometry step-by-step internally BEFORE finalizing "correctAnswer" and "solutionSteps".
2. Ensure zero ambiguity: for single-correct MCQ, EXACTLY ONE option among (A), (B), (C), (D) must equal the verified answer; the other 3 distractors must represent realistic student mistakes (e.g., sign flip, missing factor of 2, wrong directing group, boundary confusion) — never absurd or obvious throwaway options.
3. For subjective/numerical proof questions, provide complete step-by-step mathematical derivations in solutionSteps using crisp LaTeX.
4. TOPIC-LOCK AUDIT: Before emitting each question, confirm it directly tests "${body.topic}" — discard and replace any question that drifts onto another topic of "${body.chapter}".

DIAGRAM & TYPESETTING RULES (INTERNATIONAL PUBLICATION STANDARD):
1. MATH & EQUATIONS: Use standard LaTeX wrapped in $...$ (inline) or $$...$$ (display). For inorganic formulas/reactions, use $\\ce{...}$. Double-escape backslashes properly in JSON strings (e.g. "\\\\frac{1}{2}").
2. ORGANIC CHEMISTRY STRUCTURES: Whenever an Organic Chemistry question involves benzene rings, substituted aromatics, cyclic molecules, stereoisomers, or reaction mechanisms:
   - Set diagram.kind = 'chemistry_smiles' with a valid canonical SMILES string (e.g. "c1ccccc1" for benzene, "Oc1ccccc1" for phenol, "O=[N+]([O-])c1ccccc1" for nitrobenzene), OR
   - Set diagram.kind = 'chemistry_reaction' with reactants (SMILES array), reagentsAbove, reagentsBelow, and products (SMILES array).
   - You may ALSO attach optional "smiles" directly on MCQ options.
3. PHYSICS / MATHEMATICS / GEOMETRY / BIOLOGY DIAGRAMS:
   - Set diagram.kind = 'svg' and provide clean, crisp, textbook-grade <svg viewBox="0 0 360 200" xmlns="http://www.w3.org/2000/svg">...</svg>.
   - Use stroke="currentColor" and fill="none" (or subtle fill-opacity="0.08"). Include clean <text> labels (font-family="serif" font-size="12" fill="currentColor") and arrowheads where needed. Ensure labels never overlap lines.
4. QUESTION TYPE RULES:
   - 'assertion_reason': populate "assertion", "reason", and 4 options A–D.
   - 'match_following': populate "matchColumns" (leftItems P,Q,R,S and rightItems 1,2,3,4) and 4 MCQ options A–D.
   - 'true_false': options A: True, B: False.
   - 'fill_blank': include "________" in stem.
   - 'subjective': leave options empty.
${avoidStems.length > 0 ? `\nDO NOT REPEAT OR PARAPHRASE THESE PREVIOUS QUESTIONS:\n${avoidStems.map((s, idx) => `${idx + 1}. ${s.slice(0, 90)}`).join('\n')}` : ''}
${body.customInstructions?.trim() ? `\nHIGH-PRIORITY TEACHER / ADMIN INSTRUCTIONS (MUST FOLLOW STRICTLY):\n${body.customInstructions.trim()}` : ''}`;
}

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/dpp/generate', async (req, res) => {
  const body = req.body;
  if (!body || !body.subject || !body.chapter || !body.topic) {
    return res.status(400).json({ error: 'Subject, chapter, and topic are required.' });
  }

  const wantsStream = req.headers.accept?.includes('application/x-ndjson');
  let heartbeat: ReturnType<typeof setInterval> | null = null;
  let clientAborted = false;

  req.on('close', () => {
    if (!res.writableEnded) {
      clientAborted = true;
    }
    if (heartbeat) clearInterval(heartbeat);
  });

  if (wantsStream) {
    res.setHeader('Content-Type', 'application/x-ndjson; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('X-Accel-Buffering', 'no');
    res.status(200);
    res.write(JSON.stringify({ type: 'progress', message: 'Initializing PYQ paper-setter...' }) + '\n');

    heartbeat = setInterval(() => {
      if (!res.writableEnded && !clientAborted) {
        res.write(JSON.stringify({ type: 'ping' }) + '\n');
      }
    }, 2000);
  }

  try {
    const totalRequested = Math.min(Math.max(Number(body.questionCount) || 5, 1), 30);
    const ai = getAiClient();
    const marks = Number(body.marksPerQuestion) || 4;
    const neg = Number(body.negativeMarks) || 0;
    const isJunior = parseInt(body.classLevel, 10) <= 10;
    const aiMode = body.aiMode === 'deep' ? 'deep' : 'fast';

    // Smart batch size: up to 10 questions per call (8 when heavy diagrams) so 30 questions cleanly split into 3-4 batches
    const batchSizes: number[] = [];
    let remaining = totalRequested;
    const maxBatch = Number(body.diagramPercentage) >= 70 ? 8 : 10;
    while (remaining > 0) {
      const size = Math.min(remaining, maxBatch);
      batchSizes.push(size);
      remaining -= size;
    }

    const allQuestions: Record<string, unknown>[] = [];
    let sheetTitle = '';
    let sheetSubtitle = '';

    const buildPayload = () => ({
      title: sheetTitle || `${body.subject} DPP — ${body.topic}`,
      subtitle:
        sheetSubtitle ||
        `Class ${body.classLevel} · ${isJunior ? `${body.juniorBoard} (${body.juniorTier})` : body.seniorExam}`,
      metadata: {
        classLevel: body.classLevel,
        boardOrExam: isJunior ? body.juniorBoard : body.seniorExam,
        tierOrLevel: isJunior ? body.juniorTier : body.seniorExam,
        subject: body.subject,
        chapter: body.chapter,
        topic: body.topic,
        referenceBooks: body.referenceBooks || [],
        medium: body.medium || 'English',
      },
      questions: [...allQuestions],
    });

    for (let bIdx = 0; bIdx < batchSizes.length; bIdx++) {
      if (clientAborted) {
        break;
      }
      if (bIdx > 0) {
        await sleep(1200);
      }
      if (clientAborted) {
        break;
      }

      const batchSize = batchSizes[bIdx];
      const startNum = allQuestions.length + 1;
      const avoidStems = allQuestions.map((q) => String(q.stem || ''));
      const prompt = buildPedagogicalPrompt(body, batchSize, startNum, avoidStems);

      const batchLabel =
        batchSizes.length > 1
          ? `Generating batch ${bIdx + 1}/${batchSizes.length} (Q${startNum}–Q${startNum + batchSize - 1})...`
          : undefined;

      if (batchLabel && wantsStream && !res.writableEnded && !clientAborted) {
        res.write(JSON.stringify({ type: 'progress', message: batchLabel }) + '\n');
      }

      const parsed = await callGeminiWithRetry<{
        title?: string;
        subtitle?: string;
        questions?: Record<string, unknown>[];
      }>(
        ai,
        prompt,
        dppResponseSchema,
        (msg) => {
          if (wantsStream && !res.writableEnded && !clientAborted) {
            res.write(
              JSON.stringify({
                type: 'progress',
                message: batchLabel ? `${batchLabel} ${msg}` : msg,
              }) + '\n',
            );
          }
        },
        {
          aiMode,
          validate: (data) => Array.isArray(data?.questions) && data.questions.length > 0,
        },
      );

      if (!sheetTitle && parsed.title) sheetTitle = parsed.title;
      if (!sheetSubtitle && parsed.subtitle) sheetSubtitle = parsed.subtitle;

      for (const q of parsed.questions || []) {
        const idx = allQuestions.length + 1;
        allQuestions.push({
          ...q,
          id: `q-${Date.now()}-${idx}`,
          number: idx,
          marks,
          negativeMarks:
            q.type === 'mcq' || q.type === 'multiple_correct' || q.type === 'assertion_reason' ? neg : 0,
        });
      }

      if (wantsStream && batchSizes.length > 1 && bIdx < batchSizes.length - 1 && !res.writableEnded && !clientAborted) {
        res.write(JSON.stringify({ type: 'batch', data: buildPayload() }) + '\n');
      }
    }

    if (heartbeat) clearInterval(heartbeat);
    if (clientAborted) {
      return;
    }

    const payload = buildPayload();

    if (wantsStream) {
      res.write(JSON.stringify({ type: 'result', data: payload }) + '\n');
      return res.end();
    }
    return res.json(payload);
  } catch (err: unknown) {
    if (heartbeat) clearInterval(heartbeat);
    if (clientAborted) {
      return;
    }
    console.error('Error generating DPP:', err);
    const cleanMsg = extractCleanErrorMessage(err);
    const isAuthErr = /API_KEY_INVALID|PERMISSION_DENIED|GEMINI_API_KEY is not configured/i.test(
      err instanceof Error ? err.message : '',
    );

    if (wantsStream) {
      if (!res.writableEnded) {
        res.write(JSON.stringify({ type: 'error', error: cleanMsg }) + '\n');
        res.end();
      }
      return;
    }
    return res.status(isAuthErr ? 403 : 500).json({ error: cleanMsg });
  }
});

app.post('/api/dpp/regenerate-question', async (req, res) => {
  try {
    const { metadata, existingQuestion, forceDiagram, customInstructions, aiMode } = req.body;
    if (!metadata || !existingQuestion) {
      return res.status(400).json({ error: 'Missing metadata or existingQuestion.' });
    }

    const ai = getAiClient();
    const prompt = `Regenerate ONE fresh, completely different, mathematically verified question (keeping the exact same question number ${existingQuestion.number} and type "${existingQuestion.type}") for:
- Class ${metadata.classLevel} (${metadata.boardOrExam} / ${metadata.tierOrLevel})
- Subject: ${metadata.subject}
- Chapter: ${metadata.chapter}
- EXACT LOCKED TOPIC (100% STRICT): "${metadata.topic}" (The regenerated question MUST strictly test ONLY "${metadata.topic}" — zero drift to any other topic!)
- Medium: ${metadata.medium}
- Reference Books: ${(metadata.referenceBooks || []).join(', ')}
- Diagram Requirement: ${forceDiagram ? 'MUST include a clean diagram (either SMILES/reaction for organic chemistry or crisp <svg viewBox="0 0 360 200"> with stroke="currentColor" for Physics/Math/Biology).' : 'Include a diagram if conceptually helpful.'}
${customInstructions ? `- Teacher Instruction: ${customInstructions}` : ''}

Do NOT repeat this previous stem: "${existingQuestion.stem}"
Verify algebra, units, and options internally. Use standard LaTeX ($...$ / $$...$$ / $\\ce{...}$) and return JSON matching the schema.`;

    const parsed = await callGeminiWithRetry<Record<string, unknown>>(ai, prompt, questionSchema, undefined, {
      aiMode: aiMode === 'deep' ? 'deep' : 'fast',
      validate: (q) => Boolean(q && q.stem && q.correctAnswer),
    });
    return res.json({
      ...parsed,
      id: `q-${Date.now()}-${existingQuestion.number}`,
      number: existingQuestion.number,
      marks: existingQuestion.marks,
      negativeMarks: existingQuestion.negativeMarks,
    });
  } catch (err: unknown) {
    console.error('Error regenerating question:', err);
    return res.status(500).json({ error: extractCleanErrorMessage(err) });
  }
});

app.post('/api/dpp/refine', async (req, res) => {
  try {
    const { dpp, instruction, aiMode } = req.body;
    if (!dpp || !Array.isArray(dpp.questions) || !instruction?.trim()) {
      return res.status(400).json({ error: 'Existing DPP and refinement instruction are required.' });
    }

    const ai = getAiClient();
    const compactQuestions = dpp.questions.map((q: Record<string, unknown>) => ({
      number: q.number,
      type: q.type,
      pyqTag: q.pyqTag,
      stem: q.stem,
      options: q.options,
      assertion: q.assertion,
      reason: q.reason,
      matchColumns: q.matchColumns,
      diagram: q.diagram,
      correctAnswer: q.correctAnswer,
      solutionSteps: q.solutionSteps,
    }));

    const prompt = `You are a Principal Indian Academic Editor & Paper-Setter.
Modify the existing DPP sheet below STRICTLY according to the Teacher's Refinement Instruction.

TEACHER'S REFINEMENT INSTRUCTION:
"${instruction.trim()}"

METADATA:
- Class: ${dpp.metadata?.classLevel} (${dpp.metadata?.boardOrExam} · ${dpp.metadata?.tierOrLevel})
- Subject: ${dpp.metadata?.subject}
- Chapter: ${dpp.metadata?.chapter}
- Topic: ${dpp.metadata?.topic}
- Medium: ${dpp.metadata?.medium}

RULES:
1. Keep the same question count (${compactQuestions.length}) unless the instruction explicitly asks to change it.
2. Preserve crisp LaTeX ($...$ / $$...$$ / $\\ce{...}$), valid SMILES for organic chemistry, and clean <svg viewBox="0 0 360 200"> with stroke="currentColor" for diagrams.
3. Verify every answer key and step-by-step solution after modifying.
4. Return the complete updated DPP JSON matching the schema.

CURRENT QUESTIONS JSON:
${JSON.stringify({ title: dpp.title, subtitle: dpp.subtitle, questions: compactQuestions })}`;

    const parsed = await callGeminiWithRetry<{
      title?: string;
      subtitle?: string;
      questions?: Record<string, unknown>[];
    }>(ai, prompt, dppResponseSchema, undefined, {
      aiMode: aiMode === 'deep' ? 'deep' : 'fast',
      validate: (data) => Array.isArray(data?.questions) && data.questions.length > 0,
    });

    const updatedQuestions = (parsed.questions || []).map((q, idx) => {
      const orig = dpp.questions[idx] || dpp.questions[0] || {};
      return {
        ...q,
        id: `q-${Date.now()}-${idx + 1}`,
        number: idx + 1,
        marks: Number(orig.marks) || 4,
        negativeMarks:
          q.type === 'mcq' || q.type === 'multiple_correct' || q.type === 'assertion_reason'
            ? Number(orig.negativeMarks) || 0
            : 0,
      };
    });

    return res.json({
      ...dpp,
      title: parsed.title || dpp.title,
      subtitle: parsed.subtitle || dpp.subtitle,
      isStarterPreview: false,
      questions: updatedQuestions,
    });
  } catch (err: unknown) {
    console.error('Error refining DPP:', err);
    return res.status(500).json({ error: extractCleanErrorMessage(err) });
  }
});

async function startServer() {
  const PORT = Number(process.env.PORT) || 3000;
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      const indexFile = path.join(distPath, 'index.html');
      if (fs.existsSync(indexFile)) {
        res.sendFile(indexFile);
      } else {
        res.status(404).send('Build output not found.');
      }
    });
  }

  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Safal DPP Studio server listening on http://localhost:${PORT}`);
  });
  server.requestTimeout = 180000;
  server.headersTimeout = 185000;
}

startServer();
