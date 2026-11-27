import React from 'react';
import { Play, RotateCcw, Sparkles, X } from 'lucide-react';
import {
  CLASS_LEVELS,
  JUNIOR_BOARDS,
  JUNIOR_SUBJECTS,
  JUNIOR_TIERS,
  QUESTION_TYPE_OPTIONS,
  SENIOR_EXAMS,
  SENIOR_SUBJECTS,
  getChaptersForSelection,
  getRecommendedBooks,
} from '../data/curriculum';
import {
  SAMPLE_PAPER_BLUEPRINTS,
  computeEqualSubjectCounts,
  getBlueprintStats,
  getSamplePaperBlueprint,
  getSamplePaperChaptersPool,
  getSubjectTotalQuota,
} from '../data/samplePaperBlueprints';
import {
  AiProviderPref,
  BorderStyleType,
  ClassLevel,
  DppStyleConfig,
  GenerateDppPayload,
  JuniorBoard,
  JuniorTier,
  LanguageMedium,
  MixedTopicItem,
  PaperFontFamily,
  PaperType,
  QuestionType,
  SampleChapterSelection,
  SampleDistributionMode,
  SamplePaperExamId,
  SampleSyllabusScope,
  SeniorExam,
  TextStyleConfig,
  TopicMode,
} from '../types/dpp';

export type SidebarTab = 'curriculum' | 'branding' | 'typography';

interface StudioSidebarProps {
  activeTab: SidebarTab;
  onTabChange: (tab: SidebarTab) => void;
  form: GenerateDppPayload;
  onFormChange: (updater: (prev: GenerateDppPayload) => GenerateDppPayload) => void;
  styleConfig: DppStyleConfig;
  onStyleChange: (updater: (prev: DppStyleConfig) => DppStyleConfig) => void;
  onResetStyles: () => void;
  onGenerate: () => void;
  onResumeGenerate?: () => void;
  remainingResumeQs?: number;
  onCancelGenerate?: () => void;
  isGenerating: boolean;
  providers?: { gemini: boolean; groq: boolean };
}

interface TextStyleControlProps {
  label: string;
  value: TextStyleConfig;
  showUnderline?: boolean;
  onChange: (next: TextStyleConfig) => void;
}

const AI_QUICK_PROMPTS: { label: string; text: string }[] = [
  {
    label: 'PYQ Heavy',
    text: 'Model every question strictly on last 5 years PYQs with realistic numerical & conceptual traps.',
  },
  {
    label: 'Hard Multi-Concept',
    text: 'Increase difficulty to rank-decider multi-concept synthesis; avoid trivial direct formula questions.',
  },
  {
    label: 'NCERT Line-by-Line',
    text: 'Base every statement and conceptual trap strictly on NCERT textbook lines, tables, and Exemplar.',
  },
  {
    label: 'Diagram Focused',
    text: 'Include crisp geometry/FBD/graph/benzene reaction diagrams with clear labels and units.',
  },
  {
    label: 'Board Proofs',
    text: 'Include complete step-by-step marking-scheme derivations and clean formula substitutions.',
  },
];

const TextStyleRow: React.FC<TextStyleControlProps> = ({
  label,
  value,
  showUnderline = true,
  onChange,
}) => {
  return (
    <div className="py-2.5 border-b border-slate-100 last:border-b-0">
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <span className="text-xs font-medium text-slate-700">{label}</span>
        <span className="text-[11px] font-mono tabular-nums text-slate-500">{value.fontSize}px</span>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value.color}
          onChange={(e) => onChange({ ...value, color: e.target.value })}
          aria-label={`${label} color`}
          className="w-8 h-7 p-0.5 rounded border border-slate-200 bg-white cursor-pointer shrink-0"
        />
        <input
          type="range"
          min={10}
          max={30}
          step={0.5}
          value={value.fontSize}
          onChange={(e) => onChange({ ...value, fontSize: parseFloat(e.target.value) })}
          aria-label={`${label} font size`}
          className="flex-1 accent-blue-700 h-1.5"
        />
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={() => onChange({ ...value, bold: !value.bold })}
            className={`w-7 h-7 text-xs font-bold rounded border transition-colors ${
              value.bold
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
            title="Bold"
          >
            B
          </button>
          <button
            type="button"
            onClick={() => onChange({ ...value, italic: !value.italic })}
            className={`w-7 h-7 text-xs italic font-serif rounded border transition-colors ${
              value.italic
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
            title="Italic"
          >
            I
          </button>
          {showUnderline && (
            <button
              type="button"
              onClick={() => onChange({ ...value, underline: !value.underline })}
              className={`w-7 h-7 text-xs underline rounded border transition-colors ${
                value.underline
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
              title="Underline"
            >
              U
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const PAGE_COLOR_PRESETS = [
  { name: 'Crisp White', hex: '#FFFFFF' },
  { name: 'Warm Ivory', hex: '#FFFDF7' },
  { name: 'Soft Cream', hex: '#FEFCE8' },
  { name: 'Pale Sky', hex: '#F0F9FF' },
  { name: 'Mint Paper', hex: '#F0FDF4' },
  { name: 'Cool Slate', hex: '#F8FAFC' },
];

export const StudioSidebar: React.FC<StudioSidebarProps> = ({
  activeTab,
  onTabChange,
  form,
  onFormChange,
  styleConfig,
  onStyleChange,
  onResetStyles,
  onGenerate,
  onResumeGenerate,
  remainingResumeQs = 0,
  onCancelGenerate,
  isGenerating,
  providers,
}) => {
  const isJunior = parseInt(form.classLevel, 10) <= 10;
  const activeBoardOrExam = isJunior ? form.juniorBoard : form.seniorExam;
  const availableSubjects = isJunior ? JUNIOR_SUBJECTS : SENIOR_SUBJECTS;
  const chapters = getChaptersForSelection(form.classLevel, form.subject, activeBoardOrExam);
  const matchedChapter = chapters.find((c) => c.chapter === form.chapter);
  const topics = matchedChapter ? matchedChapter.topics : [];
  const isCustomTopic = topics.length === 0 || !topics.includes(form.topic);
  const isMixedMode = form.topicMode === 'mixed';
  const mixedTopics = form.mixedTopics || [];
  const isSamplePaper = form.paperType === 'sample_paper';
  const activeSampleExamId: SamplePaperExamId = form.sampleExamId || 'neet_180';
  const activeBlueprint = getSamplePaperBlueprint(activeSampleExamId);
  const activeBoardSubject = activeBlueprint.isMultiSubject
    ? activeBlueprint.defaultBoardSubject
    : activeBlueprint.subjects.includes(form.subject)
      ? form.subject
      : activeBlueprint.defaultBoardSubject;
  const blueprintStats = getBlueprintStats(activeBlueprint, activeBoardSubject);
  const samplePool = isSamplePaper
    ? getSamplePaperChaptersPool(activeSampleExamId, activeBoardSubject)
    : [];
  const sampleScope: SampleSyllabusScope = form.sampleSyllabusScope || 'full';
  const sampleDistMode: SampleDistributionMode = form.sampleDistributionMode || 'custom';
  const selectedSampleChapters = form.sampleSelectedChapters || [];
  const topicInputRef = React.useRef<HTMLInputElement>(null);
  const [customMixedInput, setCustomMixedInput] = React.useState('');
  const [sampleSubjTab, setSampleSubjTab] = React.useState<string>('Physics');
  const [sampleClassTab, setSampleClassTab] = React.useState<'all' | '11' | '12'>('all');

  const activeSampleSubj = activeBlueprint.isMultiSubject
    ? activeBlueprint.subjects.includes(sampleSubjTab)
      ? sampleSubjTab
      : activeBlueprint.subjects[0]
    : activeBoardSubject;

  const profileKey = isJunior ? form.juniorTier : form.seniorExam;
  const recommendedBooks = getRecommendedBooks(
    isSamplePaper ? activeBlueprint.boardOrExam : profileKey,
    isSamplePaper ? activeBoardSubject : form.subject,
  );
  const effectiveQuestionCount = isSamplePaper ? blueprintStats.totalQuestions : form.questionCount;
  const estimatedDiagramCount = Math.round((effectiveQuestionCount * form.diagramPercentage) / 100);

  const getSelectedSampleItem = (subject: string, classLevel: ClassLevel, chapter: string) =>
    selectedSampleChapters.find(
      (c) => c.subject === subject && c.classLevel === classLevel && c.chapter === chapter,
    );

  const isSampleChapterChecked = (subject: string, classLevel: ClassLevel, chapter: string) =>
    Boolean(getSelectedSampleItem(subject, classLevel, chapter));

  const rebalanceSubjectEqual = (
    list: SampleChapterSelection[],
    subject: string,
  ): SampleChapterSelection[] => {
    const subjItems = list.filter((c) => c.subject === subject);
    if (subjItems.length === 0) return list;
    const quota = getSubjectTotalQuota(blueprintStats.sections, subject);
    const eqCounts = computeEqualSubjectCounts(quota, subjItems.length);
    let idx = 0;
    return list.map((item) => {
      if (item.subject !== subject) return item;
      const nextCount = eqCounts[idx] ?? 1;
      idx += 1;
      return { ...item, questionCount: nextCount };
    });
  };

  const getEqualCountMapForSubject = (subject: string): Map<string, number> => {
    const subjItems = selectedSampleChapters.filter((c) => c.subject === subject);
    const quota = getSubjectTotalQuota(blueprintStats.sections, subject);
    const eqCounts = computeEqualSubjectCounts(quota, subjItems.length);
    const map = new Map<string, number>();
    subjItems.forEach((item, idx) => {
      map.set(`${item.classLevel}::${item.chapter}`, eqCounts[idx] ?? 0);
    });
    return map;
  };

  const toggleSampleChapter = (item: SampleChapterSelection) => {
    onFormChange((prev) => {
      const current = prev.sampleSelectedChapters || [];
      const exists = current.some(
        (c) =>
          c.subject === item.subject &&
          c.classLevel === item.classLevel &&
          c.chapter === item.chapter,
      );
      let nextList: SampleChapterSelection[];
      if (exists) {
        nextList = current.filter(
          (c) =>
            !(
              c.subject === item.subject &&
              c.classLevel === item.classLevel &&
              c.chapter === item.chapter
            ),
        );
      } else {
        const quota = getSubjectTotalQuota(blueprintStats.sections, item.subject);
        const existingSubjSum = current
          .filter((c) => c.subject === item.subject)
          .reduce((s, c) => s + (c.questionCount ?? 0), 0);
        const defaultCount =
          (prev.sampleDistributionMode || 'custom') === 'custom'
            ? Math.max(1, Math.min(Math.max(1, quota - existingSubjSum), 5))
            : 1;
        nextList = [...current, { ...item, questionCount: defaultCount }];
      }

      if ((prev.sampleDistributionMode || 'custom') === 'equal') {
        nextList = rebalanceSubjectEqual(nextList, item.subject);
      }
      return {
        ...prev,
        sampleSelectedChapters: nextList,
      };
    });
  };

  const updateSampleChapterCount = (
    subject: string,
    classLevel: ClassLevel,
    chapter: string,
    nextCount: number,
  ) => {
    const clamped = Math.max(0, Math.min(200, Math.round(Number.isFinite(nextCount) ? nextCount : 0)));
    onFormChange((prev) => {
      const current = prev.sampleSelectedChapters || [];
      const exists = current.some(
        (item) =>
          item.subject === subject &&
          item.classLevel === classLevel &&
          item.chapter === chapter,
      );
      let nextList: SampleChapterSelection[];
      if (clamped <= 0) {
        nextList = current.filter(
          (item) =>
            !(
              item.subject === subject &&
              item.classLevel === classLevel &&
              item.chapter === chapter
            ),
        );
      } else if (exists) {
        nextList = current.map((item) =>
          item.subject === subject && item.classLevel === classLevel && item.chapter === chapter
            ? { ...item, questionCount: clamped }
            : item,
        );
      } else {
        nextList = [...current, { subject, classLevel, chapter, questionCount: clamped }];
      }
      return {
        ...prev,
        sampleDistributionMode: 'custom',
        sampleSelectedChapters: nextList,
      };
    });
  };

  const handleSampleDistributionModeChange = (nextMode: SampleDistributionMode) => {
    onFormChange((prev) => {
      let nextList = prev.sampleSelectedChapters || [];
      if (nextMode === 'equal') {
        for (const subj of activeBlueprint.subjects) {
          nextList = rebalanceSubjectEqual(nextList, subj);
        }
      } else {
        for (const subj of activeBlueprint.subjects) {
          const subjItems = nextList.filter((c) => c.subject === subj);
          const hasAllCounts = subjItems.every((c) => typeof c.questionCount === 'number' && c.questionCount > 0);
          if (!hasAllCounts) {
            nextList = rebalanceSubjectEqual(nextList, subj);
          }
        }
      }
      return {
        ...prev,
        sampleDistributionMode: nextMode,
        sampleSelectedChapters: nextList,
      };
    });
  };

  const distributeSubjectEqually = (subject: string) => {
    onFormChange((prev) => {
      let nextList = prev.sampleSelectedChapters || [];
      const hasAny = nextList.some((c) => c.subject === subject);
      if (!hasAny) {
        const subjectPool = samplePool.filter(
          (p) => p.subject === subject && (sampleClassTab === 'all' || p.classLevel === sampleClassTab),
        );
        nextList = [
          ...nextList,
          ...subjectPool.map((p) => ({
            subject: p.subject,
            classLevel: p.classLevel,
            chapter: p.chapter,
            questionCount: 1,
          })),
        ];
      }
      nextList = rebalanceSubjectEqual(nextList, subject);
      return {
        ...prev,
        sampleSelectedChapters: nextList,
      };
    });
  };

  const distributeAllSubjectsEqually = () => {
    onFormChange((prev) => {
      let nextList = prev.sampleSelectedChapters || [];
      const targetSubjs = activeBlueprint.isMultiSubject
        ? activeBlueprint.subjects
        : [activeBoardSubject];
      for (const subj of targetSubjs) {
        if (!nextList.some((c) => c.subject === subj)) {
          const subjectPool = samplePool.filter((p) => p.subject === subj);
          nextList = [
            ...nextList,
            ...subjectPool.map((p) => ({
              subject: p.subject,
              classLevel: p.classLevel,
              chapter: p.chapter,
              questionCount: 1,
            })),
          ];
        }
        nextList = rebalanceSubjectEqual(nextList, subj);
      }
      return {
        ...prev,
        sampleSelectedChapters: nextList,
      };
    });
  };

  const applySampleChapterPreset = (
    mode: 'all' | '11' | '12' | 'clear',
    scopeSubject?: string,
  ) => {
    onFormChange((prev) => {
      const current = prev.sampleSelectedChapters || [];
      if (mode === 'clear') {
        return {
          ...prev,
          sampleSelectedChapters: scopeSubject
            ? current.filter((c) => c.subject !== scopeSubject)
            : [],
        };
      }

      const poolSlice = samplePool.filter(
        (p) =>
          (!scopeSubject || p.subject === scopeSubject) &&
          (mode === 'all' || p.classLevel === mode),
      );

      let nextList = [...current];
      for (const p of poolSlice) {
        if (
          !nextList.some(
            (c) =>
              c.subject === p.subject &&
              c.classLevel === p.classLevel &&
              c.chapter === p.chapter,
          )
        ) {
          nextList.push({
            subject: p.subject,
            classLevel: p.classLevel,
            chapter: p.chapter,
            questionCount: 1,
          });
        }
      }

      const affectedSubjects = scopeSubject
        ? [scopeSubject]
        : Array.from(new Set(poolSlice.map((p) => p.subject)));
      for (const s of affectedSubjects) {
        nextList = rebalanceSubjectEqual(nextList, s);
      }

      return {
        ...prev,
        sampleSelectedChapters: nextList,
      };
    });
  };

  const handleSampleExamSelect = (nextExamId: SamplePaperExamId) => {
    const bp = getSamplePaperBlueprint(nextExamId);
    const nextClass: ClassLevel = nextExamId === 'cbse_10_board' ? '10' : '12';
    const nextSubject = bp.isMultiSubject ? bp.defaultBoardSubject : bp.defaultBoardSubject;
    onFormChange((prev) => ({
      ...prev,
      sampleExamId: nextExamId,
      classLevel: nextClass,
      subject: nextSubject,
      seniorExam:
        nextExamId === 'neet_180'
          ? 'NEET'
          : nextExamId === 'jee_main_75'
            ? 'JEE Mains'
            : nextExamId === 'jee_adv_54'
              ? 'JEE Advanced'
              : 'Board Exams',
      juniorBoard: 'CBSE',
      sampleSelectedChapters: [],
      referenceBooks: getRecommendedBooks(bp.boardOrExam, nextSubject).slice(0, 4),
    }));
    onStyleChange((prev) => ({
      ...prev,
      duration: bp.duration,
      testCode:
        nextExamId === 'neet_180'
          ? 'NEET-MOCK'
          : nextExamId === 'jee_main_75'
            ? 'JM-MOCK'
            : nextExamId === 'jee_adv_54'
              ? 'JADV-MOCK'
              : nextExamId === 'cbse_12_board'
                ? 'CBSE-12'
                : 'CBSE-10',
    }));
  };

  const isTopicSelectedInMix = (chapterName: string, topicName: string) =>
    mixedTopics.some((item) => item.chapter === chapterName && item.topic === topicName);

  const toggleMixedTopic = (chapterName: string, topicName: string) => {
    onFormChange((prev) => {
      const current = prev.mixedTopics || [];
      const exists = current.some(
        (item) => item.chapter === chapterName && item.topic === topicName,
      );
      const next = exists
        ? current.filter((item) => !(item.chapter === chapterName && item.topic === topicName))
        : [...current, { chapter: chapterName, topic: topicName }];
      return {
        ...prev,
        mixedTopics: next,
      };
    });
  };

  const selectAllChapterTopics = () => {
    const ch = form.chapter.trim();
    if (!ch || topics.length === 0) return;
    onFormChange((prev) => {
      const current = prev.mixedTopics || [];
      const additions: MixedTopicItem[] = topics
        .filter((t) => !current.some((item) => item.chapter === ch && item.topic === t))
        .map((t) => ({ chapter: ch, topic: t }));
      return {
        ...prev,
        mixedTopics: [...current, ...additions],
      };
    });
  };

  const addCustomMixedTopic = () => {
    const cleanTopic = customMixedInput.trim();
    const cleanChapter = form.chapter.trim() || 'Mixed Syllabus';
    if (!cleanTopic) return;
    onFormChange((prev) => {
      const current = prev.mixedTopics || [];
      const exists = current.some(
        (item) =>
          item.chapter === cleanChapter &&
          item.topic.toLowerCase() === cleanTopic.toLowerCase(),
      );
      if (exists) return prev;
      return {
        ...prev,
        mixedTopics: [...current, { chapter: cleanChapter, topic: cleanTopic }],
      };
    });
    setCustomMixedInput('');
  };

  const handleTopicModeChange = (nextMode: TopicMode) => {
    onFormChange((prev) => {
      if (nextMode === 'mixed') {
        const current = prev.mixedTopics || [];
        if (current.length === 0 && prev.chapter.trim() && prev.topic.trim()) {
          return {
            ...prev,
            topicMode: 'mixed',
            mixedTopics: [{ chapter: prev.chapter.trim(), topic: prev.topic.trim() }],
          };
        }
        return { ...prev, topicMode: 'mixed' };
      }
      return { ...prev, topicMode: 'single' };
    });
  };

  const handleClassChange = (cls: ClassLevel) => {
    const nextIsJunior = parseInt(cls, 10) <= 10;
    const nextSubjects = nextIsJunior ? JUNIOR_SUBJECTS : SENIOR_SUBJECTS;
    const nextSubject = nextSubjects.includes(form.subject) ? form.subject : nextSubjects[0];
    const nextBoardOrExam = nextIsJunior ? form.juniorBoard : form.seniorExam;
    const nextChapters = getChaptersForSelection(cls, nextSubject, nextBoardOrExam);
    const nextChapter = nextChapters[0]?.chapter || '';
    const nextTopic = nextChapters[0]?.topics[0] || '';
    const nextProfile = nextIsJunior ? form.juniorTier : form.seniorExam;

    onFormChange((prev) => ({
      ...prev,
      classLevel: cls,
      subject: nextSubject,
      chapter: nextChapter,
      topic: nextTopic,
      mixedTopics: nextChapter && nextTopic ? [{ chapter: nextChapter, topic: nextTopic }] : [],
      referenceBooks: getRecommendedBooks(nextProfile, nextSubject).slice(0, 4),
    }));
  };

  const handleSubjectChange = (subject: string) => {
    const nextChapters = getChaptersForSelection(form.classLevel, subject, activeBoardOrExam);
    const nextChapter = nextChapters[0]?.chapter || '';
    const nextTopic = nextChapters[0]?.topics[0] || '';
    onFormChange((prev) => ({
      ...prev,
      subject,
      chapter: nextChapter,
      topic: nextTopic,
      mixedTopics: nextChapter && nextTopic ? [{ chapter: nextChapter, topic: nextTopic }] : [],
      referenceBooks: getRecommendedBooks(profileKey, subject).slice(0, 4),
    }));
  };

  const handleChapterChange = (chapter: string) => {
    const found = chapters.find((c) => c.chapter === chapter);
    onFormChange((prev) => ({
      ...prev,
      chapter,
      topic: found?.topics[0] || '',
    }));
  };

  const handleBoardChange = (nextBoard: JuniorBoard) => {
    const nextChapters = getChaptersForSelection(form.classLevel, form.subject, nextBoard);
    const sameChapter = nextChapters.find((c) => c.chapter === form.chapter);
    onFormChange((prev) => {
      const nextChapter = sameChapter ? sameChapter.chapter : nextChapters[0]?.chapter || prev.chapter;
      const nextTopic = sameChapter
        ? sameChapter.topics.includes(prev.topic)
          ? prev.topic
          : sameChapter.topics[0] || prev.topic
        : nextChapters[0]?.topics[0] || prev.topic;
      return {
        ...prev,
        juniorBoard: nextBoard,
        chapter: nextChapter,
        topic: nextTopic,
        mixedTopics:
          prev.topicMode === 'mixed' && !sameChapter
            ? nextChapter && nextTopic
              ? [{ chapter: nextChapter, topic: nextTopic }]
              : []
            : prev.mixedTopics,
      };
    });
  };

  const handleSeniorExamChange = (nextExam: SeniorExam) => {
    const nextChapters = getChaptersForSelection(form.classLevel, form.subject, nextExam);
    const sameChapter = nextChapters.find((c) => c.chapter === form.chapter);
    onFormChange((prev) => {
      const nextChapter = sameChapter ? sameChapter.chapter : nextChapters[0]?.chapter || prev.chapter;
      const nextTopic = sameChapter
        ? sameChapter.topics.includes(prev.topic)
          ? prev.topic
          : sameChapter.topics[0] || prev.topic
        : nextChapters[0]?.topics[0] || prev.topic;
      return {
        ...prev,
        seniorExam: nextExam,
        chapter: nextChapter,
        topic: nextTopic,
        mixedTopics:
          prev.topicMode === 'mixed' && !sameChapter
            ? nextChapter && nextTopic
              ? [{ chapter: nextChapter, topic: nextTopic }]
              : []
            : prev.mixedTopics,
        referenceBooks: getRecommendedBooks(nextExam, prev.subject).slice(0, 4),
      };
    });
  };

  const toggleQuestionType = (qt: QuestionType) => {
    onFormChange((prev) => {
      const exists = prev.questionTypes.includes(qt);
      if (exists && prev.questionTypes.length === 1) return prev; // keep at least 1
      return {
        ...prev,
        questionTypes: exists
          ? prev.questionTypes.filter((t) => t !== qt)
          : [...prev.questionTypes, qt],
      };
    });
  };

  const toggleReferenceBook = (book: string) => {
    onFormChange((prev) => {
      const exists = prev.referenceBooks.includes(book);
      return {
        ...prev,
        referenceBooks: exists
          ? prev.referenceBooks.filter((b) => b !== book)
          : [...prev.referenceBooks, book],
      };
    });
  };

  return (
    <aside className="no-print w-full lg:w-[420px] xl:w-[440px] shrink-0 bg-white border-r border-slate-200 flex flex-col lg:h-[calc(100vh-57px)]">
      {/* Segmented Control Tabs */}
      <div className="p-3 border-b border-slate-200 bg-slate-50/70">
        <div className="grid grid-cols-3 gap-1 p-1 bg-slate-200/70 rounded-lg">
          <button
            type="button"
            onClick={() => onTabChange('curriculum')}
            className={`px-2 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'curriculum'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            01. Curriculum
          </button>
          <button
            type="button"
            onClick={() => onTabChange('branding')}
            className={`px-2 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'branding'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            02. Page & Brand
          </button>
          <button
            type="button"
            onClick={() => onTabChange('typography')}
            className={`px-2 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'typography'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            03. Style & Figures
          </button>
        </div>
      </div>

      {/* Scrollable Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {/* TAB 1: CURRICULUM & PYQ ENGINE */}
        {activeTab === 'curriculum' && (
          <>
            {/* Document Mode: DPP vs Test / Question Paper vs Official Sample Paper */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Document Mode (DPP / Test / Sample Paper)
              </label>
              <select
                value={form.paperType || 'dpp'}
                onChange={(e) => {
                  const nextType = e.target.value as PaperType;
                  if (nextType === 'sample_paper') {
                    const bp = getSamplePaperBlueprint(form.sampleExamId || 'neet_180');
                    onFormChange((prev) => ({
                      ...prev,
                      paperType: 'sample_paper',
                      sampleExamId: prev.sampleExamId || 'neet_180',
                      sampleSyllabusScope: prev.sampleSyllabusScope || 'full',
                      sampleSelectedChapters: prev.sampleSelectedChapters || [],
                    }));
                    onStyleChange((prev) => ({
                      ...prev,
                      duration: bp.duration,
                      testCode:
                        bp.id === 'neet_180'
                          ? 'NEET-MOCK'
                          : bp.id === 'jee_main_75'
                            ? 'JM-MOCK'
                            : bp.id === 'jee_adv_54'
                              ? 'JADV-MOCK'
                              : bp.id === 'cbse_12_board'
                                ? 'CBSE-12'
                                : 'CBSE-10',
                    }));
                    return;
                  }
                  onFormChange((prev) => ({ ...prev, paperType: nextType }));
                  onStyleChange((prev) => {
                    if (nextType === 'test' && (prev.testCode === 'DPP-01' || !prev.testCode.trim())) {
                      return { ...prev, testCode: 'TEST-01', duration: prev.duration === '45 Mins' ? '60 Mins' : prev.duration };
                    }
                    if (nextType === 'dpp' && prev.testCode === 'TEST-01') {
                      return { ...prev, testCode: 'DPP-01', duration: prev.duration === '60 Mins' ? '45 Mins' : prev.duration };
                    }
                    return prev;
                  });
                }}
                className="w-full px-2.5 py-2 text-xs font-semibold bg-white border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="dpp">DPP (Daily Practice Problem Sheet)</option>
                <option value="test">Test / Question Paper (Exam Mode)</option>
                <option value="sample_paper">Official Sample Paper (NEET 180 / JEE 75 / Adv / CBSE 10 & 12)</option>
              </select>
            </div>

            {isSamplePaper ? (
              <div className="space-y-3.5 pt-1 border-t border-slate-100">
                {/* Official Exam Blueprint Selector */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Select Official Exam Sample Paper Pattern
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {SAMPLE_PAPER_BLUEPRINTS.map((bp) => (
                      <button
                        key={bp.id}
                        type="button"
                        onClick={() => handleSampleExamSelect(bp.id)}
                        className={`py-2 px-2.5 text-left text-xs font-semibold rounded-md border transition-colors ${
                          activeSampleExamId === bp.id
                            ? 'bg-blue-700 text-white border-blue-700 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {bp.shortLabel}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Subject (for CBSE 10/12) + Language Medium */}
                <div className={`grid ${activeBlueprint.isMultiSubject ? 'grid-cols-1' : 'grid-cols-2'} gap-3`}>
                  {!activeBlueprint.isMultiSubject && (
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Board Subject
                      </label>
                      <select
                        value={activeBoardSubject}
                        onChange={(e) => {
                          const nextSubj = e.target.value;
                          onFormChange((prev) => ({
                            ...prev,
                            subject: nextSubj,
                            sampleSelectedChapters: [],
                            referenceBooks: getRecommendedBooks(
                              activeBlueprint.boardOrExam,
                              nextSubj,
                            ).slice(0, 4),
                          }));
                        }}
                        className="w-full px-2.5 py-2 text-xs font-medium bg-white border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                      >
                        {activeBlueprint.subjects.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Language Medium
                    </label>
                    <select
                      value={form.medium}
                      onChange={(e) =>
                        onFormChange((prev) => ({
                          ...prev,
                          medium: e.target.value as LanguageMedium,
                        }))
                      }
                      className="w-full px-2.5 py-2 text-xs font-medium bg-white border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    >
                      <option value="English">English</option>
                      <option value="Hindi">Hindi (हिन्दी)</option>
                      <option value="Bilingual">Bilingual (Eng + Hin)</option>
                    </select>
                  </div>
                </div>

                {/* Live Official Blueprint Summary */}
                <div className="p-2.5 rounded-lg border border-emerald-200 bg-emerald-50/60 space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11.5px] font-bold text-emerald-950">
                      {activeBlueprint.title}
                    </span>
                    <span className="text-[11px] font-mono font-bold text-emerald-800 tabular-nums shrink-0">
                      {blueprintStats.totalQuestions} Qs · {blueprintStats.totalMarks} M
                    </span>
                  </div>
                  <div className="space-y-0.5">
                    {blueprintStats.sections.map((sec) => (
                      <div
                        key={sec.id}
                        className="flex items-center justify-between text-[10.5px] text-emerald-900 gap-2"
                      >
                        <span className="truncate">{sec.label}</span>
                        <span className="font-mono shrink-0 tabular-nums">{sec.count} Qs</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Full Syllabus vs Select Chapters */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-700">
                    Syllabus Coverage (Full vs Selected Chapters)
                  </label>
                  <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 rounded-lg border border-slate-200">
                    <button
                      type="button"
                      onClick={() =>
                        onFormChange((prev) => ({ ...prev, sampleSyllabusScope: 'full' }))
                      }
                      className={`py-1.5 px-2 text-xs font-semibold rounded-md transition-colors ${
                        sampleScope === 'full'
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Full Syllabus ({samplePool.length} Ch)
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        onFormChange((prev) => ({
                          ...prev,
                          sampleSyllabusScope: 'selected',
                          sampleDistributionMode: prev.sampleDistributionMode || 'custom',
                        }))
                      }
                      className={`py-1.5 px-2 text-xs font-semibold rounded-md transition-colors ${
                        sampleScope === 'selected'
                          ? 'bg-blue-700 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Choose Chapters & Qs ({selectedSampleChapters.length})
                    </button>
                  </div>

                  {sampleScope === 'selected' && (() => {
                    const activeSubjQuota = getSubjectTotalQuota(blueprintStats.sections, activeSampleSubj);
                    const activeSubjSelected = selectedSampleChapters.filter(
                      (c) => c.subject === activeSampleSubj,
                    );
                    const activeSubjAssignedSum = activeSubjSelected.reduce(
                      (sum, c) => sum + (c.questionCount ?? 0),
                      0,
                    );
                    const equalCountMap = getEqualCountMapForSubject(activeSampleSubj);
                    const visibleChapters = samplePool.filter(
                      (p) =>
                        p.subject === activeSampleSubj &&
                        (!activeBlueprint.isMultiSubject ||
                          sampleClassTab === 'all' ||
                          p.classLevel === sampleClassTab),
                    );
                    const classGroups: ClassLevel[] = activeBlueprint.isMultiSubject
                      ? sampleClassTab === 'all'
                        ? ['11', '12']
                        : [sampleClassTab]
                      : [activeBlueprint.id === 'cbse_10_board' ? '10' : '12'];

                    return (
                      <div className="p-2.5 rounded-lg border border-blue-200 bg-blue-50/40 space-y-2.5">
                        {/* Combined Paper Summary + Quick Equal All */}
                        <div className="flex flex-wrap items-center justify-between gap-1.5">
                          <span className="text-[11px] font-bold text-slate-800">
                            Combined {blueprintStats.totalQuestions}-Q Paper Planner
                          </span>
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={distributeAllSubjectsEqually}
                              className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded cursor-pointer"
                            >
                              Equal All ({blueprintStats.totalQuestions} Qs)
                            </button>
                            {selectedSampleChapters.length > 0 && (
                              <button
                                type="button"
                                onClick={() => applySampleChapterPreset('clear')}
                                className="text-[10px] font-medium text-slate-500 hover:text-red-600 cursor-pointer"
                              >
                                Clear ({selectedSampleChapters.length})
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Distribution Mode: Custom Qs / Chapter vs All Chapters Equally */}
                        <div className="grid grid-cols-2 gap-1 p-0.5 bg-white border border-blue-200 rounded-md">
                          <button
                            type="button"
                            onClick={() => handleSampleDistributionModeChange('custom')}
                            className={`py-1 px-2 text-[11px] font-semibold rounded transition-colors cursor-pointer ${
                              sampleDistMode === 'custom'
                                ? 'bg-blue-700 text-white'
                                : 'text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            Custom Qs / Chapter
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSampleDistributionModeChange('equal')}
                            className={`py-1 px-2 text-[11px] font-semibold rounded transition-colors cursor-pointer ${
                              sampleDistMode === 'equal'
                                ? 'bg-blue-700 text-white'
                                : 'text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            All Chapters Equally
                          </button>
                        </div>

                        {/* Subject-wise PCMB Tabs (Multi-subject exams) */}
                        {activeBlueprint.isMultiSubject && (
                          <div className="grid grid-cols-3 gap-1">
                            {activeBlueprint.subjects.map((subj) => {
                              const subjQuota = getSubjectTotalQuota(blueprintStats.sections, subj);
                              const subjItems = selectedSampleChapters.filter(
                                (c) => c.subject === subj,
                              );
                              const subjCustomSum = subjItems.reduce(
                                (s, c) => s + (c.questionCount ?? 0),
                                0,
                              );
                              const isCurrent = activeSampleSubj === subj;
                              const isMatched =
                                subjItems.length > 0 &&
                                (sampleDistMode === 'equal' || subjCustomSum === subjQuota);
                              return (
                                <button
                                  key={subj}
                                  type="button"
                                  onClick={() => setSampleSubjTab(subj)}
                                  className={`px-2 py-1.5 rounded-md border text-left transition-colors cursor-pointer ${
                                    isCurrent
                                      ? 'bg-slate-900 text-white border-slate-900'
                                      : isMatched
                                        ? 'bg-emerald-50/70 text-emerald-950 border-emerald-300 hover:bg-emerald-50'
                                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                                  }`}
                                >
                                  <div className="text-[11px] font-bold truncate">{subj}</div>
                                  <div
                                    className={`text-[9.5px] font-mono tabular-nums ${
                                      isCurrent
                                        ? 'text-slate-300'
                                        : isMatched
                                          ? 'text-emerald-700'
                                          : 'text-slate-500'
                                    }`}
                                  >
                                    {subjItems.length === 0
                                      ? `0/${subjQuota} Q (Auto)`
                                      : sampleDistMode === 'custom'
                                        ? `${subjCustomSum}/${subjQuota} Qs`
                                        : `${subjItems.length}ch · ${subjQuota}Q`}
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        )}

                        {/* Class 11 / 12 Filter & Subject Quick Actions */}
                        <div className="flex flex-wrap items-center justify-between gap-1.5">
                          {activeBlueprint.isMultiSubject ? (
                            <div className="inline-flex rounded border border-slate-200 bg-white p-0.5">
                              {(
                                [
                                  { id: 'all', label: '11th + 12th' },
                                  { id: '11', label: 'Class 11' },
                                  { id: '12', label: 'Class 12' },
                                ] as const
                              ).map((clsOpt) => (
                                <button
                                  key={clsOpt.id}
                                  type="button"
                                  onClick={() => setSampleClassTab(clsOpt.id)}
                                  className={`px-2 py-0.5 text-[10px] font-semibold rounded cursor-pointer ${
                                    sampleClassTab === clsOpt.id
                                      ? 'bg-blue-700 text-white'
                                      : 'text-slate-600 hover:bg-slate-50'
                                  }`}
                                >
                                  {clsOpt.label}
                                </button>
                              ))}
                            </div>
                          ) : (
                            <span className="text-[11px] font-semibold text-slate-700">
                              {activeSampleSubj} Chapters
                            </span>
                          )}

                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() =>
                                applySampleChapterPreset(
                                  activeBlueprint.isMultiSubject ? sampleClassTab : 'all',
                                  activeSampleSubj,
                                )
                              }
                              className="px-2 py-0.5 text-[10px] font-semibold bg-blue-700 hover:bg-blue-800 text-white rounded cursor-pointer"
                            >
                              + All {activeBlueprint.isMultiSubject && sampleClassTab !== 'all' ? `${sampleClassTab}th` : activeSampleSubj}
                            </button>
                            {activeSubjSelected.length > 0 && (
                              <button
                                type="button"
                                onClick={() => applySampleChapterPreset('clear', activeSampleSubj)}
                                className="px-2 py-0.5 text-[10px] font-medium bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 rounded cursor-pointer"
                              >
                                Clear
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Subject Quota Status + Equal Balance Action */}
                        <div className="flex items-center justify-between gap-2 px-2 py-1.5 rounded bg-white border border-slate-200 text-[10.5px]">
                          {activeSubjSelected.length === 0 ? (
                            <>
                              <span className="text-slate-600">
                                Pick {activeSampleSubj} chapters below (Target:{' '}
                                <strong className="text-slate-800">{activeSubjQuota} Qs</strong>)
                              </span>
                              <button
                                type="button"
                                onClick={() => distributeSubjectEqually(activeSampleSubj)}
                                className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded cursor-pointer shrink-0"
                              >
                                Fill {activeSubjQuota} Equally
                              </button>
                            </>
                          ) : sampleDistMode === 'equal' ? (
                            <span className="text-emerald-800 font-medium">
                              <strong>{activeSampleSubj}:</strong> {activeSubjQuota} Qs divided equally across{' '}
                              {activeSubjSelected.length} chapters
                            </span>
                          ) : (
                            <>
                              <span
                                className={`font-semibold tabular-nums ${
                                  activeSubjAssignedSum === activeSubjQuota
                                    ? 'text-emerald-700'
                                    : 'text-amber-700'
                                }`}
                              >
                                {activeSampleSubj}: {activeSubjAssignedSum} / {activeSubjQuota} Qs assigned
                              </span>
                              <button
                                type="button"
                                onClick={() => distributeSubjectEqually(activeSampleSubj)}
                                className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded cursor-pointer shrink-0"
                              >
                                Split {activeSubjQuota} Equally
                              </button>
                            </>
                          )}
                        </div>

                        {/* Class-Grouped Chapter Checklist with Always-Visible Per-Chapter Question Steppers */}
                        <div className="max-h-72 overflow-y-auto bg-white border border-slate-200 rounded-md divide-y divide-slate-100">
                          {visibleChapters.length === 0 ? (
                            <div className="p-3 text-center text-[11px] text-slate-500">
                              No chapters found for this filter.
                            </div>
                          ) : (
                            classGroups.map((cls) => {
                              const clsRows = visibleChapters.filter((c) => c.classLevel === cls);
                              if (clsRows.length === 0) return null;
                              const checkedInCls = clsRows.filter((c) =>
                                isSampleChapterChecked(c.subject, c.classLevel, c.chapter),
                              ).length;

                              return (
                                <div key={`${activeSampleSubj}-${cls}`}>
                                  <div className="sticky top-0 z-10 px-2.5 py-1 bg-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-700 border-b border-slate-200 flex items-center justify-between">
                                    <span>
                                      Class {cls} · {activeSampleSubj}
                                    </span>
                                    <span className="font-mono tabular-nums text-slate-500">
                                      {checkedInCls}/{clsRows.length}
                                    </span>
                                  </div>
                                  <div className="divide-y divide-slate-100">
                                    {clsRows.map((ch) => {
                                      const selectedItem = getSelectedSampleItem(
                                        ch.subject,
                                        ch.classLevel,
                                        ch.chapter,
                                      );
                                      const checked = Boolean(selectedItem);
                                      const eqCount =
                                        equalCountMap.get(`${ch.classLevel}::${ch.chapter}`) ?? 0;
                                      const currentCount =
                                        sampleDistMode === 'equal'
                                          ? eqCount
                                          : selectedItem?.questionCount ?? 0;

                                      return (
                                        <div
                                          key={`${ch.subject}-${ch.classLevel}-${ch.chapter}`}
                                          className={`flex items-center justify-between gap-2 px-2.5 py-1.5 text-[11px] ${
                                            checked
                                              ? 'bg-blue-50/70 text-blue-950 font-medium'
                                              : 'text-slate-700 hover:bg-slate-50'
                                          }`}
                                        >
                                          <label className="flex items-start gap-2 flex-1 min-w-0 cursor-pointer">
                                            <input
                                              type="checkbox"
                                              checked={checked}
                                              onChange={() =>
                                                toggleSampleChapter({
                                                  subject: ch.subject,
                                                  classLevel: ch.classLevel,
                                                  chapter: ch.chapter,
                                                })
                                              }
                                              className="mt-0.5 rounded border-slate-300 text-blue-700 focus:ring-blue-600 shrink-0"
                                            />
                                            <span className="leading-snug">{ch.chapter}</span>
                                          </label>

                                          {sampleDistMode === 'equal' ? (
                                            checked ? (
                                              <span className="shrink-0 px-1.5 py-0.5 text-[10px] font-mono font-semibold bg-white border border-blue-200 text-blue-800 rounded tabular-nums">
                                                {eqCount} Q{eqCount === 1 ? '' : 's'}
                                              </span>
                                            ) : (
                                              <span className="shrink-0 text-[10px] font-mono text-slate-400">
                                                0 Qs
                                              </span>
                                            )
                                          ) : (
                                            <div
                                              className={`shrink-0 inline-flex items-center border rounded bg-white overflow-hidden ${
                                                checked ? 'border-blue-400' : 'border-slate-200'
                                              }`}
                                            >
                                              <button
                                                type="button"
                                                onClick={() =>
                                                  updateSampleChapterCount(
                                                    ch.subject,
                                                    ch.classLevel,
                                                    ch.chapter,
                                                    Math.max(0, currentCount - 1),
                                                  )
                                                }
                                                className="px-1.5 py-0.5 text-[11px] font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                                                title="Decrease questions"
                                              >
                                                -
                                              </button>
                                              <input
                                                type="number"
                                                min={0}
                                                max={180}
                                                value={currentCount}
                                                onChange={(e) =>
                                                  updateSampleChapterCount(
                                                    ch.subject,
                                                    ch.classLevel,
                                                    ch.chapter,
                                                    Number(e.target.value),
                                                  )
                                                }
                                                className={`w-8 text-center text-[11px] font-mono font-bold focus:outline-none py-0.5 tabular-nums [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                                                  checked ? 'text-blue-900' : 'text-slate-400'
                                                }`}
                                              />
                                              <button
                                                type="button"
                                                onClick={() =>
                                                  updateSampleChapterCount(
                                                    ch.subject,
                                                    ch.classLevel,
                                                    ch.chapter,
                                                    currentCount + 1,
                                                  )
                                                }
                                                className="px-1.5 py-0.5 text-[11px] font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                                                title="Increase questions"
                                              >
                                                +
                                              </button>
                                            </div>
                                          )}
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              );
                            })
                          )}
                        </div>

                        {selectedSampleChapters.length === 0 ? (
                          <p className="text-[10.5px] text-amber-700 font-medium">
                            Set question count above 0 on any chapters (or click Equal All / Full Syllabus).
                          </p>
                        ) : activeBlueprint.isMultiSubject &&
                          activeBlueprint.subjects.some(
                            (s) => !selectedSampleChapters.some((c) => c.subject === s),
                          ) ? (
                          <p className="text-[10px] text-slate-600">
                            Tip: Subjects with 0 chosen chapters automatically cover their full syllabus equally in the same {blueprintStats.totalQuestions}-Q paper.
                          </p>
                        ) : null}
                      </div>
                    );
                  })()}
                </div>
              </div>
            ) : (
              <>
            {/* Class Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Select Class (7 to 12)
              </label>
              <div className="grid grid-cols-6 gap-1.5">
                {CLASS_LEVELS.map((cls) => (
                  <button
                    key={cls.value}
                    type="button"
                    onClick={() => handleClassChange(cls.value)}
                    className={`py-2 text-xs font-semibold rounded-md border transition-colors tabular-nums ${
                      form.classLevel === cls.value
                        ? 'bg-blue-700 text-white border-blue-700'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {cls.value}th
                  </button>
                ))}
              </div>
            </div>

            {/* Conditional Board/Tier Dropdowns */}
            {isJunior ? (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Board (Class 7–10)
                  </label>
                  <select
                    value={form.juniorBoard}
                    onChange={(e) => handleBoardChange(e.target.value as JuniorBoard)}
                    className="w-full px-2.5 py-2 text-xs font-medium bg-white border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    {JUNIOR_BOARDS.map((b) => (
                      <option key={b.value} value={b.value}>
                        {b.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Target Level
                  </label>
                  <select
                    value={form.juniorTier}
                    onChange={(e) => {
                      const nextTier = e.target.value as JuniorTier;
                      onFormChange((prev) => ({
                        ...prev,
                        juniorTier: nextTier,
                        referenceBooks: getRecommendedBooks(nextTier, form.subject).slice(0, 4),
                      }));
                    }}
                    className="w-full px-2.5 py-2 text-xs font-medium bg-white border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    {JUNIOR_TIERS.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Target Examination (Class 11–12)
                </label>
                <select
                  value={form.seniorExam}
                  onChange={(e) => handleSeniorExamChange(e.target.value as SeniorExam)}
                  className="w-full px-2.5 py-2 text-xs font-medium bg-white border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  {SENIOR_EXAMS.map((ex) => (
                    <option key={ex.value} value={ex.value}>
                      {ex.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Subject & Medium */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Subject</label>
                <select
                  value={form.subject}
                  onChange={(e) => handleSubjectChange(e.target.value)}
                  className="w-full px-2.5 py-2 text-xs font-medium bg-white border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  {availableSubjects.map((subj) => (
                    <option key={subj} value={subj}>
                      {subj}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Language Medium</label>
                <select
                  value={form.medium}
                  onChange={(e) =>
                    onFormChange((prev) => ({ ...prev, medium: e.target.value as LanguageMedium }))
                  }
                  className="w-full px-2.5 py-2 text-xs font-medium bg-white border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="English">English</option>
                  <option value="Hindi">Hindi (हिन्दी)</option>
                  <option value="Bilingual">Bilingual (Eng + Hin)</option>
                </select>
              </div>
            </div>

            {/* Chapter & Topic (Single Locked vs Mixed Multi-Topic) */}
            <div className="space-y-3 pt-1 border-t border-slate-100">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Topic Selection Mode
                </label>
                <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 rounded-lg border border-slate-200">
                  <button
                    type="button"
                    onClick={() => handleTopicModeChange('single')}
                    className={`py-1.5 px-2 text-xs font-semibold rounded-md transition-colors ${
                      !isMixedMode
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Single Topic (Locked)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTopicModeChange('mixed')}
                    className={`py-1.5 px-2 text-xs font-semibold rounded-md transition-colors ${
                      isMixedMode
                        ? 'bg-blue-700 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Mixed Topics ({mixedTopics.length})
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isMixedMode ? 'Browse Chapter to Pick Topics' : 'Chapter'}
                </label>
                {chapters.length > 0 && (
                  <select
                    value={chapters.some((c) => c.chapter === form.chapter) ? form.chapter : '__custom__'}
                    onChange={(e) => {
                      if (e.target.value !== '__custom__') {
                        handleChapterChange(e.target.value);
                      }
                    }}
                    className="w-full mb-1.5 px-2.5 py-2 text-xs font-medium bg-white border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    {chapters.map((c) => (
                      <option key={c.chapter} value={c.chapter}>
                        {c.chapter}
                      </option>
                    ))}
                    <option value="__custom__">Custom Chapter (Type below)</option>
                  </select>
                )}
                <input
                  type="text"
                  value={form.chapter}
                  onChange={(e) => onFormChange((prev) => ({ ...prev, chapter: e.target.value }))}
                  placeholder="Enter exact chapter name"
                  className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              {!isMixedMode ? (
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <label className="text-xs font-semibold text-slate-700">
                      Exact Topic (100% Locked)
                    </label>
                    {topics.length > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          if (!isCustomTopic) {
                            onFormChange((prev) => ({ ...prev, topic: '' }));
                            setTimeout(() => topicInputRef.current?.focus(), 0);
                          } else {
                            onFormChange((prev) => ({ ...prev, topic: topics[0] }));
                          }
                        }}
                        className={`px-2 py-0.5 text-[10.5px] font-semibold rounded border transition-colors ${
                          isCustomTopic
                            ? 'bg-blue-700 text-white border-blue-700'
                            : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                        }`}
                      >
                        {isCustomTopic ? 'Use Syllabus List' : 'Write Custom Topic'}
                      </button>
                    )}
                  </div>
                  {topics.length > 0 && (
                    <select
                      value={topics.includes(form.topic) ? form.topic : '__custom__'}
                      onChange={(e) => {
                        if (e.target.value === '__custom__') {
                          onFormChange((prev) => ({ ...prev, topic: '' }));
                          setTimeout(() => topicInputRef.current?.focus(), 0);
                        } else {
                          onFormChange((prev) => ({ ...prev, topic: e.target.value }));
                        }
                      }}
                      className="w-full mb-1.5 px-2.5 py-2 text-xs font-medium bg-white border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    >
                      {topics.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                      <option value="__custom__">Custom Topic (Khud Likhen Below)</option>
                    </select>
                  )}
                  <input
                    ref={topicInputRef}
                    type="text"
                    value={form.topic}
                    onChange={(e) => onFormChange((prev) => ({ ...prev, topic: e.target.value }))}
                    placeholder="Apna exact topic likhen (e.g., Aldol Condensation, King's Property, Gauss Law in Sphere)"
                    className={`w-full px-2.5 py-2 text-xs rounded-md text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                      isCustomTopic
                        ? 'bg-amber-50/70 border border-amber-300 font-medium'
                        : 'bg-slate-50 border border-slate-200'
                    }`}
                  />
                  {form.topic.trim() && (
                    <p className="mt-1 text-[10.5px] text-emerald-700 font-medium">
                      Exact Topic Lock: 100% questions sirf &ldquo;{form.topic.trim()}&rdquo; par hi banenge.
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-2.5 p-2.5 rounded-lg border border-blue-200 bg-blue-50/40">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-slate-800">
                      Pick Topics to Mix ({topics.length} in chapter)
                    </span>
                    <div className="flex items-center gap-1">
                      {topics.length > 0 && (
                        <button
                          type="button"
                          onClick={selectAllChapterTopics}
                          className="px-2 py-0.5 text-[10.5px] font-semibold bg-blue-700 hover:bg-blue-800 text-white rounded transition-colors cursor-pointer"
                        >
                          + All Chapter
                        </button>
                      )}
                      {mixedTopics.length > 0 && (
                        <button
                          type="button"
                          onClick={() => onFormChange((prev) => ({ ...prev, mixedTopics: [] }))}
                          className="px-2 py-0.5 text-[10.5px] font-medium bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 rounded transition-colors cursor-pointer"
                        >
                          Clear ({mixedTopics.length})
                        </button>
                      )}
                    </div>
                  </div>

                  {topics.length > 0 && (
                    <div className="max-h-40 overflow-y-auto bg-white border border-slate-200 rounded-md divide-y divide-slate-100">
                      {topics.map((t) => {
                        const checked = isTopicSelectedInMix(form.chapter, t);
                        return (
                          <label
                            key={t}
                            className={`flex items-start gap-2 px-2.5 py-1.5 text-[11.5px] cursor-pointer transition-colors ${
                              checked ? 'bg-blue-50/70 text-blue-950 font-medium' : 'text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => toggleMixedTopic(form.chapter, t)}
                              className="mt-0.5 rounded border-slate-300 text-blue-700 focus:ring-blue-600"
                            />
                            <span className="leading-snug">{t}</span>
                          </label>
                        );
                      })}
                    </div>
                  )}

                  {/* Add custom topic into mix */}
                  <div className="flex items-center gap-1.5">
                    <input
                      type="text"
                      value={customMixedInput}
                      onChange={(e) => setCustomMixedInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addCustomMixedTopic();
                        }
                      }}
                      placeholder="Add custom topic to mix..."
                      className="flex-1 px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                    <button
                      type="button"
                      onClick={addCustomMixedTopic}
                      disabled={!customMixedInput.trim()}
                      className="px-2.5 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-900 disabled:bg-slate-300 text-white rounded-md transition-colors cursor-pointer"
                    >
                      + Add
                    </button>
                  </div>

                  {/* Selected Mixed Topics Chips */}
                  {mixedTopics.length > 0 ? (
                    <div className="space-y-1.5">
                      <div className="text-[10.5px] font-semibold text-emerald-800">
                        Mixed Pool ({mixedTopics.length} topics across{' '}
                        {new Set(mixedTopics.map((m) => m.chapter)).size} chapter
                        {new Set(mixedTopics.map((m) => m.chapter)).size > 1 ? 's' : ''}) — switch chapter above to add more chapters too:
                      </div>
                      <div className="flex flex-wrap gap-1 max-h-28 overflow-y-auto">
                        {mixedTopics.map((item) => {
                          const multiChapter = new Set(mixedTopics.map((m) => m.chapter)).size > 1;
                          return (
                            <span
                              key={`${item.chapter}::${item.topic}`}
                              className="inline-flex items-center gap-1 px-2 py-0.5 text-[10.5px] font-medium bg-white border border-blue-200 text-slate-800 rounded"
                            >
                              <span className="truncate max-w-[230px]">
                                {multiChapter ? `${item.chapter}: ` : ''}
                                {item.topic}
                              </span>
                              <button
                                type="button"
                                onClick={() => toggleMixedTopic(item.chapter, item.topic)}
                                className="text-slate-400 hover:text-red-600"
                                title="Remove from mix"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <p className="text-[10.5px] text-amber-700 font-medium">
                      Select at least 1 topic above (from one or multiple chapters) to build a mixed paper or DPP.
                    </p>
                  )}
                </div>
              )}
            </div>
              </>
            )}

            {/* Dedicated Prominent AI Instruction Box + Engine Mode */}
            <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-lg space-y-2">
              <div className="flex items-center justify-between gap-2">
                <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-700" />
                  <span>Direct AI Paper-Setter Instructions</span>
                </label>
                {form.customInstructions?.trim() && (
                  <button
                    type="button"
                    onClick={() => onFormChange((prev) => ({ ...prev, customInstructions: '' }))}
                    className="text-[10.5px] font-medium text-slate-500 hover:text-slate-800"
                  >
                    Clear
                  </button>
                )}
              </div>
              <textarea
                rows={3}
                value={form.customInstructions || ''}
                onChange={(e) =>
                  onFormChange((prev) => ({ ...prev, customInstructions: e.target.value }))
                }
                placeholder="Type any exact instruction for AI: e.g., 'Make 3 Black Book level questions on definite integrals', 'Include benzene Friedel-Crafts reactions', 'Use only integer numerical answers'..."
                className="w-full px-2.5 py-2 text-xs bg-white border border-blue-200 rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <div className="flex flex-wrap gap-1">
                {AI_QUICK_PROMPTS.map((chip) => (
                  <button
                    key={chip.label}
                    type="button"
                    onClick={() =>
                      onFormChange((prev) => ({
                        ...prev,
                        customInstructions: prev.customInstructions?.trim()
                          ? `${prev.customInstructions.trim()} ${chip.text}`
                          : chip.text,
                      }))
                    }
                    className="px-2 py-0.5 text-[10.5px] font-semibold bg-white hover:bg-blue-100 text-blue-800 border border-blue-200 rounded transition-colors"
                  >
                    + {chip.label}
                  </button>
                ))}
              </div>
              <div className="pt-1 border-t border-blue-200/70 space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-semibold text-slate-700">AI Brain Mode</span>
                  <div className="grid grid-cols-2 gap-1 p-0.5 bg-white border border-blue-200 rounded-md">
                    <button
                      type="button"
                      onClick={() => onFormChange((prev) => ({ ...prev, aiMode: 'fast' }))}
                      className={`px-2 py-1 text-[10.5px] font-semibold rounded transition-colors ${
                        form.aiMode !== 'deep'
                          ? 'bg-blue-700 text-white'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Fast (Free-Tier)
                    </button>
                    <button
                      type="button"
                      onClick={() => onFormChange((prev) => ({ ...prev, aiMode: 'deep' }))}
                      className={`px-2 py-1 text-[10.5px] font-semibold rounded transition-colors ${
                        form.aiMode === 'deep'
                          ? 'bg-slate-900 text-white'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Deep Reasoning
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-semibold text-slate-700">AI Speed Engine</span>
                  <div className="grid grid-cols-3 gap-1 p-0.5 bg-white border border-blue-200 rounded-md">
                    {(
                      [
                        { value: 'auto', label: 'Auto (Fast)' },
                        { value: 'groq', label: providers?.groq ? 'Groq Turbo' : 'Groq' },
                        { value: 'gemini', label: 'Gemini' },
                      ] as { value: AiProviderPref; label: string }[]
                    ).map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => onFormChange((prev) => ({ ...prev, aiProvider: opt.value }))}
                        className={`px-2 py-1 text-[10.5px] font-semibold rounded transition-colors whitespace-nowrap ${
                          (form.aiProvider || 'auto') === opt.value
                            ? 'bg-blue-700 text-white'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {!isSamplePaper && (
              <>
                {/* Question Count & Marks Scheme */}
                <div className="space-y-2 pt-1 border-t border-slate-100">
                  <div className="grid grid-cols-3 gap-2.5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Questions (1–30)
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={30}
                        value={form.questionCount}
                        onChange={(e) =>
                          onFormChange((prev) => ({
                            ...prev,
                            questionCount: Math.min(30, Math.max(1, Number(e.target.value) || 1)),
                          }))
                        }
                        className="w-full px-2.5 py-1.5 text-xs font-mono tabular-nums bg-white border border-slate-300 rounded-md text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Marks / Q
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={20}
                        value={form.marksPerQuestion}
                        onChange={(e) => {
                          const val = Math.max(1, Number(e.target.value) || 1);
                          onFormChange((prev) => ({ ...prev, marksPerQuestion: val }));
                          onStyleChange((prev) => ({ ...prev, defaultMarksPerQuestion: val }));
                        }}
                        className="w-full px-2.5 py-1.5 text-xs font-mono tabular-nums bg-white border border-slate-300 rounded-md text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Negative
                      </label>
                      <input
                        type="number"
                        min={0}
                        max={5}
                        step={0.25}
                        value={form.negativeMarks}
                        onChange={(e) => {
                          const val = Math.max(0, Number(e.target.value) || 0);
                          onFormChange((prev) => ({ ...prev, negativeMarks: val }));
                          onStyleChange((prev) => ({ ...prev, defaultNegativeMarks: val }));
                        }}
                        className="w-full px-2.5 py-1.5 text-xs font-mono tabular-nums bg-white border border-slate-300 rounded-md text-slate-900"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-6 gap-1.5">
                    {[5, 10, 15, 20, 25, 30].map((cnt) => (
                      <button
                        key={cnt}
                        type="button"
                        onClick={() => onFormChange((prev) => ({ ...prev, questionCount: cnt }))}
                        className={`py-1 text-[11px] font-mono font-semibold tabular-nums rounded border transition-colors ${
                          form.questionCount === cnt
                            ? 'bg-slate-900 text-white border-slate-900'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {cnt} Qs
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Figure / Diagram Percentage Slider */}
            <div className="pt-1 border-t border-slate-100">
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700">
                  Questions with Figures / Chemical Structures
                </label>
                <span className="text-xs font-mono font-semibold tabular-nums text-blue-700">
                  {form.diagramPercentage}% (~{estimatedDiagramCount} Qs)
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                step={10}
                value={form.diagramPercentage}
                onChange={(e) =>
                  onFormChange((prev) => ({ ...prev, diagramPercentage: Number(e.target.value) }))
                }
                className="w-full accent-blue-700 h-1.5"
              />
              <div className="flex justify-between text-[10.5px] text-slate-400 tabular-nums mt-0.5">
                <span>0% (Text Only)</span>
                <span>50%</span>
                <span>100% (All Diagrams)</span>
              </div>
            </div>

            {!isSamplePaper && (
              /* Question Formats Multi-Select */
              <div className="pt-1 border-t border-slate-100">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Question Formats
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {QUESTION_TYPE_OPTIONS.map((qt) => {
                    const selected = form.questionTypes.includes(qt.value);
                    return (
                      <button
                        key={qt.value}
                        type="button"
                        onClick={() => toggleQuestionType(qt.value)}
                        className={`px-2.5 py-1.5 text-left text-xs rounded-md border transition-colors truncate ${
                          selected
                            ? 'bg-blue-50 text-blue-800 border-blue-300 font-semibold'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {qt.short}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Ideal Reference Books & PYQ Sources */}
            <div className="pt-1 border-t border-slate-100">
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Reference Books ({form.subject})
                </label>
                <span className="text-[10.5px] text-slate-500">
                  {form.referenceBooks.length} selected
                </span>
              </div>
              <div className="space-y-1">
                {recommendedBooks.map((book) => {
                  const checked = form.referenceBooks.includes(book);
                  return (
                    <label
                      key={book}
                      className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer py-0.5"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleReferenceBook(book)}
                        className="rounded border-slate-300 text-blue-700 focus:ring-blue-600"
                      />
                      <span>{book}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* TAB 2: BRANDING, PAGE COLOR, BORDER & ORIENTATION */}
        {activeTab === 'branding' && (
          <>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Institute / Coaching Brand Name
                </label>
                <input
                  type="text"
                  value={styleConfig.brandName}
                  onChange={(e) =>
                    onStyleChange((prev) => ({ ...prev, brandName: e.target.value }))
                  }
                  className="w-full px-2.5 py-2 text-xs font-semibold bg-white border border-slate-300 rounded-md text-slate-900"
                />
              </div>

              <TextStyleRow
                label="Brand Title Style"
                value={styleConfig.brandStyle}
                showUnderline
                onChange={(brandStyle) => onStyleChange((prev) => ({ ...prev, brandStyle }))}
              />

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Powered By / Subtitle
                </label>
                <input
                  type="text"
                  value={styleConfig.brandSubtitle}
                  onChange={(e) =>
                    onStyleChange((prev) => ({ ...prev, brandSubtitle: e.target.value }))
                  }
                  className="w-full px-2.5 py-2 text-xs bg-white border border-slate-300 rounded-md text-slate-900"
                />
              </div>

              <TextStyleRow
                label="Subtitle Style"
                value={styleConfig.subtitleStyle}
                showUnderline
                onChange={(subtitleStyle) => onStyleChange((prev) => ({ ...prev, subtitleStyle }))}
              />
            </div>

            {/* Paper Orientation & Columns */}
            <div className="pt-2 border-t border-slate-200 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  PDF Page Orientation
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      onStyleChange((prev) => ({ ...prev, orientation: 'portrait' }))
                    }
                    className={`py-2 px-3 text-xs font-semibold rounded-md border transition-colors ${
                      styleConfig.orientation === 'portrait'
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    Portrait (Khada)
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      onStyleChange((prev) => ({ ...prev, orientation: 'landscape' }))
                    }
                    className={`py-2 px-3 text-xs font-semibold rounded-md border transition-colors ${
                      styleConfig.orientation === 'landscape'
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    Landscape (Chouda)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Question Column Layout
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => onStyleChange((prev) => ({ ...prev, columns: 1 }))}
                    className={`py-2 px-3 text-xs font-semibold rounded-md border transition-colors ${
                      styleConfig.columns === 1
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    1 Column (Full Width)
                  </button>
                  <button
                    type="button"
                    onClick={() => onStyleChange((prev) => ({ ...prev, columns: 2 }))}
                    className={`py-2 px-3 text-xs font-semibold rounded-md border transition-colors ${
                      styleConfig.columns === 2
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    2 Columns (Coaching)
                  </button>
                </div>
              </div>
            </div>

            {/* Page Background Color */}
            <div className="pt-2 border-t border-slate-200">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700">Page Paper Color</label>
                <span className="text-[11px] font-mono text-slate-500">{styleConfig.pageColor}</span>
              </div>
              <div className="flex items-center gap-2">
                {PAGE_COLOR_PRESETS.map((preset) => (
                  <button
                    key={preset.hex}
                    type="button"
                    title={preset.name}
                    onClick={() => onStyleChange((prev) => ({ ...prev, pageColor: preset.hex }))}
                    className={`w-7 h-7 rounded-md border transition-transform ${
                      styleConfig.pageColor.toUpperCase() === preset.hex
                        ? 'ring-2 ring-blue-700 border-blue-700 scale-105'
                        : 'border-slate-300'
                    }`}
                    style={{ backgroundColor: preset.hex }}
                  />
                ))}
                <input
                  type="color"
                  value={styleConfig.pageColor}
                  onChange={(e) =>
                    onStyleChange((prev) => ({ ...prev, pageColor: e.target.value }))
                  }
                  aria-label="Custom page color"
                  className="w-8 h-7 p-0.5 rounded border border-slate-300 bg-white cursor-pointer"
                />
              </div>
            </div>

            {/* Page Border Controls */}
            <div className="pt-2 border-t border-slate-200 space-y-2.5">
              <label className="block text-xs font-semibold text-slate-700">
                Page Border Style, Color & Thickness
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {(['none', 'solid', 'double', 'dashed', 'dotted', 'ornate'] as BorderStyleType[]).map(
                  (bType) => (
                    <button
                      key={bType}
                      type="button"
                      onClick={() => onStyleChange((prev) => ({ ...prev, borderStyle: bType }))}
                      className={`py-1.5 px-2 text-xs font-medium capitalize rounded border transition-colors ${
                        styleConfig.borderStyle === bType
                          ? 'bg-blue-50 text-blue-800 border-blue-300 font-semibold'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {bType}
                    </button>
                  ),
                )}
              </div>

              {styleConfig.borderStyle !== 'none' && (
                <div className="flex items-center gap-3 pt-1">
                  <input
                    type="color"
                    value={styleConfig.borderColor}
                    onChange={(e) =>
                      onStyleChange((prev) => ({ ...prev, borderColor: e.target.value }))
                    }
                    aria-label="Border color"
                    className="w-8 h-7 p-0.5 rounded border border-slate-300 bg-white cursor-pointer"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between text-[11px] text-slate-500 mb-0.5">
                      <span>Border Thickness</span>
                      <span className="font-mono tabular-nums">{styleConfig.borderWidth}px</span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={8}
                      step={0.5}
                      value={styleConfig.borderWidth}
                      onChange={(e) =>
                        onStyleChange((prev) => ({
                          ...prev,
                          borderWidth: parseFloat(e.target.value),
                        }))
                      }
                      className="w-full accent-blue-700 h-1.5"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Sheet Header Metadata */}
            <div className="pt-2 border-t border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700">Test Metadata Bar</span>
                <label className="inline-flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={styleConfig.showHeaderMeta}
                    onChange={(e) =>
                      onStyleChange((prev) => ({ ...prev, showHeaderMeta: e.target.checked }))
                    }
                    className="rounded border-slate-300 text-blue-700"
                  />
                  <span>Show Bar</span>
                </label>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={styleConfig.batchName}
                  onChange={(e) =>
                    onStyleChange((prev) => ({ ...prev, batchName: e.target.value }))
                  }
                  placeholder="Batch Name"
                  className="px-2 py-1.5 text-xs border border-slate-200 rounded bg-white text-slate-800"
                />
                <input
                  type="text"
                  value={styleConfig.testCode}
                  onChange={(e) =>
                    onStyleChange((prev) => ({ ...prev, testCode: e.target.value }))
                  }
                  placeholder="DPP Code"
                  className="px-2 py-1.5 text-xs border border-slate-200 rounded bg-white text-slate-800"
                />
                <input
                  type="text"
                  value={styleConfig.duration}
                  onChange={(e) =>
                    onStyleChange((prev) => ({ ...prev, duration: e.target.value }))
                  }
                  placeholder="Duration"
                  className="px-2 py-1.5 text-xs border border-slate-200 rounded bg-white text-slate-800"
                />
                <input
                  type="text"
                  value={styleConfig.dateText}
                  onChange={(e) =>
                    onStyleChange((prev) => ({ ...prev, dateText: e.target.value }))
                  }
                  placeholder="Date"
                  className="px-2 py-1.5 text-xs border border-slate-200 rounded bg-white text-slate-800"
                />
              </div>
              <input
                type="text"
                value={styleConfig.footerNote}
                onChange={(e) =>
                  onStyleChange((prev) => ({ ...prev, footerNote: e.target.value }))
                }
                placeholder="Footer note / website / contact"
                className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded bg-white text-slate-800"
              />
            </div>

            {/* Watermark Control */}
            <div className="pt-2 border-t border-slate-200 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700">Diagonal Page Watermark</span>
                <label className="inline-flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={styleConfig.showWatermark}
                    onChange={(e) =>
                      onStyleChange((prev) => ({ ...prev, showWatermark: e.target.checked }))
                    }
                    className="rounded border-slate-300 text-blue-700"
                  />
                  <span>Enable</span>
                </label>
              </div>
              {styleConfig.showWatermark && (
                <div>
                  <div className="flex justify-between text-[11px] text-slate-500 mb-0.5">
                    <span>Watermark Opacity</span>
                    <span className="font-mono tabular-nums">{styleConfig.watermarkOpacity}%</span>
                  </div>
                  <input
                    type="range"
                    min={4}
                    max={20}
                    step={1}
                    value={styleConfig.watermarkOpacity}
                    onChange={(e) =>
                      onStyleChange((prev) => ({
                        ...prev,
                        watermarkOpacity: Number(e.target.value),
                      }))
                    }
                    className="w-full accent-blue-700 h-1.5"
                  />
                </div>
              )}
            </div>

            {/* Admin Page-Saver Compact Controls (All 6 via Sliders) */}
            <div className="pt-2 border-t border-slate-200 space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-slate-800">
                  Admin Page-Saver (6 Sliders)
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() =>
                      onStyleChange((prev) => ({
                        ...prev,
                        mcqOptionsLayout: 2,
                        letterSpacing: -0.45,
                        wordSpacing: -1.5,
                        lineHeight: 1.12,
                        paragraphSpacing: 3,
                        questionSpacing: 3,
                        pageMarginMm: 0,
                      }))
                    }
                    className="px-2 py-0.5 text-[10.5px] font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded transition-colors cursor-pointer"
                  >
                    Max Save
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      onStyleChange((prev) => ({
                        ...prev,
                        mcqOptionsLayout: 0,
                        letterSpacing: 0,
                        wordSpacing: 0,
                        lineHeight: 1.5,
                        paragraphSpacing: 12,
                        questionSpacing: 14,
                        pageMarginMm: 6,
                      }))
                    }
                    className="px-2 py-0.5 text-[10.5px] font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded transition-colors cursor-pointer"
                  >
                    Normal
                  </button>
                </div>
              </div>

              <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50/70 space-y-2.5">
                {/* 1. MCQ 4 Options in 1 Line */}
                <div>
                  <div className="flex justify-between text-[11px] text-slate-700 font-medium mb-0.5">
                    <span>1. MCQ Options Row</span>
                    <span className="font-mono tabular-nums text-blue-800">
                      {(styleConfig.mcqOptionsLayout ?? 0) === 2
                        ? '4 in 1 Line'
                        : (styleConfig.mcqOptionsLayout ?? 0) === 1
                          ? '2 per Row'
                          : 'Auto'}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={2}
                    step={1}
                    value={styleConfig.mcqOptionsLayout ?? 0}
                    onChange={(e) =>
                      onStyleChange((prev) => ({
                        ...prev,
                        mcqOptionsLayout: Number(e.target.value),
                      }))
                    }
                    className="w-full accent-blue-700 h-1.5"
                  />
                </div>

                {/* 2. Letter Tightness */}
                <div>
                  <div className="flex justify-between text-[11px] text-slate-700 font-medium mb-0.5">
                    <span>2. Letter Spacing (Satana)</span>
                    <span className="font-mono tabular-nums">
                      {(styleConfig.letterSpacing ?? 0).toFixed(2)}px
                    </span>
                  </div>
                  <input
                    type="range"
                    min={-1.0}
                    max={0.5}
                    step={0.05}
                    value={styleConfig.letterSpacing ?? 0}
                    onChange={(e) =>
                      onStyleChange((prev) => ({
                        ...prev,
                        letterSpacing: parseFloat(e.target.value),
                      }))
                    }
                    className="w-full accent-blue-700 h-1.5"
                  />
                </div>

                {/* 3. Word Tightness */}
                <div>
                  <div className="flex justify-between text-[11px] text-slate-700 font-medium mb-0.5">
                    <span>3. Word Spacing (Satana)</span>
                    <span className="font-mono tabular-nums">
                      {(styleConfig.wordSpacing ?? 0).toFixed(2)}px
                    </span>
                  </div>
                  <input
                    type="range"
                    min={-3.5}
                    max={2.0}
                    step={0.25}
                    value={styleConfig.wordSpacing ?? 0}
                    onChange={(e) =>
                      onStyleChange((prev) => ({
                        ...prev,
                        wordSpacing: parseFloat(e.target.value),
                      }))
                    }
                    className="w-full accent-blue-700 h-1.5"
                  />
                </div>

                {/* 4. Line Height */}
                <div>
                  <div className="flex justify-between text-[11px] text-slate-700 font-medium mb-0.5">
                    <span>4. Line Spacing (Satana)</span>
                    <span className="font-mono tabular-nums">
                      {(styleConfig.lineHeight ?? 1.5).toFixed(2)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={1.0}
                    max={1.8}
                    step={0.05}
                    value={styleConfig.lineHeight ?? 1.5}
                    onChange={(e) =>
                      onStyleChange((prev) => ({
                        ...prev,
                        lineHeight: parseFloat(e.target.value),
                      }))
                    }
                    className="w-full accent-blue-700 h-1.5"
                  />
                </div>

                {/* 5. Paragraph & Question Gap */}
                <div>
                  <div className="flex justify-between text-[11px] text-slate-700 font-medium mb-0.5">
                    <span>5. Paragraph Gap (Satana)</span>
                    <span className="font-mono tabular-nums">
                      {styleConfig.paragraphSpacing ?? 12}px
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={24}
                    step={1}
                    value={styleConfig.paragraphSpacing ?? 12}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      onStyleChange((prev) => ({
                        ...prev,
                        paragraphSpacing: val,
                        questionSpacing: val,
                      }));
                    }}
                    className="w-full accent-blue-700 h-1.5"
                  />
                </div>

                {/* 6. Page Margin */}
                <div>
                  <div className="flex justify-between text-[11px] text-slate-700 font-medium mb-0.5">
                    <span>6. Page Margin (0 = Zero)</span>
                    <span className="font-mono tabular-nums">
                      {(styleConfig.pageMarginMm ?? 6).toFixed(1)}mm
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={12}
                    step={0.5}
                    value={styleConfig.pageMarginMm ?? 6}
                    onChange={(e) =>
                      onStyleChange((prev) => ({
                        ...prev,
                        pageMarginMm: parseFloat(e.target.value),
                      }))
                    }
                    className="w-full accent-blue-700 h-1.5"
                  />
                </div>
              </div>
            </div>
          </>
        )}

        {/* TAB 3: GRANULAR TYPOGRAPHY, PER-QUESTION-TYPE COLORS & FIGURES */}
        {activeTab === 'typography' && (
          <>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700">Paper Font Family</span>
              <button
                type="button"
                onClick={onResetStyles}
                className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 hover:text-slate-900"
              >
                <RotateCcw className="w-3 h-3" /> Reset Defaults
              </button>
            </div>
            <select
              value={styleConfig.paperFontFamily}
              onChange={(e) =>
                onStyleChange((prev) => ({
                  ...prev,
                  paperFontFamily: e.target.value as PaperFontFamily,
                }))
              }
              className="w-full px-2.5 py-2 text-xs font-medium bg-white border border-slate-300 rounded-md text-slate-900"
            >
              <option value="Source Serif 4">Source Serif 4 (International Academic)</option>
              <option value="Lora">Lora (Classic Exam Print)</option>
              <option value="Plus Jakarta Sans">Plus Jakarta Sans (Modern Coaching)</option>
              <option value="DM Sans">DM Sans (Clean Geometric)</option>
            </select>

            <div className="pt-2 border-t border-slate-200">
              <div className="text-xs font-bold text-slate-800 mb-1">
                Every Element Styling (Color, Size, B / I / U)
              </div>
              <TextStyleRow
                label="Header & Meta Text"
                value={styleConfig.headerMetaStyle}
                showUnderline
                onChange={(headerMetaStyle) =>
                  onStyleChange((prev) => ({ ...prev, headerMetaStyle }))
                }
              />
              <TextStyleRow
                label="Chapter & Topic Title Line"
                value={styleConfig.chapterLineStyle}
                showUnderline
                onChange={(chapterLineStyle) =>
                  onStyleChange((prev) => ({ ...prev, chapterLineStyle }))
                }
              />
              <TextStyleRow
                label="MCQ / Objective Question Stem"
                value={styleConfig.questionStyle}
                showUnderline
                onChange={(questionStyle) => onStyleChange((prev) => ({ ...prev, questionStyle }))}
              />
              <TextStyleRow
                label="MCQ Options (A, B, C, D)"
                value={styleConfig.optionStyle}
                showUnderline
                onChange={(optionStyle) => onStyleChange((prev) => ({ ...prev, optionStyle }))}
              />
              <TextStyleRow
                label="Subjective Question Text"
                value={styleConfig.subjectiveStyle}
                showUnderline
                onChange={(subjectiveStyle) =>
                  onStyleChange((prev) => ({ ...prev, subjectiveStyle }))
                }
              />
              <TextStyleRow
                label="Match Left Column (Column I)"
                value={styleConfig.matchLeftStyle}
                showUnderline
                onChange={(matchLeftStyle) =>
                  onStyleChange((prev) => ({ ...prev, matchLeftStyle }))
                }
              />
              <TextStyleRow
                label="Match Right Column (Column II)"
                value={styleConfig.matchRightStyle}
                showUnderline
                onChange={(matchRightStyle) =>
                  onStyleChange((prev) => ({ ...prev, matchRightStyle }))
                }
              />
              <TextStyleRow
                label="Assertion (A) Statement"
                value={styleConfig.assertionStyle}
                showUnderline
                onChange={(assertionStyle) =>
                  onStyleChange((prev) => ({ ...prev, assertionStyle }))
                }
              />
              <TextStyleRow
                label="Reason (R) Statement"
                value={styleConfig.reasonStyle}
                showUnderline
                onChange={(reasonStyle) => onStyleChange((prev) => ({ ...prev, reasonStyle }))}
              />
              <TextStyleRow
                label="Marks Badge & PYQ Pattern Tag"
                value={styleConfig.metaTagStyle}
                showUnderline
                onChange={(metaTagStyle) => onStyleChange((prev) => ({ ...prev, metaTagStyle }))}
              />
              <TextStyleRow
                label="Answer Key & Solutions Text"
                value={styleConfig.solutionStyle}
                showUnderline
                onChange={(solutionStyle) => onStyleChange((prev) => ({ ...prev, solutionStyle }))}
              />
              <TextStyleRow
                label="Paper Footer Text"
                value={styleConfig.footerStyle}
                showUnderline
                onChange={(footerStyle) => onStyleChange((prev) => ({ ...prev, footerStyle }))}
              />
            </div>

            {/* Figure / Diagram & Organic Structure Controls */}
            <div className="pt-2 border-t border-slate-200 space-y-2.5">
              <div className="text-xs font-bold text-slate-800">
                Figures, Circuits & Chemistry Structures
              </div>
              <div className="flex items-center justify-between gap-3">
                <label className="text-xs font-medium text-slate-700">
                  Drawing & Bond Color
                </label>
                <div className="flex items-center gap-1.5">
                  {['#0F172A', '#1D4ED8', '#047857', '#B91C1C', '#6D28D9'].map((hex) => (
                    <button
                      key={hex}
                      type="button"
                      onClick={() => onStyleChange((prev) => ({ ...prev, figureColor: hex }))}
                      className={`w-5 h-5 rounded border ${
                        styleConfig.figureColor.toUpperCase() === hex
                          ? 'ring-2 ring-blue-700 border-white'
                          : 'border-slate-300'
                      }`}
                      style={{ backgroundColor: hex }}
                    />
                  ))}
                  <input
                    type="color"
                    value={styleConfig.figureColor}
                    onChange={(e) =>
                      onStyleChange((prev) => ({ ...prev, figureColor: e.target.value }))
                    }
                    className="w-7 h-6 p-0.5 rounded border border-slate-300 bg-white cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-600 mb-1">
                  <span>Drawing / Bond Line Thickness</span>
                  <span className="font-mono tabular-nums">{styleConfig.figureStrokeWidth}px</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={4}
                  step={0.2}
                  value={styleConfig.figureStrokeWidth}
                  onChange={(e) =>
                    onStyleChange((prev) => ({
                      ...prev,
                      figureStrokeWidth: parseFloat(e.target.value),
                    }))
                  }
                  className="w-full accent-blue-700 h-1.5"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-600 mb-1">
                  <span>Figure Scale</span>
                  <span className="font-mono tabular-nums">{styleConfig.figureScale}%</span>
                </div>
                <input
                  type="range"
                  min={75}
                  max={125}
                  step={5}
                  value={styleConfig.figureScale}
                  onChange={(e) =>
                    onStyleChange((prev) => ({ ...prev, figureScale: Number(e.target.value) }))
                  }
                  className="w-full accent-blue-700 h-1.5"
                />
              </div>
            </div>

            {/* Visibility Toggles */}
            <div className="pt-2 border-t border-slate-200 space-y-2">
              <label className="flex items-center justify-between text-xs text-slate-700 cursor-pointer">
                <span>Show Marks Badge per Question</span>
                <input
                  type="checkbox"
                  checked={styleConfig.showMarksPerQuestion}
                  onChange={(e) =>
                    onStyleChange((prev) => ({
                      ...prev,
                      showMarksPerQuestion: e.target.checked,
                    }))
                  }
                  className="rounded border-slate-300 text-blue-700"
                />
              </label>
              <label className="flex items-center justify-between text-xs text-slate-700 cursor-pointer">
                <span>Show PYQ / Book Pattern Tags</span>
                <input
                  type="checkbox"
                  checked={styleConfig.showPyqTags}
                  onChange={(e) =>
                    onStyleChange((prev) => ({ ...prev, showPyqTags: e.target.checked }))
                  }
                  className="rounded border-slate-300 text-blue-700"
                />
              </label>
            </div>
          </>
        )}
      </div>

      {/* Sticky Bottom Generate CTA */}
      <div className="p-3.5 border-t border-slate-200 bg-slate-50 flex items-center gap-2">
        {!isGenerating && remainingResumeQs > 0 && onResumeGenerate ? (
          <>
            <button
              type="button"
              onClick={onResumeGenerate}
              className="flex-1 py-2.5 px-3.5 inline-flex items-center justify-center gap-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-xs cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Continue (+{remainingResumeQs} Qs)</span>
            </button>
            <button
              type="button"
              onClick={onGenerate}
              disabled={
                isSamplePaper
                  ? sampleScope === 'selected' && selectedSampleChapters.length === 0
                  : isMixedMode
                    ? mixedTopics.length === 0
                    : !form.chapter.trim() || !form.topic.trim()
              }
              title="Start fresh from Q1 (replaces saved partial progress)"
              className="py-2.5 px-3 inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 disabled:bg-slate-100 disabled:text-slate-400 border border-slate-300 rounded-lg transition-colors cursor-pointer shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Fresh</span>
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={onGenerate}
            disabled={
              isGenerating ||
              (isSamplePaper
                ? sampleScope === 'selected' && selectedSampleChapters.length === 0
                : isMixedMode
                  ? mixedTopics.length === 0
                  : !form.chapter.trim() || !form.topic.trim())
            }
            className="flex-1 py-2.5 px-4 inline-flex items-center justify-center gap-2 text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 disabled:bg-slate-400 rounded-lg transition-colors shadow-xs cursor-pointer"
          >
            <Sparkles className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>
              {isGenerating
                ? isSamplePaper
                  ? `Generating ${activeBlueprint.shortLabel} (${blueprintStats.totalQuestions} Qs)...`
                  : form.paperType === 'test'
                    ? 'Generating Test Paper & Solutions...'
                    : 'Generating PYQ DPP & Solutions...'
                : isSamplePaper
                  ? `Generate ${activeBlueprint.shortLabel} Paper`
                  : form.paperType === 'test'
                    ? isMixedMode
                      ? 'Generate Mixed Test Paper'
                      : 'Generate Test Paper & Answer Key'
                    : isMixedMode
                      ? 'Generate Mixed-Topic DPP'
                      : 'Generate DPP & Answer Key'}
            </span>
          </button>
        )}
        {isGenerating && onCancelGenerate && (
          <button
            type="button"
            onClick={onCancelGenerate}
            title="Pause Generation (completed batches stay saved)"
            className="py-2.5 px-3 inline-flex items-center justify-center gap-1 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
            <span>Pause</span>
          </button>
        )}
      </div>
    </aside>
  );
};
