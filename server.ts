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

// Track model-specific cooldowns so we never repeatedly hit a 429-exhausted or 503-overloaded model
let hydrogenCooldownUntil = 0;
let groqPrimaryCooldownUntil = 0;

type AiProviderPref = 'auto' | 'groq' | 'gemini';
type QuestionType =
  | 'mcq'
  | 'multiple_correct'
  | 'assertion_reason'
  | 'true_false'
  | 'fill_blank'
  | 'match_following'
  | 'subjective';

const VALID_QUESTION_TYPES = new Set<QuestionType>([
  'mcq',
  'multiple_correct',
  'assertion_reason',
  'true_false',
  'fill_blank',
  'match_following',
  'subjective',
]);

function getAiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    return null;
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

function getGroqApiKey(): string | null {
  const key = process.env.GROQ_API_KEY?.trim();
  return key || null;
}

function isQuotaExhaustedError(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err);
  const status = (err as { status?: number })?.status;
  return status === 429 || /429|RESOURCE_EXHAUSTED|quota exceeded|rate.?limit/i.test(msg);
}

function isServiceUnavailableError(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err);
  const status = (err as { status?: number })?.status;
  return status === 503 || /503|UNAVAILABLE|high demand|overloaded/i.test(msg);
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
  if (/API_KEY_INVALID|PERMISSION_DENIED|No AI API key|GROQ_API_KEY is not configured/i.test(raw)) {
    return 'AI API key not configured or invalid. Check GEMINI_API_KEY or GROQ_API_KEY in Environment / Secrets.';
  }
  if (/429|RESOURCE_EXHAUSTED|quota exceeded|rate.?limit/i.test(raw)) {
    return 'Free-tier rate limit reached for this minute. Wait 20–40 seconds and click Retry, or switch Engine.';
  }
  if (/503|UNAVAILABLE|overloaded|high demand/i.test(raw)) {
    return 'Gemini free servers are currently experiencing high demand (503). Click Retry or add GROQ_API_KEY in Render Environment for instant backup.';
  }
  if (/TIMEOUT/i.test(raw)) {
    return 'AI response took too long. Retry or generate 5–10 questions at once.';
  }
  if (/ABORTED/i.test(raw)) {
    return 'Generation cancelled.';
  }
  try {
    const parsed = JSON.parse(raw);
    if (parsed?.error?.message) {
      return String(parsed.error.message).split('\n')[0];
    }
  } catch {
    // ignore
  }
  return raw.length > 240 ? raw.slice(0, 240) + '...' : raw;
}

function sleep(ms: number, signal?: AbortSignal): Promise<void> {
  if (signal?.aborted) {
    return Promise.reject(new Error('ABORTED'));
  }
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      signal?.removeEventListener('abort', onAbort);
      resolve();
    }, ms);
    const onAbort = () => {
      clearTimeout(timer);
      reject(new Error('ABORTED'));
    };
    signal?.addEventListener('abort', onAbort, { once: true });
  });
}

function withTimeout<T>(
  promise: Promise<T>,
  ms: number,
  label: string,
  signal?: AbortSignal,
): Promise<T> {
  if (signal?.aborted) {
    return Promise.reject(new Error('ABORTED'));
  }
  return new Promise((resolve, reject) => {
    const onAbort = () => {
      clearTimeout(timer);
      reject(new Error('ABORTED'));
    };
    const timer = setTimeout(() => {
      signal?.removeEventListener('abort', onAbort);
      reject(new Error(`TIMEOUT: ${label} exceeded ${ms}ms`));
    }, ms);
    signal?.addEventListener('abort', onAbort, { once: true });

    promise
      .then((val) => {
        clearTimeout(timer);
        signal?.removeEventListener('abort', onAbort);
        resolve(val);
      })
      .catch((err) => {
        clearTimeout(timer);
        signal?.removeEventListener('abort', onAbort);
        reject(err);
      });
  });
}

function extractJsonText(raw: string): string {
  const trimmed = raw.trim();
  const fencedMatch = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  if (fencedMatch) {
    return fencedMatch[1].trim();
  }
  const firstBrace = trimmed.indexOf('{');
  const lastBrace = trimmed.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    return trimmed.slice(firstBrace, lastBrace + 1);
  }
  return trimmed;
}

function cleanLatexText(val: unknown): string {
  if (val == null) return '';
  return String(val)
    .replace(/\t(?=(?:heta|imes|ext|an|au|riangle|frac|binom|o\b))/g, '\\t')
    .replace(/\f(?=(?:rac|orall|lat))/g, '\\f')
    .replace(/\r(?=(?:ho|ight|eg|angle))/g, '\\r')
    .replace(/\x08(?=(?:eta|ar|inom|egin|ig|ullet|ecause))/g, '\\b');
}

function normalizeQuestion(
  raw: Record<string, unknown>,
  number: number,
  marks: number,
  neg: number,
  allowedTypes: string[],
): Record<string, unknown> {
  const fallbackType = (
    VALID_QUESTION_TYPES.has(allowedTypes[0] as QuestionType) ? allowedTypes[0] : 'mcq'
  ) as QuestionType;
  const rawType = typeof raw.type === 'string' ? (raw.type.trim() as QuestionType) : fallbackType;
  const type: QuestionType = VALID_QUESTION_TYPES.has(rawType) ? rawType : fallbackType;

  const rawOptions = Array.isArray(raw.options) ? raw.options : [];
  const options =
    type === 'subjective' || type === 'fill_blank'
      ? []
      : rawOptions
          .filter((o): o is Record<string, unknown> => Boolean(o && typeof o === 'object'))
          .map((o, idx) => ({
            label:
              typeof o.label === 'string' && o.label.trim()
                ? o.label.trim()
                : String.fromCharCode(65 + idx),
            text: cleanLatexText(o.text),
            ...(typeof o.smiles === 'string' && o.smiles.trim() ? { smiles: o.smiles.trim() } : {}),
          }));

  let matchColumns: Record<string, unknown> | undefined;
  if (type === 'match_following' && raw.matchColumns && typeof raw.matchColumns === 'object') {
    const mc = raw.matchColumns as Record<string, unknown>;
    const leftItems = Array.isArray(mc.leftItems)
      ? mc.leftItems
          .filter((item): item is Record<string, unknown> => Boolean(item && typeof item === 'object'))
          .map((item, idx) => ({
            key: typeof item.key === 'string' && item.key.trim() ? item.key.trim() : ['P', 'Q', 'R', 'S'][idx] || String(idx + 1),
            text: cleanLatexText(item.text),
          }))
      : [];
    const rightItems = Array.isArray(mc.rightItems)
      ? mc.rightItems
          .filter((item): item is Record<string, unknown> => Boolean(item && typeof item === 'object'))
          .map((item, idx) => ({
            key: typeof item.key === 'string' && item.key.trim() ? item.key.trim() : String(idx + 1),
            text: cleanLatexText(item.text),
          }))
      : [];
    if (leftItems.length > 0 || rightItems.length > 0) {
      matchColumns = {
        leftHeader: typeof mc.leftHeader === 'string' && mc.leftHeader.trim() ? mc.leftHeader : 'Column I',
        rightHeader: typeof mc.rightHeader === 'string' && mc.rightHeader.trim() ? mc.rightHeader : 'Column II',
        leftItems,
        rightItems,
      };
    }
  }

  let diagram: Record<string, unknown> = { kind: 'none' };
  if (raw.diagram && typeof raw.diagram === 'object') {
    const d = raw.diagram as Record<string, unknown>;
    const kind = typeof d.kind === 'string' ? d.kind.trim() : 'none';
    const captionProp =
      typeof d.caption === 'string' && d.caption.trim()
        ? { caption: cleanLatexText(d.caption.trim()) }
        : {};

    if (kind === 'math_plot' && d.mathPlot && typeof d.mathPlot === 'object') {
      diagram = { kind: 'math_plot', mathPlot: d.mathPlot, ...captionProp };
    } else if (kind === 'geometry' && d.geometry && typeof d.geometry === 'object') {
      diagram = { kind: 'geometry', geometry: d.geometry, ...captionProp };
    } else if (kind === 'physics_diagram' && d.physics && typeof d.physics === 'object') {
      diagram = { kind: 'physics_diagram', physics: d.physics, ...captionProp };
    } else if (kind === 'svg' && typeof d.svgCode === 'string' && d.svgCode.includes('<svg')) {
      diagram = {
        kind: 'svg',
        svgCode: d.svgCode,
        ...captionProp,
      };
    } else if (kind === 'chemistry_smiles' && typeof d.smiles === 'string' && d.smiles.trim()) {
      diagram = {
        kind: 'chemistry_smiles',
        smiles: d.smiles.trim(),
        ...captionProp,
      };
    } else if (kind === 'chemistry_reaction' && d.reaction && typeof d.reaction === 'object') {
      const rx = d.reaction as Record<string, unknown>;
      const reactants = Array.isArray(rx.reactants)
        ? rx.reactants.filter((s): s is string => typeof s === 'string' && s.trim().length > 0)
        : [];
      const products = Array.isArray(rx.products)
        ? rx.products.filter((s): s is string => typeof s === 'string' && s.trim().length > 0)
        : [];
      if (reactants.length > 0 || products.length > 0) {
        diagram = {
          kind: 'chemistry_reaction',
          reaction: {
            reactants,
            reagentsAbove: typeof rx.reagentsAbove === 'string' ? cleanLatexText(rx.reagentsAbove) : '',
            reagentsBelow: typeof rx.reagentsBelow === 'string' ? cleanLatexText(rx.reagentsBelow) : '',
            products,
          },
          ...captionProp,
        };
      }
    }
  }

  const solutionSteps = Array.isArray(raw.solutionSteps)
    ? raw.solutionSteps.map((s) => cleanLatexText(s)).filter((s) => s.trim().length > 0)
    : typeof raw.solutionSteps === 'string' && raw.solutionSteps.trim()
      ? [cleanLatexText(raw.solutionSteps.trim())]
      : [];

  return {
    id: `q-${Date.now()}-${number}-${Math.random().toString(36).slice(2, 6)}`,
    number,
    type,
    marks,
    negativeMarks:
      type === 'mcq' || type === 'multiple_correct' || type === 'assertion_reason' ? neg : 0,
    ...(typeof raw.pyqTag === 'string' && raw.pyqTag.trim() ? { pyqTag: raw.pyqTag.trim() } : {}),
    stem: cleanLatexText(raw.stem),
    ...(options.length > 0 ? { options } : {}),
    ...(type === 'assertion_reason' && typeof raw.assertion === 'string'
      ? { assertion: cleanLatexText(raw.assertion) }
      : {}),
    ...(type === 'assertion_reason' && typeof raw.reason === 'string'
      ? { reason: cleanLatexText(raw.reason) }
      : {}),
    ...(matchColumns ? { matchColumns } : {}),
    diagram,
    correctAnswer: cleanLatexText(raw.correctAnswer),
    solutionSteps:
      solutionSteps.length > 0 ? solutionSteps : ['Apply the standard concept and verify values.'],
  };
}

async function callGroqJson<T>(
  groqKey: string,
  prompt: string,
  isSingleQuestion: boolean,
  onProgress?: (msg: string) => void,
  signal?: AbortSignal,
): Promise<T> {
  const now = Date.now();
  const groqModels =
    now < groqPrimaryCooldownUntil
      ? ['openai/gpt-oss-120b', 'llama-3.1-8b-instant', 'llama-3.3-70b-versatile']
      : ['llama-3.3-70b-versatile', 'openai/gpt-oss-120b', 'llama-3.1-8b-instant'];

  const diagramExample = `{"kind":"none|math_plot|geometry|physics_diagram|chemistry_smiles|chemistry_reaction|svg","mathPlot":{"xMin":-5,"xMax":5,"yMin":-5,"yMax":5,"functions":[{"expr":"x^2-2*x","label":"y=x^2-2x"}],"lines":[{"a":1,"b":-1,"c":0,"label":"y=x"}],"points":[{"x":0,"y":0,"label":"O"}]},"geometry":{"vertices":[{"id":"A","x":0,"y":0,"label":"A"},{"id":"B","x":4,"y":0,"label":"B"},{"id":"C","x":2,"y":3,"label":"C"}],"segments":[{"from":"A","to":"B"},{"from":"B","to":"C"},{"from":"C","to":"A"}]},"physics":{"preset":"incline_block|pulley_two_mass|circuit_loop|ray_optics|projectile|fbd_block","angleDeg":30,"mass1":"m1"},"smiles":"c1ccccc1","reaction":{"reactants":["c1ccccc1"],"reagentsAbove":"HNO3 / H2SO4","products":["O=[N+]([O-])c1ccccc1"]},"svgCode":"<svg viewBox='0 0 360 190' ...>","caption":"optional"}`;

  const jsonContract = isSingleQuestion
    ? `Return ONLY a valid JSON object matching this exact structure:
{
  "number": 1,
  "type": "mcq|multiple_correct|assertion_reason|true_false|fill_blank|match_following|subjective",
  "pyqTag": "string",
  "stem": "string with EVERY math/angle wrapped in $...$ LaTeX",
  "options": [{"label":"A","text":"$30^\\\\circ$","smiles":"optional"}],
  "assertion": "optional string",
  "reason": "optional string",
  "matchColumns": {"leftHeader":"Column I","rightHeader":"Column II","leftItems":[{"key":"P","text":"..."}],"rightItems":[{"key":"1","text":"..."}]},
  "diagram": ${diagramExample},
  "correctAnswer": "string",
  "solutionSteps": ["step 1", "step 2"]
}`
    : `Return ONLY a valid JSON object matching this exact structure:
{
  "title": "DPP Title",
  "subtitle": "Subtitle",
  "questions": [
    {
      "number": 1,
      "type": "mcq|multiple_correct|assertion_reason|true_false|fill_blank|match_following|subjective",
      "pyqTag": "string",
      "stem": "string with EVERY math/angle wrapped in $...$ LaTeX",
      "options": [{"label":"A","text":"$30^\\\\circ$","smiles":"optional"}],
      "assertion": "optional string",
      "reason": "optional string",
      "matchColumns": {"leftHeader":"Column I","rightHeader":"Column II","leftItems":[{"key":"P","text":"..."}],"rightItems":[{"key":"1","text":"..."}]},
      "diagram": ${diagramExample},
      "correctAnswer": "string",
      "solutionSteps": ["step 1", "step 2"]
    }
  ]
}`;

  let lastGroqErr: unknown;
  for (const model of groqModels) {
    if (signal?.aborted) throw new Error('ABORTED');
    try {
      onProgress?.(`Generating with Groq (${model})...`);
      const controller = new AbortController();
      const onOuterAbort = () => controller.abort();
      signal?.addEventListener('abort', onOuterAbort, { once: true });

      const res = await withTimeout(
        fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${groqKey}`,
          },
          signal: controller.signal,
          body: JSON.stringify({
            model,
            temperature: 0.35,
            max_tokens: isSingleQuestion ? 1600 : 4096,
            response_format: { type: 'json_object' },
            messages: [
              {
                role: 'system',
                content: `You are a Principal Indian IIT-JEE / NEET / CBSE / ICSE Academic Paper-Setter. ${jsonContract}`,
              },
              { role: 'user', content: prompt },
            ],
          }),
        }).finally(() => {
          signal?.removeEventListener('abort', onOuterAbort);
        }),
        24000,
        `groq:${model}`,
        signal,
      );

      if (!res.ok) {
        const errText = await res.text();
        if (res.status === 429 && model === 'llama-3.3-70b-versatile') {
          groqPrimaryCooldownUntil = Date.now() + 90 * 1000;
        }
        throw new Error(`Groq ${res.status}: ${errText.slice(0, 180)}`);
      }
      const data = (await res.json()) as {
        choices?: { message?: { content?: string } }[];
      };
      const content = data.choices?.[0]?.message?.content?.trim();
      if (!content) {
        throw new Error('Empty JSON response from Groq.');
      }
      return JSON.parse(extractJsonText(content)) as T;
    } catch (err) {
      if ((err instanceof Error && err.message === 'ABORTED') || signal?.aborted) {
        throw new Error('ABORTED');
      }
      lastGroqErr = err;
      console.warn(`Groq attempt (${model}) failed:`, err instanceof Error ? err.message : err);
    }
  }
  throw lastGroqErr;
}

async function callAiWithRetry<T = any>(
  ai: GoogleGenAI | null,
  prompt: string,
  schema: Record<string, unknown>,
  onProgress?: (msg: string) => void,
  options?: {
    aiMode?: 'deep' | 'fast';
    aiProvider?: AiProviderPref;
    isSingleQuestion?: boolean;
    signal?: AbortSignal;
    validate?: (parsed: T) => boolean;
  },
): Promise<T> {
  const signal = options?.signal;
  if (signal?.aborted) throw new Error('ABORTED');

  const groqKey = getGroqApiKey();
  const providerPref: AiProviderPref = options?.aiProvider || 'auto';
  const isDeep = options?.aiMode === 'deep';

  if (providerPref === 'groq' && !groqKey) {
    throw new Error('GROQ_API_KEY is not configured in server Environment / Secrets.');
  }
  if (!ai && !groqKey) {
    throw new Error('No AI API key configured (GEMINI_API_KEY or GROQ_API_KEY).');
  }

  const tryGroq = async (): Promise<T | null> => {
    if (!groqKey) return null;
    const groqParsed = await callGroqJson<T>(
      groqKey,
      prompt,
      Boolean(options?.isSingleQuestion),
      onProgress,
      signal,
    );
    if (options?.validate && !options.validate(groqParsed)) {
      throw new Error('Incomplete question batch returned by Groq.');
    }
    return groqParsed;
  };

  // Fast path: Use Groq FIRST whenever user chose Groq OR Auto + Fast mode with GROQ_API_KEY configured
  const shouldPreferGroqFirst =
    Boolean(groqKey) && (providerPref === 'groq' || (providerPref === 'auto' && !isDeep));

  let lastError: unknown;

  if (shouldPreferGroqFirst) {
    try {
      const groqRes = await tryGroq();
      if (groqRes) return groqRes;
    } catch (err) {
      if ((err instanceof Error && err.message === 'ABORTED') || signal?.aborted) {
        throw new Error('ABORTED');
      }
      lastError = err;
      // If user explicitly forced Groq and Gemini is absent, fail cleanly
      if (!ai) {
        throw err;
      }
    }
  }

  // Gemini attempts
  if (ai) {
    const now = Date.now();
    const attempts: { model: string; thinkingLevel?: ThinkingLevel; timeoutMs: number }[] = [];

    if (isDeep && now > hydrogenCooldownUntil) {
      attempts.push({
        model: 'gemini-4-hydrogen',
        thinkingLevel: ThinkingLevel.MEDIUM,
        timeoutMs: 18000,
      });
    }

    attempts.push({
      model: 'gemini-3.1-flash-lite',
      thinkingLevel: isDeep ? ThinkingLevel.HIGH : undefined,
      timeoutMs: 32000,
    });

    // Only enqueue a second Gemini retry if we don't have Groq backup waiting
    if (!groqKey || providerPref === 'gemini') {
      attempts.push({ model: 'gemini-3.1-flash-lite', timeoutMs: 32000 });
    }

    for (let i = 0; i < attempts.length; i++) {
      if (signal?.aborted) throw new Error('ABORTED');
      const attempt = attempts[i];
      try {
        onProgress?.(
          i === 0
            ? `Generating with ${attempt.model}${isDeep && attempt.thinkingLevel ? ' (Deep)' : ''}...`
            : `Retrying with ${attempt.model}...`,
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
          signal,
        );

        const rawText = (response.text ?? '{}').trim();
        if (!rawText || rawText === '{}') {
          throw new Error('Empty JSON response from Gemini model.');
        }
        const parsed = JSON.parse(extractJsonText(rawText)) as T;
        if (options?.validate && !options.validate(parsed)) {
          throw new Error('Incomplete question batch returned by model.');
        }
        return parsed;
      } catch (err) {
        if ((err instanceof Error && err.message === 'ABORTED') || signal?.aborted) {
          throw new Error('ABORTED');
        }
        lastError = err;
        const isQuota = isQuotaExhaustedError(err);
        const is503 = isServiceUnavailableError(err);
        if (attempt.model === 'gemini-4-hydrogen') {
          if (isQuota) {
            hydrogenCooldownUntil = Date.now() + 60 * 60 * 1000;
          } else if (is503 || /TIMEOUT/i.test(err instanceof Error ? err.message : '')) {
            hydrogenCooldownUntil = Date.now() + 10 * 60 * 1000;
          }
        }
        const reason = err instanceof Error ? err.message.slice(0, 140) : String(err);
        console.warn(`Gemini attempt ${i + 1} (${attempt.model}) failed: ${reason}`);

        // Instant failover to Groq if available and not already tried first
        if (
          groqKey &&
          !shouldPreferGroqFirst &&
          (is503 || isQuota || /TIMEOUT|Empty JSON/i.test(reason))
        ) {
          try {
            const groqRes = await tryGroq();
            if (groqRes) return groqRes;
          } catch (groqErr) {
            lastError = groqErr;
          }
        }

        if (
          (!isRetryableError(err) && !/Empty JSON|Incomplete question/i.test(reason)) ||
          i === attempts.length - 1
        ) {
          break;
        }
        await sleep(isQuota ? 2200 : 600, signal);
      }
    }
  }

  // Final Groq rescue if we haven't tried Groq yet
  if (groqKey && !shouldPreferGroqFirst) {
    try {
      const groqRes = await tryGroq();
      if (groqRes) return groqRes;
    } catch (groqErr) {
      lastError = groqErr;
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
        "Diagram kind: 'none', 'math_plot', 'geometry', 'physics_diagram', 'chemistry_smiles', 'chemistry_reaction', or 'svg'. Prefer parametric math_plot/geometry/physics_diagram/chemistry_* over raw svg.",
    },
    mathPlot: {
      type: Type.OBJECT,
      properties: {
        xMin: { type: Type.NUMBER },
        xMax: { type: Type.NUMBER },
        yMin: { type: Type.NUMBER },
        yMax: { type: Type.NUMBER },
        showGrid: { type: Type.BOOLEAN },
        functions: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              expr: { type: Type.STRING, description: "JS/math expression in x like 'x^2 - 4*x + 3', 'sin(2*x)', 'sqrt(x)'." },
              label: { type: Type.STRING },
              dashed: { type: Type.BOOLEAN },
            },
            required: ['expr'],
          },
        },
        lines: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              a: { type: Type.NUMBER },
              b: { type: Type.NUMBER },
              c: { type: Type.NUMBER },
              x1: { type: Type.NUMBER },
              y1: { type: Type.NUMBER },
              x2: { type: Type.NUMBER },
              y2: { type: Type.NUMBER },
              label: { type: Type.STRING },
              dashed: { type: Type.BOOLEAN },
            },
          },
        },
        circles: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              cx: { type: Type.NUMBER },
              cy: { type: Type.NUMBER },
              r: { type: Type.NUMBER },
              label: { type: Type.STRING },
              dashed: { type: Type.BOOLEAN },
            },
            required: ['cx', 'cy', 'r'],
          },
        },
        points: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              x: { type: Type.NUMBER },
              y: { type: Type.NUMBER },
              label: { type: Type.STRING },
              open: { type: Type.BOOLEAN },
            },
            required: ['x', 'y'],
          },
        },
        shade: {
          type: Type.OBJECT,
          properties: {
            exprTop: { type: Type.STRING },
            exprBottom: { type: Type.STRING },
            from: { type: Type.NUMBER },
            to: { type: Type.NUMBER },
          },
          required: ['exprTop', 'from', 'to'],
        },
      },
    },
    geometry: {
      type: Type.OBJECT,
      properties: {
        vertices: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              x: { type: Type.NUMBER },
              y: { type: Type.NUMBER },
              label: { type: Type.STRING },
            },
            required: ['id', 'x', 'y'],
          },
        },
        segments: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              from: { type: Type.STRING },
              to: { type: Type.STRING },
              label: { type: Type.STRING },
              dashed: { type: Type.BOOLEAN },
            },
            required: ['from', 'to'],
          },
        },
        circles: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              cx: { type: Type.NUMBER },
              cy: { type: Type.NUMBER },
              r: { type: Type.NUMBER },
              label: { type: Type.STRING },
            },
            required: ['cx', 'cy', 'r'],
          },
        },
        angleArcs: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              vertex: { type: Type.STRING },
              p1: { type: Type.STRING },
              p2: { type: Type.STRING },
              label: { type: Type.STRING },
              rightAngle: { type: Type.BOOLEAN },
            },
            required: ['vertex', 'p1', 'p2'],
          },
        },
      },
      required: ['vertices'],
    },
    physics: {
      type: Type.OBJECT,
      properties: {
        preset: {
          type: Type.STRING,
          description: "One of: 'incline_block', 'pulley_two_mass', 'circuit_loop', 'ray_optics', 'projectile', 'fbd_block'.",
        },
        angleDeg: { type: Type.NUMBER },
        mass1: { type: Type.STRING },
        mass2: { type: Type.STRING },
        hasPulley: { type: Type.BOOLEAN },
        topComponent: { type: Type.STRING },
        bottomComponent: { type: Type.STRING },
        leftComponent: { type: Type.STRING },
        rightComponent: { type: Type.STRING },
        emfLabel: { type: Type.STRING },
        currentLabel: { type: Type.STRING },
        opticsType: { type: Type.STRING },
        objectDistLabel: { type: Type.STRING },
        focalLabel: { type: Type.STRING },
        velocityLabel: { type: Type.STRING },
        rangeLabel: { type: Type.STRING },
        heightLabel: { type: Type.STRING },
      },
      required: ['preset'],
    },
    svgCode: {
      type: Type.STRING,
      description:
        "Compact self-contained <svg viewBox='0 0 360 190' ...> using stroke='currentColor' and fill='none'. Use only for Biology or diagrams not covered by math_plot/geometry/physics_diagram/chemistry_*.",
    },
    smiles: {
      type: Type.STRING,
      description:
        "Valid canonical SMILES string (e.g. 'c1ccccc1' for benzene, 'O=[N+]([O-])c1ccccc1' for nitrobenzene). Required when kind='chemistry_smiles'.",
    },
    reaction: {
      type: Type.OBJECT,
      properties: {
        reactants: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
        reagentsAbove: { type: Type.STRING },
        reagentsBelow: { type: Type.STRING },
        products: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
      },
    },
    caption: { type: Type.STRING },
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
    pyqTag: { type: Type.STRING },
    stem: {
      type: Type.STRING,
      description: 'Question stem with LaTeX inside $...$ / $$...$$ and inorganic formulas inside $\\ce{...}$.',
    },
    options: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          label: { type: Type.STRING },
          text: { type: Type.STRING },
          smiles: { type: Type.STRING },
        },
        required: ['label', 'text'],
      },
    },
    assertion: { type: Type.STRING },
    reason: { type: Type.STRING },
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
    correctAnswer: { type: Type.STRING },
    solutionSteps: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: '2-4 crisp, verified step-by-step solution bullets with LaTeX.',
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
    paperType?: string;
  },
  batchCount: number,
  startNumber: number,
  batchFocus?: string,
) {
  const isJunior = parseInt(body.classLevel, 10) <= 10;
  const boardOrExam = isJunior ? body.juniorBoard : body.seniorExam;
  const tierOrLevel = isJunior ? body.juniorTier : body.seniorExam;
  const targetDiagramCount = Math.round((batchCount * body.diagramPercentage) / 100);
  const isTestPaper = body.paperType === 'test';

  let levelCalibration = '';
  if (isJunior) {
    if (body.juniorTier === 'Olympiad Level') {
      levelCalibration = `LEVEL (Class ${body.classLevel} ${body.juniorBoard} Olympiad): Match IOQM/NSEJS/IJSO/NTSE Stage-2 & Pathfinder/Hall-Knight rigor with multi-step analytical insight.`;
    } else {
      levelCalibration = `LEVEL (Class ${body.classLevel} ${body.juniorBoard} Board): Match latest ${body.juniorBoard} blueprint (${body.juniorBoard === 'JAC' ? 'JCERT/JAC' : body.juniorBoard === 'ICSE' ? 'ICSE Selina/ML Aggarwal' : 'CBSE Competency NCERT/RD Sharma'}) strictly within Class ${body.classLevel} syllabus.`;
    }
  } else if (body.seniorExam === 'JEE Advanced') {
    levelCalibration = `LEVEL (Class ${body.classLevel} JEE Advanced IIT): Match IIT-JEE PYQ & HC Verma / Irodov / Black Book / Cengage / MS Chouhan depth. Multi-concept synthesis & subtle edge-case traps; zero trivial recall.`;
  } else if (body.seniorExam === 'JEE Mains') {
    levelCalibration = `LEVEL (Class ${body.classLevel} JEE Main NTA): Match 2022–2026 NTA JEE Main PYQ standard, Cengage/Arihant numerical & conceptual traps.`;
  } else if (body.seniorExam === 'NEET') {
    levelCalibration = `LEVEL (Class ${body.classLevel} NEET UG): Strict NCERT line-by-line precision, Exemplar traps, A&R, and fast numericals (no JEE Adv calculus).`;
  } else {
    levelCalibration = `LEVEL (Class ${body.classLevel} Board Exams): Match CBSE/JAC/ISC Board marking scheme, derivations, and NCERT/RD Sharma/SL Arora problems.`;
  }

  return `You are a Principal Indian IIT-JEE/NEET/Board Paper-Setter. Generate EXACTLY ${batchCount} ORIGINAL, VERIFIED questions numbered ${startNumber} to ${startNumber + batchCount - 1}.

SPEC:
- Class ${body.classLevel} · ${boardOrExam} (${tierOrLevel}) · Subject: ${body.subject}
- Chapter: ${body.chapter}
- EXACT LOCKED TOPIC (100% STRICT): "${body.topic}"
  -> Every single question MUST test ONLY "${body.topic}". Zero off-topic drift to other topics of "${body.chapter}".
- Medium: ${body.medium}${body.medium === 'Bilingual' ? ' (English stem + exact Hindi Devanagari translation below)' : body.medium === 'Hindi' ? ' (Academic Hindi Devanagari + LaTeX math)' : ''}
- Books: ${body.referenceBooks.join(', ')}
- Allowed Types (distribute cleanly): ${body.questionTypes.join(', ')}
- Document Mode: ${isTestPaper ? 'Formal Exam TEST QUESTION PAPER (balanced warm-up to discriminating exam-hall difficulty progression, zero casual hints in stems, formal exam phrasing).' : 'DPP (Daily Practice Problem Sheet for focused topic mastery).'}
- Diagrams: ${targetDiagramCount > 0 ? `Include clean diagrams for ~${targetDiagramCount}/${batchCount} Qs.` : `Set diagram.kind='none' for all Qs.`}
${batchFocus ? `- Batch Diversity Angle: ${batchFocus}` : ''}
${levelCalibration}

QUALITY, LATEX & DIAGRAM SPEED RULES:
1. Verify algebra, units, signs, and stoichiometry before finalizing "correctAnswer" & "solutionSteps". Single-correct MCQ must have 1 exact answer + 3 realistic distractors.
2. STRICT LATEX WRAPPING: Wrap EVERY math expression, variable, equation, degree/angle, and chemical formula in $...$ (e.g., "$30^\\\\circ$", "$\\\\frac{1}{2}$", "$\\\\ce{H2SO4}$"). NEVER write bare "30^\\circ" or "\\frac{1}{2}" outside $...$. Double-escape JSON backslashes properly. Keep "solutionSteps" crisp (2–4 steps).
3. FAST ZERO-ERROR DIAGRAMS (Prefer structured engines over raw SVG):
   - Organic Chemistry (benzene, substituted aromatics, mechanisms): use diagram.kind='chemistry_smiles' (valid SMILES like "c1ccccc1") or 'chemistry_reaction'.
   - Maths Graphs (lines, parabolas, trig, circles, shaded integrals): use diagram.kind='math_plot' with exact mathPlot bounds, functions/lines/circles/points/shade.
   - Euclidean/Coordinate Geometry (triangles, chords, tangents, angles): use diagram.kind='geometry' with exact vertices, segments, circles, angleArcs.
   - Physics Mechanics/Circuits/Optics/Projectiles: use diagram.kind='physics_diagram' with preset ('incline_block', 'pulley_two_mass', 'circuit_loop', 'ray_optics', 'projectile', 'fbd_block'), OR 'svg' only for custom setups/Biology.
4. Type format: 'assertion_reason' -> assertion, reason, 4 options A-D; 'match_following' -> matchColumns (P,Q,R,S & 1,2,3,4) + 4 options A-D; 'true_false' -> options A: True, B: False; 'fill_blank' -> "________" in stem; 'subjective' -> empty options.
${body.customInstructions?.trim() ? `\nTEACHER INSTRUCTIONS (STRICT):\n${body.customInstructions.trim()}` : ''}`;
}

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    providers: {
      gemini: Boolean(process.env.GEMINI_API_KEY?.trim()),
      groq: Boolean(process.env.GROQ_API_KEY?.trim()),
    },
  });
});

app.post('/api/dpp/generate', async (req, res) => {
  const body = req.body;
  if (!body || !body.subject || !body.chapter || !body.topic) {
    return res.status(400).json({ error: 'Subject, chapter, and topic are required.' });
  }

  const wantsStream = req.headers.accept?.includes('application/x-ndjson');
  const controller = new AbortController();
  let heartbeat: ReturnType<typeof setInterval> | null = null;
  let clientAborted = false;

  res.on('close', () => {
    if (!res.writableFinished && !res.writableEnded) {
      clientAborted = true;
      controller.abort();
    }
    if (heartbeat) {
      clearInterval(heartbeat);
      heartbeat = null;
    }
  });

  if (wantsStream) {
    res.setHeader('Content-Type', 'application/x-ndjson; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('X-Accel-Buffering', 'no');
    res.status(200);
    res.flushHeaders?.();
    res.write(JSON.stringify({ type: 'progress', message: 'Starting fast batch generator...' }) + '\n');

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
    const aiProvider: AiProviderPref =
      body.aiProvider === 'groq' || body.aiProvider === 'gemini' ? body.aiProvider : 'auto';
    const allowedTypes = Array.isArray(body.questionTypes) && body.questionTypes.length > 0
      ? body.questionTypes
      : ['mcq'];

    // Fast 5-question batches (4 when heavy diagrams) so Batch 1 appears within seconds & parallel pool finishes fast
    const batchSizes: number[] = [];
    let remaining = totalRequested;
    const maxBatch = Number(body.diagramPercentage) >= 70 ? 4 : 5;
    while (remaining > 0) {
      const size = Math.min(remaining, maxBatch);
      batchSizes.push(size);
      remaining -= size;
    }

    const batchAngles = [
      'Batch 1 ONLY: Focus on core definitions, basic facts/laws & direct foundational PYQ setups. Do NOT cover edge cases or comparative synthesis.',
      'Batch 2 ONLY: Focus on cause-effect reasoning, consequences, multi-step numerical/analytical problems & conceptual traps. NEVER repeat basic introductory recall.',
      'Batch 3 ONLY: Focus on graphical/diagrammatic interpretations, special boundary cases, comparative analysis & statement-based twists.',
      'Batch 4 ONLY: Focus on non-standard parameters, mixed constraints, exceptions & tricky exam variations.',
      'Batch 5 ONLY: Focus on high-yield reference-book / Exemplar rank-booster scenarios & critical evaluation.',
      'Batch 6 ONLY: Final distinct sweep of unique numerical/analytical cases not covered in Batches 1–5.',
    ];

    const batchResults: (Record<string, unknown>[] | null)[] = new Array(batchSizes.length).fill(null);
    let sheetTitle = '';
    let sheetSubtitle = '';
    let completedBatches = 0;

    const collectOrderedQuestions = (): Record<string, unknown>[] => {
      const collected: Record<string, unknown>[] = [];
      let num = 1;
      for (const batch of batchResults) {
        if (!batch) continue;
        for (const q of batch) {
          collected.push({ ...q, number: num++ });
        }
      }
      return collected;
    };

    const isTestPaper = body.paperType === 'test';
    const buildPayload = () => ({
      title:
        sheetTitle ||
        `${body.subject} ${isTestPaper ? 'Test Question Paper' : 'DPP'} — ${body.topic}`,
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
        paperType: isTestPaper ? 'test' : 'dpp',
      },
      questions: collectOrderedQuestions(),
    });

    // Compute starting question number for each batch upfront so concurrent execution stays numbered cleanly
    const batchOffsets: number[] = [];
    let runningOffset = 1;
    for (const sz of batchSizes) {
      batchOffsets.push(runningOffset);
      runningOffset += sz;
    }

    const CONCURRENCY = Math.min(2, batchSizes.length);
    let nextBatchIdx = 0;

    const runWorker = async () => {
      while (!clientAborted) {
        const bIdx = nextBatchIdx++;
        if (bIdx >= batchSizes.length) break;

        const batchSize = batchSizes[bIdx];
        const startNum = batchOffsets[bIdx];
        const angle = batchSizes.length > 1 ? batchAngles[bIdx % batchAngles.length] : undefined;
        const prompt = buildPedagogicalPrompt(body, batchSize, startNum, angle);
        const batchLabel =
          batchSizes.length > 1
            ? `Batch ${bIdx + 1}/${batchSizes.length} (Q${startNum}–Q${startNum + batchSize - 1})`
            : undefined;

        const parsed = await callAiWithRetry<{
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
                  message: batchLabel ? `${batchLabel}: ${msg}` : msg,
                }) + '\n',
              );
            }
          },
          {
            aiMode,
            aiProvider,
            signal: controller.signal,
            validate: (data) => Array.isArray(data?.questions) && data.questions.length > 0,
          },
        );

        if (clientAborted) break;

        if (!sheetTitle && parsed.title) sheetTitle = parsed.title;
        if (!sheetSubtitle && parsed.subtitle) sheetSubtitle = parsed.subtitle;

        const normalizedBatch = (parsed.questions || [])
          .slice(0, batchSize)
          .map((q, i) => normalizeQuestion(q, startNum + i, marks, neg, allowedTypes));

        batchResults[bIdx] = normalizedBatch;
        completedBatches++;

        if (
          wantsStream &&
          batchSizes.length > 1 &&
          completedBatches < batchSizes.length &&
          !res.writableEnded &&
          !clientAborted
        ) {
          res.write(JSON.stringify({ type: 'batch', data: buildPayload() }) + '\n');
        }
      }
    };

    await Promise.all(Array.from({ length: CONCURRENCY }, () => runWorker()));

    if (heartbeat) clearInterval(heartbeat);
    if (clientAborted) {
      return;
    }

    const payload = buildPayload();
    if (!payload.questions.length) {
      throw new Error('No questions returned by AI provider.');
    }

    if (wantsStream) {
      res.write(JSON.stringify({ type: 'result', data: payload }) + '\n');
      return res.end();
    }
    return res.json(payload);
  } catch (err: unknown) {
    if (heartbeat) clearInterval(heartbeat);
    if (clientAborted || (err instanceof Error && err.message === 'ABORTED')) {
      return;
    }
    console.error('Error generating DPP:', err);
    const cleanMsg = extractCleanErrorMessage(err);
    const isAuthErr = /API_KEY_INVALID|PERMISSION_DENIED|No AI API key|GROQ_API_KEY is not configured/i.test(
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
  const controller = new AbortController();
  res.on('close', () => {
    if (!res.writableFinished && !res.writableEnded) {
      controller.abort();
    }
  });

  try {
    const { metadata, existingQuestion, forceDiagram, customInstructions, aiMode, aiProvider } = req.body;
    if (!metadata || !existingQuestion) {
      return res.status(400).json({ error: 'Missing metadata or existingQuestion.' });
    }

    const ai = getAiClient();
    const prompt = `Regenerate ONE fresh, different, mathematically verified question (number ${existingQuestion.number}, type "${existingQuestion.type}") for:
- Class ${metadata.classLevel} (${metadata.boardOrExam} / ${metadata.tierOrLevel}) · ${metadata.subject}
- Chapter: ${metadata.chapter}
- EXACT LOCKED TOPIC (100% STRICT): "${metadata.topic}" (Zero drift to any other topic!)
- Medium: ${metadata.medium}
- Books: ${(metadata.referenceBooks || []).join(', ')}
- Diagram: ${forceDiagram ? 'Include a crisp diagram (SMILES/reaction for organic chemistry or <svg viewBox="0 0 360 190"> with stroke="currentColor" for Physics/Math/Bio).' : 'Include diagram if helpful.'}
${customInstructions ? `- Teacher Instruction: ${customInstructions}` : ''}
Do NOT repeat: "${existingQuestion.stem}"
Verify algebra, units, and options. Use $...$ LaTeX / $\\ce{...}$ and return JSON.`;

    const parsed = await callAiWithRetry<Record<string, unknown>>(ai, prompt, questionSchema, undefined, {
      aiMode: aiMode === 'deep' ? 'deep' : 'fast',
      aiProvider: aiProvider === 'groq' || aiProvider === 'gemini' ? aiProvider : 'auto',
      isSingleQuestion: true,
      signal: controller.signal,
      validate: (q) => Boolean(q && q.stem && q.correctAnswer != null),
    });

    const normalized = normalizeQuestion(
      parsed,
      Number(existingQuestion.number) || 1,
      Number(existingQuestion.marks) || 4,
      Number(existingQuestion.negativeMarks) || 0,
      [String(existingQuestion.type || 'mcq')],
    );
    return res.json(normalized);
  } catch (err: unknown) {
    if (err instanceof Error && err.message === 'ABORTED') return;
    console.error('Error regenerating question:', err);
    return res.status(500).json({ error: extractCleanErrorMessage(err) });
  }
});

app.post('/api/dpp/refine', async (req, res) => {
  const { dpp, instruction, aiMode, aiProvider } = req.body || {};
  if (!dpp || !Array.isArray(dpp.questions) || !instruction?.trim()) {
    return res.status(400).json({ error: 'Existing DPP and refinement instruction are required.' });
  }

  const wantsStream = req.headers.accept?.includes('application/x-ndjson');
  const controller = new AbortController();
  let heartbeat: ReturnType<typeof setInterval> | null = null;
  let clientAborted = false;

  res.on('close', () => {
    if (!res.writableFinished && !res.writableEnded) {
      clientAborted = true;
      controller.abort();
    }
    if (heartbeat) {
      clearInterval(heartbeat);
      heartbeat = null;
    }
  });

  if (wantsStream) {
    res.setHeader('Content-Type', 'application/x-ndjson; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('X-Accel-Buffering', 'no');
    res.status(200);
    res.flushHeaders?.();
    res.write(JSON.stringify({ type: 'progress', message: 'Applying AI refinement...' }) + '\n');

    heartbeat = setInterval(() => {
      if (!res.writableEnded && !clientAborted) {
        res.write(JSON.stringify({ type: 'ping' }) + '\n');
      }
    }, 2000);
  }

  try {
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

    const prompt = `Modify this existing DPP sheet strictly according to the Teacher's Instruction.
TEACHER INSTRUCTION: "${instruction.trim()}"
SPEC: Class ${dpp.metadata?.classLevel} (${dpp.metadata?.boardOrExam}) · ${dpp.metadata?.subject} · ${dpp.metadata?.chapter} · Topic: ${dpp.metadata?.topic} · Medium: ${dpp.metadata?.medium}
RULES:
1. Keep exact question count (${compactQuestions.length}) unless asked otherwise.
2. Preserve LaTeX ($...$ / $\\ce{...}$), valid SMILES, and compact <svg viewBox="0 0 360 190"> diagrams.
3. Verify answer keys & solutionSteps after modifying. Return complete JSON matching schema.

CURRENT SHEET:
${JSON.stringify({ title: dpp.title, subtitle: dpp.subtitle, questions: compactQuestions })}`;

    const parsed = await callAiWithRetry<{
      title?: string;
      subtitle?: string;
      questions?: Record<string, unknown>[];
    }>(
      ai,
      prompt,
      dppResponseSchema,
      (msg) => {
        if (wantsStream && !res.writableEnded && !clientAborted) {
          res.write(JSON.stringify({ type: 'progress', message: msg }) + '\n');
        }
      },
      {
        aiMode: aiMode === 'deep' ? 'deep' : 'fast',
        aiProvider: aiProvider === 'groq' || aiProvider === 'gemini' ? aiProvider : 'auto',
        signal: controller.signal,
        validate: (data) => Array.isArray(data?.questions) && data.questions.length > 0,
      },
    );

    if (heartbeat) clearInterval(heartbeat);
    if (clientAborted) return;

    const updatedQuestions = (parsed.questions || []).map((q, idx) => {
      const orig = dpp.questions[idx] || dpp.questions[0] || {};
      return normalizeQuestion(
        q,
        idx + 1,
        Number(orig.marks) || 4,
        Number(orig.negativeMarks) || 0,
        [String(orig.type || q.type || 'mcq')],
      );
    });

    const resultPayload = {
      ...dpp,
      title: parsed.title || dpp.title,
      subtitle: parsed.subtitle || dpp.subtitle,
      isStarterPreview: false,
      questions: updatedQuestions,
    };

    if (wantsStream) {
      res.write(JSON.stringify({ type: 'result', data: resultPayload }) + '\n');
      return res.end();
    }
    return res.json(resultPayload);
  } catch (err: unknown) {
    if (heartbeat) clearInterval(heartbeat);
    if (clientAborted || (err instanceof Error && err.message === 'ABORTED')) return;
    console.error('Error refining DPP:', err);
    const cleanMsg = extractCleanErrorMessage(err);
    if (wantsStream) {
      if (!res.writableEnded) {
        res.write(JSON.stringify({ type: 'error', error: cleanMsg }) + '\n');
        res.end();
      }
      return;
    }
    return res.status(500).json({ error: cleanMsg });
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
