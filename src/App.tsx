import { useEffect, useRef, useState } from 'react';
import { FileText, KeyRound, Printer, ZoomIn, ZoomOut, AlertCircle, Sparkles } from 'lucide-react';
import { DEFAULT_STYLE_CONFIG, getChaptersForSelection, getRecommendedBooks } from './data/curriculum';
import { STARTER_DPP } from './data/starterDpp';
import { DppDocument, DppQuestion, DppStyleConfig, GenerateDppPayload, TextStyleConfig } from './types/dpp';
import { StudioSidebar, SidebarTab } from './components/StudioSidebar';
import { DppPaperView } from './components/DppPaperView';
import { OfflineIndicator, PWAInstallButton } from './components/PWAInstallButton';

const STYLE_STORAGE_KEY = 'safal_dpp_style_v1';
const ACTIVE_DPP_STORAGE_KEY = 'safal_active_dpp_v1';
const HISTORY_DPP_STORAGE_KEY = 'safal_history_dpp_v1';

interface SavedDppEntry {
  id: string;
  label: string;
  doc: DppDocument;
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
  return {
    ...DEFAULT_STYLE_CONFIG,
    ...raw,
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

  const [isGenerating, setIsGenerating] = useState(false);
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

  const handleGenerate = async () => {
    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setErrorMsg(null);
    setIsGenerating(true);
    setHasPartialBatch(false);
    setProgressMsg('Connecting to fast paper-setter...');

    let latestPartial: DppDocument | null = null;

    try {
      let generated: DppDocument | null = null;
      for (let attempt = 0; attempt <= 2; attempt++) {
        if (controller.signal.aborted) return;
        const res = await fetch('/api/dpp/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/x-ndjson',
          },
          body: JSON.stringify(form),
          signal: controller.signal,
        });

        if (!res.ok) {
          if ((res.status === 502 || res.status === 503 || res.status === 504) && attempt < 2) {
            setProgressMsg('Waking server & retrying automatically...');
            await new Promise((r) => setTimeout(r, 1500 * (attempt + 1)));
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

        const contentType = res.headers.get('content-type') || '';
        if (!contentType.includes('ndjson') || !res.body) {
          const json = await res.json();
          generated = json as DppDocument;
          break;
        }

        await readNdjsonStream(res, controller, (evt) => {
          if (evt.type === 'progress' && evt.message) {
            setProgressMsg(evt.message);
          } else if (evt.type === 'batch' && evt.data) {
            latestPartial = evt.data;
            setDpp(evt.data);
            setHasPartialBatch(true);
            setDocMode('questions');
          } else if (evt.type === 'result' && evt.data) {
            generated = evt.data;
          } else if (evt.type === 'error') {
            throw new Error(evt.error || 'Failed to generate DPP.');
          }
        });
        break;
      }

      if (controller.signal.aborted) return;
      const finalDoc = generated || latestPartial;
      if (!finalDoc || !Array.isArray(finalDoc.questions) || finalDoc.questions.length === 0) {
        throw new Error('No DPP payload received from server.');
      }
      setDpp(finalDoc);
      setHistory((prev) => {
        const docTag = finalDoc.metadata.paperType === 'test' ? 'Test' : 'DPP';
        const entry: SavedDppEntry = {
          id: `sheet-${Date.now()}`,
          label: `[${docTag}] Class ${finalDoc.metadata.classLevel} ${finalDoc.metadata.subject} · ${finalDoc.metadata.topic} (${finalDoc.questions.length} Qs)`,
          doc: finalDoc,
        };
        return [entry, ...prev].slice(0, 8);
      });
      setDocMode('questions');
    } catch (err: unknown) {
      if ((err as { name?: string })?.name === 'AbortError' && !err?.toString().includes('stalled')) {
        return;
      }
      setErrorMsg(err instanceof Error ? err.message : 'Unable to generate DPP.');
    } finally {
      if (abortControllerRef.current === controller) {
        abortControllerRef.current = null;
      }
      setIsGenerating(false);
      setHasPartialBatch(false);
      setProgressMsg('');
    }
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
        questions: prev.questions.map((item) => (item.id === q.id ? data : item)),
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

  const handleExportPdf = (targetMode: 'questions' | 'answers') => {
    setDocMode(targetMode);
    const prevTitle = document.title;
    const isTest = dpp.metadata?.paperType === 'test';
    const suffix =
      targetMode === 'questions'
        ? isTest
          ? 'Test-Question-Paper'
          : 'DPP-Question-Sheet'
        : 'Answer-Key-Solutions';
    document.title = `${styleConfig.brandName.replace(/\s+/g, '-')}-${dpp.metadata.subject}-${suffix}`;

    // Wait one frame for mode switch if needed, then open print-to-PDF dialog
    requestAnimationFrame(() => {
      setTimeout(() => {
        window.print();
        document.title = prevTitle;
      }, 120);
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 text-slate-900">
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
            onClick={() => handleExportPdf(docMode)}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Export {docMode === 'questions' ? 'Question PDF' : 'Answer PDF'}</span>
          </button>
        </div>
      </header>

      {/* Main Split Workspace */}
      <div className="flex-1 flex flex-col lg:flex-row">
        <StudioSidebar
          activeTab={sidebarTab}
          onTabChange={setSidebarTab}
          form={form}
          onFormChange={setForm}
          styleConfig={styleConfig}
          onStyleChange={setStyleConfig}
          onResetStyles={() => setStyleConfig(DEFAULT_STYLE_CONFIG)}
          onGenerate={handleGenerate}
          onCancelGenerate={handleCancelGenerate}
          isGenerating={isGenerating}
          providers={providers}
        />

        {/* Right Live A4 Preview & Separate PDF Workspace */}
        <main className="flex-1 flex flex-col min-w-0 lg:h-[calc(100vh-57px)] overflow-hidden">
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
                <span>Answer Key & Solutions PDF</span>
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
                  onClick={() => handleExportPdf('questions')}
                  className="px-2.5 py-1.5 text-xs font-semibold border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 rounded-md transition-colors whitespace-nowrap"
                >
                  Save Questions PDF
                </button>
                <button
                  type="button"
                  onClick={() => handleExportPdf('answers')}
                  className="px-2.5 py-1.5 text-xs font-semibold border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-800 rounded-md transition-colors whitespace-nowrap"
                >
                  Save Answer PDF
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

          {/* Error Banner */}
          {errorMsg && (
            <div className="no-print mx-4 mt-3 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-xs text-red-800">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <div className="flex-1 min-w-0">
                <span className="font-semibold">Generation Error: </span>
                <span>{errorMsg}</span>
              </div>
              <button
                type="button"
                onClick={handleGenerate}
                className="px-2.5 py-1 bg-red-700 text-white font-semibold rounded hover:bg-red-800 shrink-0"
              >
                Retry
              </button>
              <button
                type="button"
                onClick={() => setErrorMsg(null)}
                className="text-red-700 hover:underline font-medium shrink-0"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Live progressive generation bar when first batch is already on screen */}
          {isGenerating && hasPartialBatch && (
            <div className="no-print mx-4 mt-3 px-4 py-2.5 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between gap-3 text-xs text-blue-900">
              <span className="font-medium">
                {progressMsg || `Adding remaining questions (${dpp.questions.length}/${form.questionCount} ready)...`}
              </span>
              <span className="font-mono tabular-nums font-semibold">
                {dpp.questions.length}/{form.questionCount}
              </span>
            </div>
          )}

          {/* Generating Overlay (shown only before batch 1 arrives) */}
          {isGenerating && !hasPartialBatch ? (
            <div className="no-print flex-1 flex flex-col items-center justify-center p-8 text-center">
              <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-xl p-8 space-y-4">
                <div className="text-sm font-semibold text-slate-900">
                  Crafting {form.questionCount} PYQ-calibrated {form.subject}{' '}
                  {form.paperType === 'test' ? 'Test Paper' : 'DPP'} questions for Class{' '}
                  {form.classLevel} ({parseInt(form.classLevel, 10) <= 10 ? `${form.juniorBoard} · ${form.juniorTier}` : form.seniorExam})...
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
          ) : (
            <div className="flex-1 overflow-auto bg-slate-200/70">
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
