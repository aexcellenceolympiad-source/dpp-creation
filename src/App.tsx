import { useEffect, useRef, useState } from 'react';
import { Download, FileText, KeyRound, Printer, ZoomIn, ZoomOut, AlertCircle, Sparkles } from 'lucide-react';
import { DEFAULT_STYLE_CONFIG, getChaptersForSelection, getRecommendedBooks } from './data/curriculum';
import { getBlueprintStats, getSamplePaperBlueprint } from './data/samplePaperBlueprints';
import { STARTER_DPP } from './data/starterDpp';
import {
  AiProviderPref,
  AiReasoningMode,
  BatchGenerationPlan,
  DppDocument,
  DppQuestion,
  DppStyleConfig,
  GenerateDppPayload,
  PlannedBatch,
  TextStyleConfig,
} from './types/dpp';
import { StudioSidebar, SidebarTab } from './components/StudioSidebar';
import { DppPaperView } from './components/DppPaperView';
import { OfflineIndicator, PWAInstallButton } from './components/PWAInstallButton';

const STYLE_STORAGE_KEY = 'safal_dpp_style_v1';
const ACTIVE_DPP_STORAGE_KEY = 'safal_active_dpp_v1';
const HISTORY_DPP_STORAGE_KEY = 'safal_history_dpp_v1';
const RESUME_CHECKPOINT_STORAGE_KEY = 'safal_resume_checkpoint_v1';

interface SavedDppEntry {
  id: string;
  label: string;
  doc: DppDocument;
}

interface ResumeCheckpoint {
  title: string;
  subtitle: string;
  metadata: DppDocument['metadata'];
  totalQuestions: number;
  batches: PlannedBatch[];
  completedBatchIndices: number[];
  aiMode: AiReasoningMode;
  aiProvider: AiProviderPref;
}

function isValidResumeCheckpoint(val: unknown): val is ResumeCheckpoint {
  if (!val || typeof val !== 'object') return false;
  const cp = val as Record<string, unknown>;
  return Boolean(
    cp.metadata &&
      Array.isArray(cp.batches) &&
      cp.batches.length > 0 &&
      Array.isArray(cp.completedBatchIndices),
  );
}

function isValidDppDocument(val: unknown): val is DppDocument {
  if (!val || typeof val !== 'object') return false;
  const doc = val as Record<string, unknown>;
  return Boolean(doc.metadata && typeof doc.metadata === 'object' && Array.isArray(doc.questions));
}

function mergeTextStyle(
  saved: Partial<TextStyleConfig> | undefined,
  fallback: TextStyleConfig,
): TextStyleConfig {
  return {
    ...fallback,
    ...(saved || {}),
    underline: saved?.underline ?? fallback.underline,
  };
}

function mergeStyleConfig(raw: Partial<DppStyleConfig>): DppStyleConfig {
  const num = (v: unknown, fallback: number) =>
    typeof v === 'number' && Number.isFinite(v) ? v : fallback;
  const qSpacing = num(raw.questionSpacing, DEFAULT_STYLE_CONFIG.questionSpacing);

  return {
    ...DEFAULT_STYLE_CONFIG,
    ...raw,
    questionSpacing: qSpacing,
    mcqOptionsLayout: num(raw.mcqOptionsLayout, DEFAULT_STYLE_CONFIG.mcqOptionsLayout),
    letterSpacing: num(raw.letterSpacing, DEFAULT_STYLE_CONFIG.letterSpacing),
    wordSpacing: num(raw.wordSpacing, DEFAULT_STYLE_CONFIG.wordSpacing),
    lineHeight: num(raw.lineHeight, DEFAULT_STYLE_CONFIG.lineHeight),
    paragraphSpacing: num(raw.paragraphSpacing, qSpacing),
    pageMarginMm: num(raw.pageMarginMm, DEFAULT_STYLE_CONFIG.pageMarginMm),
    brandStyle: mergeTextStyle(raw.brandStyle, DEFAULT_STYLE_CONFIG.brandStyle),
    subtitleStyle: mergeTextStyle(raw.subtitleStyle, DEFAULT_STYLE_CONFIG.subtitleStyle),
    headerMetaStyle: mergeTextStyle(raw.headerMetaStyle, DEFAULT_STYLE_CONFIG.headerMetaStyle),
    chapterLineStyle: mergeTextStyle(raw.chapterLineStyle, DEFAULT_STYLE_CONFIG.chapterLineStyle),
    questionStyle: mergeTextStyle(raw.questionStyle, DEFAULT_STYLE_CONFIG.questionStyle),
    optionStyle: mergeTextStyle(raw.optionStyle, DEFAULT_STYLE_CONFIG.optionStyle),
    subjectiveStyle: mergeTextStyle(raw.subjectiveStyle, DEFAULT_STYLE_CONFIG.subjectiveStyle),
    matchLeftStyle: mergeTextStyle(raw.matchLeftStyle, DEFAULT_STYLE_CONFIG.matchLeftStyle),
    matchRightStyle: mergeTextStyle(raw.matchRightStyle, DEFAULT_STYLE_CONFIG.matchRightStyle),
    assertionStyle: mergeTextStyle(raw.assertionStyle, {
      ...DEFAULT_STYLE_CONFIG.assertionStyle,
      color: raw.assertionColor || DEFAULT_STYLE_CONFIG.assertionStyle.color,
    }),
    reasonStyle: mergeTextStyle(raw.reasonStyle, {
      ...DEFAULT_STYLE_CONFIG.reasonStyle,
      color: raw.reasonColor || DEFAULT_STYLE_CONFIG.reasonStyle.color,
    }),
    metaTagStyle: mergeTextStyle(raw.metaTagStyle, DEFAULT_STYLE_CONFIG.metaTagStyle),
    solutionStyle: mergeTextStyle(raw.solutionStyle, DEFAULT_STYLE_CONFIG.solutionStyle),
    footerStyle: mergeTextStyle(raw.footerStyle, DEFAULT_STYLE_CONFIG.footerStyle),
  };
}

export default function App() {
  const [sidebarTab, setSidebarTab] = useState<SidebarTab>('curriculum');
  const [docMode, setDocMode] = useState<'questions' | 'answers'>('questions');
  const [zoom, setZoom] = useState<number>(90);

  const [styleConfig, setStyleConfig] = useState<DppStyleConfig>(() => {
    try {
      const saved = localStorage.getItem(STYLE_STORAGE_KEY);
      if (saved) {
        return mergeStyleConfig(JSON.parse(saved) as Partial<DppStyleConfig>);
      }
    } catch {
      // Ignore storage error
    }
    return DEFAULT_STYLE_CONFIG;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STYLE_STORAGE_KEY, JSON.stringify(styleConfig));
    } catch {
      // Ignore storage error
    }
  }, [styleConfig]);

  const initialChapters = getChaptersForSelection('12', 'Physics', 'JEE Advanced');

  const [form, setForm] = useState<GenerateDppPayload>({
    classLevel: '12',
    juniorBoard: 'CBSE',
    juniorTier: 'School Level',
    seniorExam: 'JEE Advanced',
    subject: 'Physics',
    chapter: initialChapters[2]?.chapter || initialChapters[0]?.chapter || 'Current Electricity',
    topic: initialChapters[2]?.topics[0] || initialChapters[0]?.topics[0] || 'Kirchhoff’s Laws (KCL/KVL), Cells & Grouping',
    questionCount: 10,
    questionTypes: ['mcq', 'match_following', 'assertion_reason', 'subjective'],
    diagramPercentage: 50,
    medium: 'English',
    referenceBooks: getRecommendedBooks('JEE Advanced', 'Physics').slice(0, 4),
    marksPerQuestion: 4,
    negativeMarks: 1,
    aiMode: 'fast',
    aiProvider: 'auto',
    customInstructions: '',
    paperType: 'dpp',
    topicMode: 'single',
    mixedTopics: initialChapters[2]?.topics[0]
      ? [{ chapter: initialChapters[2].chapter, topic: initialChapters[2].topics[0] }]
      : initialChapters[0]?.topics[0]
        ? [{ chapter: initialChapters[0].chapter, topic: initialChapters[0].topics[0] }]
        : [],
    sampleExamId: 'neet_180',
    sampleSyllabusScope: 'full',
    sampleDistributionMode: 'custom',
    sampleSelectedChapters: [],
  });

  const [providers, setProviders] = useState<{ gemini: boolean; groq: boolean }>({
    gemini: true,
    groq: false,
  });

  useEffect(() => {
    let active = true;
    fetch('/api/health')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (active && data?.providers) {
          setProviders({
            gemini: Boolean(data.providers.gemini),
            groq: Boolean(data.providers.groq),
          });
        }
      })
      .catch(() => {
        // Ignore silent cold-start warm-up error
      });
    return () => {
      active = false;
    };
  }, []);

  const [dpp, setDpp] = useState<DppDocument>(() => {
    try {
      const saved = localStorage.getItem(ACTIVE_DPP_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (isValidDppDocument(parsed)) return parsed;
      }
    } catch {
      // Ignore storage error
    }
    return STARTER_DPP;
  });

  const [history, setHistory] = useState<SavedDppEntry[]>(() => {
    try {
      const saved = localStorage.getItem(HISTORY_DPP_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter((entry) => entry && isValidDppDocument(entry.doc));
        }
      }
    } catch {
      // Ignore storage error
    }
    return [];
  });

  useEffect(() => {
    try {
      if (!dpp.isStarterPreview) {
        localStorage.setItem(ACTIVE_DPP_STORAGE_KEY, JSON.stringify(dpp));
      }
    } catch {
      // Ignore storage error
    }
  }, [dpp]);

  useEffect(() => {
    try {
      localStorage.setItem(HISTORY_DPP_STORAGE_KEY, JSON.stringify(history));
    } catch {
      // Ignore storage error
    }
  }, [history]);

  const [resumeCheckpoint, setResumeCheckpoint] = useState<ResumeCheckpoint | null>(() => {
    try {
      const saved = localStorage.getItem(RESUME_CHECKPOINT_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (
          isValidResumeCheckpoint(parsed) &&
          parsed.completedBatchIndices.length < parsed.batches.length
        ) {
          return parsed;
        }
      }
    } catch {
      // Ignore storage error
    }
    return null;
  });

  useEffect(() => {
    try {
      if (
        resumeCheckpoint &&
        resumeCheckpoint.completedBatchIndices.length < resumeCheckpoint.batches.length
      ) {
        localStorage.setItem(RESUME_CHECKPOINT_STORAGE_KEY, JSON.stringify(resumeCheckpoint));
      } else {
        localStorage.removeItem(RESUME_CHECKPOINT_STORAGE_KEY);
      }
    } catch {
      // Ignore storage error
    }
  }, [resumeCheckpoint]);

  const [isGenerating, setIsGenerating] = useState(false);
  const [isExporting, setIsExporting] = useState<'questions' | 'answers' | null>(null);
  const [isRefining, setIsRefining] = useState(false);
  const [refineInstruction, setRefineInstruction] = useState('');
  const [hasPartialBatch, setHasPartialBatch] = useState(false);
  const [progressMsg, setProgressMsg] = useState<string>('');
  const [regeneratingId, setRegeneratingId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const postJsonWithRetry = async (url: string, payload: unknown, retries = 2) => {
    for (let attempt = 0; attempt <= retries; attempt++) {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(45000),
      });

      const text = await res.text();
      let data: Record<string, unknown> = {};
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        data = {};
      }

      if (res.ok) {
        return data;
      }

      if ((res.status === 502 || res.status === 503 || res.status === 504) && attempt < retries) {
        await new Promise((r) => setTimeout(r, 1200 * (attempt + 1)));
        continue;
      }

      const errText =
        typeof data.error === 'string' && data.error
          ? data.error
          : `Server returned status ${res.status}. Please try again in a few seconds.`;
      throw new Error(errText);
    }
    throw new Error('Request failed after retries.');
  };

  const readNdjsonStream = async (
    res: Response,
    controller: AbortController,
    onEvent: (evt: {
      type: 'progress' | 'ping' | 'batch' | 'result' | 'error';
      message?: string;
      data?: DppDocument;
      error?: string;
    }) => void,
    inactivityTimeoutMs = 45000,
  ) => {
    if (!res.body) {
      throw new Error('Empty response stream.');
    }
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    const processLine = (rawLine: string) => {
      const trimmed = rawLine.trim();
      if (!trimmed) return;
      let evt: {
        type: 'progress' | 'ping' | 'batch' | 'result' | 'error';
        message?: string;
        data?: DppDocument;
        error?: string;
      };
      try {
        evt = JSON.parse(trimmed);
      } catch {
        return;
      }
      onEvent(evt);
    };

    try {
      while (true) {
        let timeoutId: ReturnType<typeof setTimeout> | undefined;
        const readResult = await Promise.race([
          reader.read(),
          new Promise<never>((_, reject) => {
            timeoutId = setTimeout(() => {
              controller.abort();
              reject(new Error('Connection stalled (no server update for 45s). Please click Retry.'));
            }, inactivityTimeoutMs);
          }),
        ]).finally(() => {
          if (timeoutId) clearTimeout(timeoutId);
        });

        if (readResult.done) {
          buffer += decoder.decode();
          if (buffer.trim()) {
            for (const tailLine of buffer.split('\n')) {
              processLine(tailLine);
            }
          }
          break;
        }

        buffer += decoder.decode(readResult.value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';
        for (const line of lines) {
          processLine(line);
        }
      }
    } finally {
      reader.releaseLock();
    }
  };

  const handleCancelGenerate = () => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
    setIsGenerating(false);
    setHasPartialBatch(false);
    setProgressMsg('');
  };

  const remainingResumeQs = resumeCheckpoint
    ? resumeCheckpoint.batches
        .filter((b) => !resumeCheckpoint.completedBatchIndices.includes(b.batchIndex))
        .reduce((sum, b) => sum + b.batchSize, 0)
    : 0;

  const abortableSleep = (ms: number, signal: AbortSignal) =>
    new Promise<void>((resolve, reject) => {
      if (signal.aborted) {
        reject(new DOMException('Aborted', 'AbortError'));
        return;
      }
      const timer = setTimeout(() => {
        signal.removeEventListener('abort', onAbort);
        resolve();
      }, ms);
      const onAbort = () => {
        clearTimeout(timer);
        reject(new DOMException('Aborted', 'AbortError'));
      };
      signal.addEventListener('abort', onAbort, { once: true });
    });

  const executeBatchPlan = async (
    initialCheckpoint: ResumeCheckpoint,
    seedQuestions: DppQuestion[],
    controller: AbortController,
  ) => {
    const completedSet = new Set<number>(initialCheckpoint.completedBatchIndices);
    const questionMap = new Map<number, DppQuestion>();
    for (const q of seedQuestions) {
      questionMap.set(q.number, q);
    }

    let resolvedTitle = initialCheckpoint.title;
    let resolvedSubtitle = initialCheckpoint.subtitle;
    const isSample = initialCheckpoint.metadata.paperType === 'sample_paper';

    const pendingBatches = initialCheckpoint.batches.filter(
      (b) => !completedSet.has(b.batchIndex),
    );

    if (pendingBatches.length === 0) {
      setResumeCheckpoint(null);
      setIsGenerating(false);
      return;
    }

    if (seedQuestions.length > 0) {
      setHasPartialBatch(true);
    }

    let nextQueueIdx = 0;
    let rateLimitCooldownUntil = 0;
    let firstFatalErr: string | null = null;
    const CONCURRENCY = Math.min(2, pendingBatches.length);

    const runSingleBatchRequest = async (batch: PlannedBatch) => {
      const maxAttempts = 3;
      let lastErrMsg = 'Batch request failed.';

      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        if (controller.signal.aborted) {
          throw new DOMException('Aborted', 'AbortError');
        }

        const waitMs = rateLimitCooldownUntil - Date.now();
        if (waitMs > 0) {
          setProgressMsg(
            `Rate limit cooldown (${Math.ceil(waitMs / 1000)}s) before Q${batch.startNum}–Q${batch.startNum + batch.batchSize - 1}...`,
          );
          await abortableSleep(waitMs, controller.signal);
        }

        const subjPrefix = batch.subjectTag ? `${batch.subjectTag} · ` : '';
        setProgressMsg(
          attempt === 1
            ? `${subjPrefix}Generating Batch ${batch.batchIndex + 1}/${initialCheckpoint.batches.length} (Q${batch.startNum}–Q${batch.startNum + batch.batchSize - 1})...`
            : `${subjPrefix}Retrying Q${batch.startNum}–Q${batch.startNum + batch.batchSize - 1} (Attempt ${attempt}/${maxAttempts})...`,
        );

        const timeoutSignal = AbortSignal.timeout(70000);
        const combinedSignal =
          typeof AbortSignal.any === 'function'
            ? AbortSignal.any([controller.signal, timeoutSignal])
            : controller.signal;

        try {
          const res = await fetch('/api/dpp/generate-batch', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              batch,
              aiMode: initialCheckpoint.aiMode,
              aiProvider: initialCheckpoint.aiProvider,
            }),
            signal: combinedSignal,
          });

          const text = await res.text();
          let data: {
            title?: string;
            subtitle?: string;
            questions?: DppQuestion[];
            error?: string;
          } = {};
          try {
            data = text ? JSON.parse(text) : {};
          } catch {
            data = {};
          }

          if (res.ok && Array.isArray(data.questions) && data.questions.length > 0) {
            return data;
          }

          lastErrMsg = data.error || `Server status ${res.status}`;
          const isAuth =
            res.status === 403 ||
            /API_KEY_INVALID|PERMISSION_DENIED|not configured/i.test(lastErrMsg);
          if (isAuth) {
            throw new Error(lastErrMsg);
          }

          const isRateLimit =
            res.status === 429 || /rate limit|429|RESOURCE_EXHAUSTED/i.test(lastErrMsg);
          const isTransient =
            isRateLimit ||
            res.status === 502 ||
            res.status === 503 ||
            res.status === 504 ||
            /took too long|503|high demand|overloaded|TIMEOUT|Empty JSON/i.test(lastErrMsg);

          if (attempt < maxAttempts && isTransient) {
            if (isRateLimit) {
              rateLimitCooldownUntil = Date.now() + 14000 * attempt;
              await abortableSleep(14000 * attempt, controller.signal);
            } else {
              await abortableSleep(2500 * attempt, controller.signal);
            }
            continue;
          }
          throw new Error(lastErrMsg);
        } catch (err) {
          if (controller.signal.aborted) {
            throw new DOMException('Aborted', 'AbortError');
          }
          const msg = err instanceof Error ? err.message : String(err);
          const isTimedOut =
            (err as { name?: string })?.name === 'TimeoutError' ||
            /timed out|failed to fetch|network/i.test(msg);
          if (attempt < maxAttempts && isTimedOut) {
            lastErrMsg = 'Request timed out; retrying automatically...';
            await abortableSleep(2500 * attempt, controller.signal);
            continue;
          }
          throw err;
        }
      }
      throw new Error(lastErrMsg);
    };

    const runWorker = async () => {
      while (!controller.signal.aborted && !firstFatalErr) {
        const idx = nextQueueIdx++;
        if (idx >= pendingBatches.length) break;
        const batch = pendingBatches[idx];

        try {
          const batchRes = await runSingleBatchRequest(batch);
          if (controller.signal.aborted) break;

          if (!isSample && batchRes.title && resolvedTitle === initialCheckpoint.title) {
            resolvedTitle = batchRes.title;
          }
          if (!isSample && batchRes.subtitle && resolvedSubtitle === initialCheckpoint.subtitle) {
            resolvedSubtitle = batchRes.subtitle;
          }

          for (let n = batch.startNum; n < batch.startNum + batch.batchSize; n++) {
            questionMap.delete(n);
          }
          for (const q of batchRes.questions || []) {
            questionMap.set(q.number, q);
          }

          completedSet.add(batch.batchIndex);
          const mergedQuestions = Array.from(questionMap.values()).sort(
            (a, b) => a.number - b.number,
          );

          const updatedDoc: DppDocument = {
            title: resolvedTitle,
            subtitle: resolvedSubtitle,
            metadata: initialCheckpoint.metadata,
            questions: mergedQuestions,
            isStarterPreview: false,
          };

          setDpp(updatedDoc);
          setHasPartialBatch(true);

          const nextCheckpoint: ResumeCheckpoint = {
            ...initialCheckpoint,
            title: resolvedTitle,
            subtitle: resolvedSubtitle,
            completedBatchIndices: Array.from(completedSet),
          };
          setResumeCheckpoint(
            completedSet.size >= initialCheckpoint.batches.length ? null : nextCheckpoint,
          );
        } catch (err) {
          if (controller.signal.aborted || (err as { name?: string })?.name === 'AbortError') {
            break;
          }
          firstFatalErr = err instanceof Error ? err.message : 'Batch generation paused.';
          break;
        }
      }
    };

    try {
      await Promise.all(Array.from({ length: CONCURRENCY }, () => runWorker()));
      if (controller.signal.aborted) return;

      const finalQuestions = Array.from(questionMap.values()).sort(
        (a, b) => a.number - b.number,
      );
      const allCompleted = completedSet.size >= initialCheckpoint.batches.length;

      if (allCompleted && finalQuestions.length > 0) {
        const finalDoc: DppDocument = {
          title: resolvedTitle,
          subtitle: resolvedSubtitle,
          metadata: initialCheckpoint.metadata,
          questions: finalQuestions,
          isStarterPreview: false,
        };
        setDpp(finalDoc);
        setResumeCheckpoint(null);
        setHistory((prev) => {
          const docTag =
            finalDoc.metadata.paperType === 'sample_paper'
              ? 'Sample'
              : finalDoc.metadata.paperType === 'test'
                ? 'Test'
                : 'DPP';
          const entry: SavedDppEntry = {
            id: `sheet-${Date.now()}`,
            label: `[${docTag}] Class ${finalDoc.metadata.classLevel} ${finalDoc.metadata.subject} · ${finalDoc.metadata.topic} (${finalDoc.questions.length} Qs)`,
            doc: finalDoc,
          };
          return [entry, ...prev].slice(0, 8);
        });
        setDocMode('questions');
      } else if (firstFatalErr) {
        setErrorMsg(
          finalQuestions.length > 0
            ? `${finalQuestions.length}/${initialCheckpoint.totalQuestions} Qs saved. ${firstFatalErr} Click "Continue Remaining" to resume from next batch.`
            : firstFatalErr,
        );
      }
    } finally {
      if (abortControllerRef.current === controller) {
        abortControllerRef.current = null;
      }
      setIsGenerating(false);
      setHasPartialBatch(false);
      setProgressMsg('');
    }
  };

  const handleGenerate = async () => {
    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setErrorMsg(null);
    setIsGenerating(true);
    setHasPartialBatch(false);
    setProgressMsg('Preparing batch plan...');

    const activeSampleBp =
      form.paperType === 'sample_paper'
        ? getSamplePaperBlueprint(form.sampleExamId || 'neet_180')
        : null;
    const activeSampleStats = activeSampleBp
      ? getBlueprintStats(
          activeSampleBp,
          activeSampleBp.isMultiSubject ? activeSampleBp.defaultBoardSubject : form.subject,
        )
      : null;

    const activeMix =
      form.topicMode === 'mixed'
        ? form.mixedTopics && form.mixedTopics.length > 0
          ? form.mixedTopics
          : [{ chapter: form.chapter, topic: form.topic }]
        : [];
    const uniqueMixChapters = Array.from(new Set(activeMix.map((m) => m.chapter.trim()).filter(Boolean)));
    const uniqueMixTopics = Array.from(new Set(activeMix.map((m) => m.topic.trim()).filter(Boolean)));

    const requestPayload: GenerateDppPayload =
      form.paperType === 'sample_paper' && activeSampleBp && activeSampleStats
        ? {
            ...form,
            paperType: 'sample_paper',
            sampleExamId: activeSampleBp.id,
            sampleSyllabusScope: form.sampleSyllabusScope || 'full',
            sampleDistributionMode: form.sampleDistributionMode || 'custom',
            sampleSelectedChapters: form.sampleSelectedChapters || [],
            questionCount: activeSampleStats.totalQuestions,
            classLevel: activeSampleBp.id === 'cbse_10_board' ? '10' : '12',
            subject: activeSampleBp.isMultiSubject
              ? activeSampleBp.subjects.join(' · ')
              : activeSampleBp.subjects.includes(form.subject)
                ? form.subject
                : activeSampleBp.defaultBoardSubject,
            chapter:
              form.sampleSyllabusScope === 'selected' && (form.sampleSelectedChapters?.length || 0) > 0
                ? `Selected Chapters (${form.sampleSelectedChapters!.length} · ${(form.sampleDistributionMode || 'custom') === 'custom' ? 'Custom Qs' : 'Equal Split'})`
                : 'Full Official Syllabus (Equal Split)',
            topic: activeSampleBp.examHeaderTag,
          }
        : form.topicMode === 'mixed' && activeMix.length > 0
          ? {
              ...form,
              topicMode: 'mixed',
              mixedTopics: activeMix,
              chapter:
                uniqueMixChapters.length <= 2
                  ? uniqueMixChapters.join(', ')
                  : `${uniqueMixChapters.slice(0, 2).join(', ')} +${uniqueMixChapters.length - 2} more`,
              topic:
                uniqueMixTopics.length <= 3
                  ? `Mixed Topics (${uniqueMixTopics.length}): ${uniqueMixTopics.join(' · ')}`
                  : `Mixed Topics (${uniqueMixTopics.length}): ${uniqueMixTopics.slice(0, 3).join(' · ')} +${uniqueMixTopics.length - 3} more`,
            }
          : { ...form, topicMode: 'single' };

    try {
      let plan: BatchGenerationPlan | null = null;
      for (let attempt = 0; attempt <= 2; attempt++) {
        if (controller.signal.aborted) return;
        const res = await fetch('/api/dpp/plan-batches', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestPayload),
          signal: controller.signal,
        });

        if (!res.ok) {
          if ((res.status === 502 || res.status === 503 || res.status === 504) && attempt < 2) {
            setProgressMsg('Waking server & retrying automatically...');
            await abortableSleep(1500 * (attempt + 1), controller.signal);
            continue;
          }
          const txt = await res.text();
          let errJson: { error?: string } = {};
          try {
            errJson = JSON.parse(txt);
          } catch {
            // ignore
          }
          throw new Error(errJson.error || `Server error (${res.status}). Please retry.`);
        }

        plan = (await res.json()) as BatchGenerationPlan;
        break;
      }

      if (controller.signal.aborted) return;
      if (!plan || !Array.isArray(plan.batches) || plan.batches.length === 0) {
        throw new Error('Could not build batch plan.');
      }

      const freshCheckpoint: ResumeCheckpoint = {
        title: plan.title,
        subtitle: plan.subtitle,
        metadata: plan.metadata,
        totalQuestions: plan.totalQuestions,
        batches: plan.batches,
        completedBatchIndices: [],
        aiMode: form.aiMode,
        aiProvider: form.aiProvider || 'auto',
      };

      setDpp({
        title: plan.title,
        subtitle: plan.subtitle,
        metadata: plan.metadata,
        questions: [],
        isStarterPreview: false,
      });
      setDocMode('questions');
      setResumeCheckpoint(freshCheckpoint);

      await executeBatchPlan(freshCheckpoint, [], controller);
    } catch (err: unknown) {
      if ((err as { name?: string })?.name === 'AbortError') {
        setIsGenerating(false);
        setProgressMsg('');
        return;
      }
      setErrorMsg(err instanceof Error ? err.message : 'Unable to start generation.');
      setIsGenerating(false);
      setHasPartialBatch(false);
      setProgressMsg('');
    }
  };

  const handleResumeGenerate = async () => {
    if (!resumeCheckpoint || isGenerating) return;
    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setErrorMsg(null);
    setIsGenerating(true);
    setHasPartialBatch(dpp.questions.length > 0);
    setProgressMsg(`Resuming remaining ${remainingResumeQs} questions...`);

    const syncedCheckpoint: ResumeCheckpoint = {
      ...resumeCheckpoint,
      aiMode: form.aiMode,
      aiProvider: form.aiProvider || resumeCheckpoint.aiProvider || 'auto',
    };
    setResumeCheckpoint(syncedCheckpoint);
    await executeBatchPlan(syncedCheckpoint, dpp.questions, controller);
  };

  const handleRefineDpp = async (overrideInstruction?: string) => {
    const instruction = (overrideInstruction ?? refineInstruction).trim();
    if (!instruction || isRefining || isGenerating) return;
    const controller = new AbortController();
    setErrorMsg(null);
    setIsRefining(true);
    try {
      const res = await fetch('/api/dpp/refine', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/x-ndjson',
        },
        body: JSON.stringify({
          dpp,
          instruction,
          aiMode: form.aiMode,
          aiProvider: form.aiProvider || 'auto',
        }),
        signal: controller.signal,
      });

      if (!res.ok) {
        const txt = await res.text();
        let errJson: { error?: string } = {};
        try {
          errJson = JSON.parse(txt);
        } catch {
          // ignore
        }
        throw new Error(errJson.error || `Refine failed (${res.status}).`);
      }

      const contentType = res.headers.get('content-type') || '';
      let updated: DppDocument | null = null;
      if (!contentType.includes('ndjson') || !res.body) {
        updated = (await res.json()) as DppDocument;
      } else {
        await readNdjsonStream(res, controller, (evt) => {
          if (evt.type === 'result' && evt.data) {
            updated = evt.data;
          } else if (evt.type === 'error') {
            throw new Error(evt.error || 'Unable to refine DPP.');
          }
        });
      }

      if (!updated) {
        throw new Error('No refined DPP returned by server.');
      }
      setDpp(updated);
      setRefineInstruction('');
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Unable to refine DPP.');
    } finally {
      setIsRefining(false);
    }
  };

  const handleRegenerateQuestion = async (q: DppQuestion, forceDiagram?: boolean) => {
    setErrorMsg(null);
    setRegeneratingId(q.id);
    try {
      const data = (await postJsonWithRetry('/api/dpp/regenerate-question', {
        metadata: dpp.metadata,
        existingQuestion: q,
        forceDiagram,
        customInstructions: form.customInstructions,
        aiMode: form.aiMode,
        aiProvider: form.aiProvider || 'auto',
      })) as unknown as DppQuestion;
      setDpp((prev) => ({
        ...prev,
        questions: prev.questions.map((item) =>
          item.id === q.id
            ? {
                ...data,
                sectionLabel: data.sectionLabel ?? item.sectionLabel,
                subjectTag: data.subjectTag ?? item.subjectTag,
              }
            : item,
        ),
      }));
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Unable to regenerate question.');
    } finally {
      setRegeneratingId(null);
    }
  };

  const handleDeleteQuestion = (id: string) => {
    setDpp((prev) => {
      const remaining = prev.questions
        .filter((q) => q.id !== id)
        .map((q, idx) => ({ ...q, number: idx + 1 }));
      return { ...prev, questions: remaining };
    });
  };

  const handleUpdateQuestion = (updated: DppQuestion) => {
    setDpp((prev) => ({
      ...prev,
      questions: prev.questions.map((q) => (q.id === updated.id ? updated : q)),
    }));
  };

  const handleExportPdf = async (targetMode: 'questions' | 'answers') => {
    if (isExporting) return;
    setErrorMsg(null);
    setIsExporting(targetMode);

    const needsSwitch = docMode !== targetMode;
    if (needsSwitch) {
      setDocMode(targetMode);
    }

    const isTest = dpp.metadata?.paperType === 'test';
    const isSample = dpp.metadata?.paperType === 'sample_paper';
    const suffix =
      targetMode === 'questions'
        ? isSample
          ? 'Official-Sample-Paper'
          : isTest
            ? 'Test-Question-Paper'
            : 'DPP-Question-Sheet'
        : 'Answer-Key-Solutions';
    const cleanBrand = (styleConfig.brandName || 'Safal-DPP').replace(/[^a-zA-Z0-9_-]+/g, '-');
    const cleanSubj = (dpp.metadata.subject || 'Sheet').replace(/[^a-zA-Z0-9_-]+/g, '-');
    const fileName = `${cleanBrand}-${cleanSubj}-${suffix}.pdf`;

    try {
      // Wait for React mode switch + KaTeX/SVG DOM painting
      await new Promise((resolve) =>
        requestAnimationFrame(() => setTimeout(resolve, needsSwitch ? 180 : 60)),
      );

      const sheetEl = document.getElementById('dpp-export-sheet');
      if (!sheetEl) {
        throw new Error('Preview sheet not ready for export.');
      }

      const { exportDppToPdf } = await import('./utils/pdfExporter');
      await exportDppToPdf({
        sheetElement: sheetEl,
        styleConfig,
        fileName,
        mode: targetMode,
      });
    } catch (err: unknown) {
      console.error('Direct PDF export error:', err);
      setErrorMsg(
        err instanceof Error
          ? `PDF export failed: ${err.message}`
          : 'Unable to export PDF file. Try the Print button.',
      );
    } finally {
      setIsExporting(null);
    }
  };

  const handleSystemPrint = () => {
    const prevTitle = document.title;
    const isTest = dpp.metadata?.paperType === 'test';
    const isSample = dpp.metadata?.paperType === 'sample_paper';
    const suffix =
      docMode === 'questions'
        ? isSample
          ? 'Official-Sample-Paper'
          : isTest
            ? 'Test-Question-Paper'
            : 'DPP-Question-Sheet'
        : 'Answer-Key-Solutions';
    document.title = `${styleConfig.brandName.replace(/\s+/g, '-')}-${dpp.metadata.subject}-${suffix}`;
    window.print();
    setTimeout(() => {
      document.title = prevTitle;
    }, 500);
  };

  return (
    <div className="print-workspace-root min-h-screen flex flex-col bg-slate-100 text-slate-900">
      {/* Dynamic @page size and full-bleed background injection for Portrait vs Landscape PDF export */}
      <style>{`@media print { @page { size: A4 ${styleConfig.orientation}; margin: 0; } html, body { background-color: ${styleConfig.pageColor} !important; } }`}</style>

      {/* Top Bar Contract: 3 zones separated by gap-8 */}
      <header className="no-print sticky top-0 z-30 h-[57px] bg-white border-b border-slate-200 px-6 flex items-center justify-between gap-8">
        {/* Zone 1: Single-line Brand Wordmark */}
        <div className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0">
          Safal DPP Studio
        </div>

        {/* Zone 2: Clean single-line Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600">
          <button
            type="button"
            onClick={() => setSidebarTab('curriculum')}
            className={`py-1 border-b-2 transition-colors whitespace-nowrap shrink-0 ${
              sidebarTab === 'curriculum'
                ? 'border-blue-700 text-slate-900'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            01. Curriculum
          </button>
          <button
            type="button"
            onClick={() => setSidebarTab('branding')}
            className={`py-1 border-b-2 transition-colors whitespace-nowrap shrink-0 ${
              sidebarTab === 'branding'
                ? 'border-blue-700 text-slate-900'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            02. Page & Brand
          </button>
          <button
            type="button"
            onClick={() => setSidebarTab('typography')}
            className={`py-1 border-b-2 transition-colors whitespace-nowrap shrink-0 ${
              sidebarTab === 'typography'
                ? 'border-blue-700 text-slate-900'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            03. Style & Figures
          </button>
          <button
            type="button"
            onClick={() => setDocMode(docMode === 'questions' ? 'answers' : 'questions')}
            className={`py-1 border-b-2 transition-colors whitespace-nowrap shrink-0 ${
              docMode === 'answers'
                ? 'border-blue-700 text-slate-900'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            04. {docMode === 'answers' ? 'Viewing Answer Key' : 'Answer Key PDF'}
          </button>
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="shrink-0 flex items-center gap-2.5">
          <PWAInstallButton />
          <button
            type="button"
            disabled={isExporting !== null}
            onClick={() => handleExportPdf(docMode)}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 disabled:bg-slate-500 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Download className={`w-3.5 h-3.5 ${isExporting ? 'animate-bounce' : ''}`} />
            <span>
              {isExporting
                ? 'Exporting PDF...'
                : `Export ${docMode === 'questions' ? 'Question PDF' : 'Answer PDF'}`}
            </span>
          </button>
        </div>
      </header>

      {/* Main Split Workspace */}
      <div className="print-workspace-root flex-1 flex flex-col lg:flex-row">
        <StudioSidebar
          activeTab={sidebarTab}
          onTabChange={setSidebarTab}
          form={form}
          onFormChange={setForm}
          styleConfig={styleConfig}
          onStyleChange={setStyleConfig}
          onResetStyles={() => setStyleConfig(DEFAULT_STYLE_CONFIG)}
          onGenerate={handleGenerate}
          onResumeGenerate={handleResumeGenerate}
          remainingResumeQs={remainingResumeQs}
          onCancelGenerate={handleCancelGenerate}
          isGenerating={isGenerating}
          providers={providers}
        />

        {/* Right Live A4 Preview & Separate PDF Workspace */}
        <main className="print-workspace-main flex-1 flex flex-col min-w-0 lg:h-[calc(100vh-57px)] overflow-hidden">
          {/* Workspace Toolbar */}
          <div className="no-print bg-white border-b border-slate-200 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
            {/* Separate PDF Switcher: Question Paper vs Answer Key PDF */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
              <button
                type="button"
                onClick={() => setDocMode('questions')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                  docMode === 'questions'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Question Paper PDF ({dpp.questions.length})</span>
              </button>
              <button
                type="button"
                onClick={() => setDocMode('answers')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                  docMode === 'answers'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Answer Key & Solutions PDF ({dpp.questions.length})</span>
              </button>
            </div>

            {/* Metadata + Zoom + Separate PDF Print Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              {history.length > 0 && (
                <select
                  value=""
                  onChange={(e) => {
                    const found = history.find((h) => h.id === e.target.value);
                    if (found) {
                      setDpp(found.doc);
                      setDocMode('questions');
                    }
                  }}
                  aria-label="Load recent DPP sheet"
                  className="max-w-[200px] px-2 py-1 text-xs bg-slate-50 border border-slate-200 rounded-md text-slate-700 truncate"
                >
                  <option value="" disabled>
                    Recent Sheets ({history.length})
                  </option>
                  {history.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.label}
                    </option>
                  ))}
                </select>
              )}

              <div className="hidden xl:flex items-center gap-1.5 text-xs text-slate-500 tabular-nums">
                <span>{styleConfig.orientation === 'portrait' ? 'A4 Portrait' : 'A4 Landscape'}</span>
                <span aria-hidden="true">·</span>
                <span>{styleConfig.columns === 1 ? '1 Col' : '2 Cols'}</span>
                {dpp.isStarterPreview && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="text-blue-700 font-medium">Live Layout Preview</span>
                  </>
                )}
              </div>

              <div className="flex items-center gap-1 border border-slate-200 rounded-md px-1.5 py-1 bg-slate-50">
                <button
                  type="button"
                  onClick={() => setZoom((z) => Math.max(60, z - 10))}
                  className="p-0.5 text-slate-600 hover:text-slate-900"
                  title="Zoom out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="text-[11px] font-mono tabular-nums w-9 text-center text-slate-700">
                  {zoom}%
                </span>
                <button
                  type="button"
                  onClick={() => setZoom((z) => Math.min(130, z + 10))}
                  className="p-0.5 text-slate-600 hover:text-slate-900"
                  title="Zoom in"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={isExporting !== null}
                  onClick={() => handleExportPdf('questions')}
                  className="px-2.5 py-1.5 text-xs font-semibold border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-50 text-slate-800 rounded-md transition-colors whitespace-nowrap cursor-pointer"
                >
                  {isExporting === 'questions' ? 'Saving...' : 'Save Questions PDF'}
                </button>
                <button
                  type="button"
                  disabled={isExporting !== null}
                  onClick={() => handleExportPdf('answers')}
                  className="px-2.5 py-1.5 text-xs font-semibold border border-blue-200 bg-blue-50 hover:bg-blue-100 disabled:opacity-50 text-blue-800 rounded-md transition-colors whitespace-nowrap cursor-pointer"
                >
                  {isExporting === 'answers' ? 'Saving...' : 'Save Answer PDF'}
                </button>
                <button
                  type="button"
                  onClick={handleSystemPrint}
                  title="Print using browser print dialog"
                  className="p-1.5 text-slate-600 hover:text-slate-900 border border-slate-200 bg-white hover:bg-slate-50 rounded-md transition-colors cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Direct AI Refine Current Sheet Bar */}
          <div className="no-print bg-slate-50/90 border-b border-slate-200 px-4 py-2 flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-blue-800 shrink-0">
              <Sparkles className={`w-3.5 h-3.5 ${isRefining ? 'animate-spin' : ''}`} />
              <span>AI Refine Sheet:</span>
            </div>
            <input
              type="text"
              value={refineInstruction}
              onChange={(e) => setRefineInstruction(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleRefineDpp();
              }}
              placeholder="Give AI a direct command on this sheet (e.g. 'Make Q2 tougher', 'Translate to Hindi', 'Add diagrams to all questions')..."
              className="flex-1 min-w-[220px] px-2.5 py-1 text-xs bg-white border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <div className="hidden sm:flex items-center gap-1">
              {[
                { label: 'Harder Level', cmd: 'Upgrade all questions to tougher multi-concept rank-booster level.' },
                { label: 'Hindi Medium', cmd: 'Translate all questions, options, and solutions cleanly into academic Hindi Devanagari keeping LaTeX math.' },
                { label: 'Add Diagrams', cmd: 'Add crisp labelled SVG physics/math diagrams or SMILES structures wherever helpful.' },
              ].map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  disabled={isRefining || isGenerating}
                  onClick={() => handleRefineDpp(preset.cmd)}
                  className="px-2 py-1 text-[10.5px] font-semibold bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-800 border border-slate-200 rounded transition-colors disabled:opacity-50"
                >
                  {preset.label}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => handleRefineDpp()}
              disabled={isRefining || isGenerating || !refineInstruction.trim()}
              className="px-3 py-1 text-xs font-semibold bg-blue-700 hover:bg-blue-800 disabled:bg-slate-400 text-white rounded-md transition-colors whitespace-nowrap cursor-pointer"
            >
              {isRefining ? 'Refining...' : 'Apply AI Edit'}
            </button>
          </div>

          {/* Error / Pause-Resume Banner */}
          {errorMsg && (
            <div className="no-print mx-4 mt-3 p-3 bg-red-50 border border-red-200 rounded-lg flex flex-wrap items-center gap-2.5 text-xs text-red-800">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <div className="flex-1 min-w-[200px]">
                <span className="font-semibold">Paused: </span>
                <span>{errorMsg}</span>
              </div>
              {remainingResumeQs > 0 && (
                <button
                  type="button"
                  onClick={handleResumeGenerate}
                  disabled={isGenerating}
                  className="px-3 py-1 bg-emerald-700 text-white font-semibold rounded hover:bg-emerald-800 shrink-0 cursor-pointer"
                >
                  Continue Remaining (+{remainingResumeQs} Qs)
                </button>
              )}
              <button
                type="button"
                onClick={handleGenerate}
                disabled={isGenerating}
                className="px-2.5 py-1 bg-red-700 text-white font-semibold rounded hover:bg-red-800 shrink-0 cursor-pointer"
              >
                {remainingResumeQs > 0 ? 'Restart Fresh' : 'Retry'}
              </button>
              <button
                type="button"
                onClick={() => setErrorMsg(null)}
                className="text-red-700 hover:underline font-medium shrink-0 cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Resumable Checkpoint Banner (shown when paused or stopped with remaining batches) */}
          {!isGenerating && !errorMsg && remainingResumeQs > 0 && resumeCheckpoint && (
            <div className="no-print mx-4 mt-3 px-4 py-2.5 bg-amber-50 border border-amber-200 rounded-lg flex flex-wrap items-center justify-between gap-2.5 text-xs text-amber-950">
              <span className="font-medium">
                Saved Progress: <strong>{dpp.questions.length} / {resumeCheckpoint.totalQuestions} Qs</strong> generated ·{' '}
                <strong>{remainingResumeQs} Qs remaining</strong>
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleResumeGenerate}
                  className="px-3 py-1 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded cursor-pointer"
                >
                  Continue Remaining (+{remainingResumeQs} Qs)
                </button>
                <button
                  type="button"
                  onClick={() => setResumeCheckpoint(null)}
                  className="px-2 py-1 text-amber-800 hover:underline font-medium cursor-pointer"
                >
                  Discard
                </button>
              </div>
            </div>
          )}

          {/* Live progressive generation bar when first batch is already on screen */}
          {isGenerating && hasPartialBatch && (() => {
            const targetTotal =
              resumeCheckpoint?.totalQuestions ??
              (form.paperType === 'sample_paper'
                ? getBlueprintStats(
                    getSamplePaperBlueprint(form.sampleExamId || 'neet_180'),
                    form.subject,
                  ).totalQuestions
                : form.questionCount);
            return (
              <div className="no-print mx-4 mt-3 px-4 py-2.5 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between gap-3 text-xs text-blue-900">
                <span className="font-medium">
                  {progressMsg || `Adding remaining questions (${dpp.questions.length}/${targetTotal} ready)...`}
                </span>
                <div className="flex items-center gap-2.5 shrink-0">
                  <span className="font-mono tabular-nums font-semibold">
                    {dpp.questions.length}/{targetTotal}
                  </span>
                  <button
                    type="button"
                    onClick={handleCancelGenerate}
                    className="px-2 py-0.5 text-[11px] font-semibold text-red-700 bg-white border border-red-200 hover:bg-red-50 rounded cursor-pointer"
                  >
                    Pause
                  </button>
                </div>
              </div>
            );
          })()}

          {/* Generating Overlay (shown only before batch 1 arrives) */}
          {isGenerating && !hasPartialBatch ? (() => {
            const sampleBp =
              form.paperType === 'sample_paper'
                ? getSamplePaperBlueprint(form.sampleExamId || 'neet_180')
                : null;
            const sampleTotal = sampleBp
              ? getBlueprintStats(sampleBp, form.subject).totalQuestions
              : form.questionCount;
            return (
              <div className="no-print flex-1 flex flex-col items-center justify-center p-8 text-center">
                <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-xl p-8 space-y-4">
                  <div className="text-sm font-semibold text-slate-900">
                    {sampleBp
                      ? `Crafting ${sampleTotal}-Question Official ${sampleBp.title} (${form.sampleSyllabusScope === 'selected' ? 'Selected Chapters' : 'Full Syllabus'})...`
                      : `Crafting ${form.questionCount} PYQ-calibrated ${form.subject} ${
                          form.paperType === 'test' ? 'Test Paper' : 'DPP'
                        } questions for Class ${form.classLevel} (${
                          parseInt(form.classLevel, 10) <= 10
                            ? `${form.juniorBoard} · ${form.juniorTier}`
                            : form.seniorExam
                        })...`}
                  </div>
                  <p className="text-xs text-slate-500">
                    {progressMsg ||
                      `Typesetting LaTeX equations, rendering vector diagrams (${form.diagramPercentage}% target), and compiling separate Answer Key & Solutions.`}
                  </p>
                  <div className="space-y-3 pt-2">
                    <div className="h-4 bg-slate-100 rounded animate-pulse w-3/4 mx-auto" />
                    <div className="h-24 bg-slate-100 rounded animate-pulse" />
                    <div className="h-24 bg-slate-100 rounded animate-pulse" />
                  </div>
                </div>
              </div>
            );
          })() : (
            <div className="print-scroll-area flex-1 overflow-auto bg-slate-200/70">
              <DppPaperView
                dpp={dpp}
                styleConfig={styleConfig}
                mode={docMode}
                zoom={zoom}
                regeneratingId={regeneratingId}
                onRegenerateQuestion={handleRegenerateQuestion}
                onDeleteQuestion={handleDeleteQuestion}
                onUpdateQuestion={handleUpdateQuestion}
              />
            </div>
          )}
        </main>
      </div>
      <OfflineIndicator />
    </div>
  );
}
