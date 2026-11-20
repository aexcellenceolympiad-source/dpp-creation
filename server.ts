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

async function callGeminiWithRetry(
  ai: GoogleGenAI,
  prompt: string,
  schema: Record<string, unknown>,
  onProgress?: (msg: string) => void,
) {
  const now = Date.now();
  const attempts: { model: string; thinkingLevel?: ThinkingLevel; timeoutMs: number }[] = [
    { model: 'gemini-3.1-flash-lite', timeoutMs: 55000 },
    { model: 'gemini-3.1-flash-lite', timeoutMs: 55000 },
  ];

  if (now > hydrogenCooldownUntil) {
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
          ? `Generating with ${attempt.model}...`
          : `Switching to ${attempt.model} (attempt ${i + 1})...`,
      );

      const config: Record<string, unknown> = {
        responseMimeType: 'application/json',
        responseSchema: schema,
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
      return JSON.parse(rawText);
    } catch (err) {
      lastError = err;
      if (attempt.model === 'gemini-4-hydrogen' && isQuotaExhaustedError(err)) {
        // Put gemini-4-hydrogen on 1-hour cooldown so we immediately use gemini-3.1-flash-lite
        hydrogenCooldownUntil = Date.now() + 60 * 60 * 1000;
      }
      const reason = err instanceof Error ? err.message.slice(0, 140) : String(err);
      console.warn(`Gemini attempt ${i + 1} (${attempt.model}) failed: ${reason}`);
      if (!isRetryableError(err) || i === attempts.length - 1) {
        throw err;
      }
      await sleep(attempt.model === 'gemini-3.1-flash-lite' ? 1500 : 300);
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
- Match the exact rigor of IOQM / PRMO / NSEJS / IJSO / SOF Level-2 / NTSE Stage-2 archives.
- Avoid trivial textbook recall; test multi-step analytical reasoning, hidden constraints, clever algebraic/geometric insight, or experimental logic.`;
    } else {
      levelCalibration = `CRITICAL CALIBRATION (Class ${body.classLevel} ${body.juniorBoard} — SCHOOL / BOARD LEVEL):
- Match the exact latest ${body.juniorBoard} Board blueprint and model question paper style (${body.juniorBoard === 'JAC' ? 'Jharkhand Academic Council / JCERT pattern' : body.juniorBoard === 'ICSE' ? 'CISCE ICSE Selina / analytical board pattern' : 'CBSE Competency & Case-based NCERT pattern'}).
- Maintain strict Class ${body.classLevel} syllabus boundaries.`;
    }
  } else {
    if (body.seniorExam === 'JEE Advanced') {
      levelCalibration = `CRITICAL CALIBRATION (Class ${body.classLevel} — JEE ADVANCED IIT PATTERN):
- Match genuine JEE Advanced (IIT) PYQ depth and books like H.C. Verma, Irodov, Pathfinder, Cengage, M.S. Chouhan, N. Awasthi, Black Book.
- NEVER generate trivial one-line NEET/board recall questions! Every problem must require multi-concept synthesis, calculus/vectors where natural, edge-case analysis, stereochemical/mechanistic rigor, or subtle physical principles.`;
    } else if (body.seniorExam === 'JEE Mains') {
      levelCalibration = `CRITICAL CALIBRATION (Class ${body.classLevel} — JEE MAIN NTA LATEST PATTERN):
- Match recent 2022–2026 NTA JEE Main PYQ shifts and Cengage / Arihant / HC Verma problem standards.
- Balanced numerical calculation, formula synthesis, statement/assertion-reason, and conceptual traps.`;
    } else if (body.seniorExam === 'NEET') {
      levelCalibration = `CRITICAL CALIBRATION (Class ${body.classLevel} — NEET UG MEDICAL PATTERN):
- Match latest NTA NEET (UG) PYQ pattern: strict NCERT line-by-line conceptual precision, NCERT Exemplar traps, assertion-reason, statement matching, and crisp speed-solvable physics/chemistry numericals (no heavy JEE-Advanced calculus).`;
    } else {
      levelCalibration = `CRITICAL CALIBRATION (Class ${body.classLevel} — BOARD EXAMS CBSE/JAC/ISC):
- Match latest Board Exam blueprint (1-mark MCQs/A&R, 2/3/5-mark derivations, numericals, and conceptual board PYQs).`;
    }
  }

  return `You are a senior Indian academic paper-setter for Classes 7–12 (authoring at the standard of HC Verma, Cengage, Arihant, MS Chouhan, NCERT, ICSE Selina, and JAC/CBSE Boards).

TASK: Generate EXACTLY ${batchCount} questions numbered starting from ${startNumber} (${startNumber} to ${startNumber + batchCount - 1}).

TARGET SPECIFICATION:
- Class: Class ${body.classLevel}
- Board / Exam: ${boardOrExam} (${tierOrLevel})
- Subject: ${body.subject}
- Chapter: ${body.chapter}
- Focused Topic: ${body.topic} (STRICT: 100% of questions MUST stay strictly on "${body.topic}" within "${body.chapter}". Zero off-topic drift!)
- Language Medium: ${body.medium}${body.medium === 'Bilingual' ? ' (Write each question stem cleanly in English followed by its exact Hindi translation in Devanagari)' : body.medium === 'Hindi' ? ' (Write all stems, options, and solutions in pure academic Hindi Devanagari, keeping mathematical symbols/equations in LaTeX)' : ''}
- Reference Calibration: ${body.referenceBooks.join(', ')}
- Allowed Question Types (distribute cleanly across these selected types): ${body.questionTypes.join(', ')}
- Diagram / Figure Requirement: Generate high-precision diagrams for AT LEAST ${targetDiagramCount} out of ${batchCount} questions (${body.diagramPercentage}%). If ${body.diagramPercentage} === 0, set diagram.kind = 'none' for all questions.

${levelCalibration}

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
${avoidStems.length > 0 ? `\nDO NOT REPEAT THESE PREVIOUS QUESTIONS:\n${avoidStems.map((s, idx) => `${idx + 1}. ${s.slice(0, 90)}`).join('\n')}` : ''}
${body.customInstructions ? `\nEXTRA TEACHER INSTRUCTIONS:\n${body.customInstructions}` : ''}`;
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

  if (wantsStream) {
    res.setHeader('Content-Type', 'application/x-ndjson; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('X-Accel-Buffering', 'no');
    res.status(200);
    res.write(JSON.stringify({ type: 'progress', message: 'Initializing PYQ paper-setter...' }) + '\n');

    heartbeat = setInterval(() => {
      if (!res.writableEnded) {
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
      if (bIdx > 0) {
        await sleep(1200);
      }

      const batchSize = batchSizes[bIdx];
      const startNum = allQuestions.length + 1;
      const avoidStems = allQuestions.map((q) => String(q.stem || ''));
      const prompt = buildPedagogicalPrompt(body, batchSize, startNum, avoidStems);

      const batchLabel =
        batchSizes.length > 1
          ? `Generating batch ${bIdx + 1}/${batchSizes.length} (Q${startNum}–Q${startNum + batchSize - 1})...`
          : undefined;

      if (batchLabel && wantsStream && !res.writableEnded) {
        res.write(JSON.stringify({ type: 'progress', message: batchLabel }) + '\n');
      }

      const parsed = await callGeminiWithRetry(ai, prompt, dppResponseSchema, (msg) => {
        if (wantsStream && !res.writableEnded) {
          res.write(
            JSON.stringify({
              type: 'progress',
              message: batchLabel ? `${batchLabel} ${msg}` : msg,
            }) + '\n',
          );
        }
      });

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

      if (wantsStream && batchSizes.length > 1 && bIdx < batchSizes.length - 1 && !res.writableEnded) {
        res.write(JSON.stringify({ type: 'batch', data: buildPayload() }) + '\n');
      }
    }

    const payload = buildPayload();

    if (heartbeat) clearInterval(heartbeat);

    if (wantsStream) {
      res.write(JSON.stringify({ type: 'result', data: payload }) + '\n');
      return res.end();
    }
    return res.json(payload);
  } catch (err: unknown) {
    if (heartbeat) clearInterval(heartbeat);
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
    const { metadata, existingQuestion, forceDiagram } = req.body;
    if (!metadata || !existingQuestion) {
      return res.status(400).json({ error: 'Missing metadata or existingQuestion.' });
    }

    const ai = getAiClient();
    const prompt = `Regenerate ONE fresh, completely different question (keeping the exact same question number ${existingQuestion.number} and type "${existingQuestion.type}") for:
- Class ${metadata.classLevel} (${metadata.boardOrExam} / ${metadata.tierOrLevel})
- Subject: ${metadata.subject}
- Chapter: ${metadata.chapter}
- Topic: ${metadata.topic}
- Medium: ${metadata.medium}
- Reference Books: ${(metadata.referenceBooks || []).join(', ')}
- Diagram Requirement: ${forceDiagram ? 'MUST include a clean diagram (either SMILES/reaction for organic chemistry or crisp <svg viewBox="0 0 360 200"> with stroke="currentColor" for Physics/Math/Biology).' : 'Include a diagram if conceptually helpful.'}

Do NOT repeat this previous stem: "${existingQuestion.stem}"
Use standard LaTeX ($...$ / $$...$$ / $\\ce{...}$) and return JSON matching the schema.`;

    const parsed = await callGeminiWithRetry(ai, prompt, questionSchema);
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
