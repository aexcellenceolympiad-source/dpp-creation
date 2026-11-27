export type ClassLevel = '7' | '8' | '9' | '10' | '11' | '12';

export type JuniorBoard = 'CBSE' | 'JAC' | 'ICSE';
export type JuniorTier = 'School Level' | 'Olympiad Level';
export type SeniorExam = 'Board Exams' | 'JEE Mains' | 'NEET' | 'JEE Advanced';

export type QuestionType =
  | 'mcq'
  | 'multiple_correct'
  | 'assertion_reason'
  | 'true_false'
  | 'fill_blank'
  | 'match_following'
  | 'subjective';

export type LanguageMedium = 'English' | 'Hindi' | 'Bilingual';
export type PaperType = 'dpp' | 'test' | 'sample_paper';
export type TopicMode = 'single' | 'mixed';
export type SamplePaperExamId =
  | 'neet_180'
  | 'jee_main_75'
  | 'jee_adv_54'
  | 'cbse_12_board'
  | 'cbse_10_board';
export type SampleSyllabusScope = 'full' | 'selected';
export type SampleDistributionMode = 'equal' | 'custom';
export type AiReasoningMode = 'deep' | 'fast';
export type AiProviderPref = 'auto' | 'groq' | 'gemini';

export interface MixedTopicItem {
  chapter: string;
  topic: string;
}

export interface SampleChapterSelection {
  subject: string;
  classLevel: ClassLevel;
  chapter: string;
  questionCount?: number;
}

export interface ReactionScheme {
  reactants: string[]; // SMILES strings
  reagentsAbove?: string;
  reagentsBelow?: string;
  products: string[]; // SMILES strings
}

export interface MathPlotSpec {
  xMin?: number;
  xMax?: number;
  yMin?: number;
  yMax?: number;
  showGrid?: boolean;
  functions?: {
    expr: string;
    label?: string;
    dashed?: boolean;
  }[];
  lines?: {
    a?: number; // ax + by + c = 0
    b?: number;
    c?: number;
    x1?: number;
    y1?: number;
    x2?: number;
    y2?: number;
    label?: string;
    dashed?: boolean;
  }[];
  circles?: {
    cx: number;
    cy: number;
    r: number;
    label?: string;
    dashed?: boolean;
  }[];
  points?: {
    x: number;
    y: number;
    label?: string;
    open?: boolean;
  }[];
  shade?: {
    exprTop: string;
    exprBottom?: string; // defaults to 0 (x-axis)
    from: number;
    to: number;
  };
}

export interface GeometrySpec {
  vertices: { id: string; x: number; y: number; label?: string }[];
  segments?: { from: string; to: string; label?: string; dashed?: boolean }[];
  circles?: { cx: number; cy: number; r: number; label?: string }[];
  angleArcs?: { vertex: string; p1: string; p2: string; label?: string; rightAngle?: boolean }[];
}

export interface PhysicsDiagramSpec {
  preset: 'incline_block' | 'pulley_two_mass' | 'circuit_loop' | 'ray_optics' | 'projectile' | 'fbd_block';
  angleDeg?: number;
  mass1?: string;
  mass2?: string;
  hasPulley?: boolean;
  forces?: { dir: 'up' | 'down' | 'left' | 'right' | 'up_incline' | 'down_incline' | 'normal'; label: string }[];
  // Circuit fields
  topComponent?: string;
  bottomComponent?: string;
  leftComponent?: string;
  rightComponent?: string;
  emfLabel?: string;
  currentLabel?: string;
  // Ray optics fields
  opticsType?: 'convex_lens' | 'concave_lens' | 'concave_mirror' | 'convex_mirror';
  objectDistLabel?: string;
  focalLabel?: string;
  objectBeyond2F?: boolean;
  // Projectile fields
  velocityLabel?: string;
  rangeLabel?: string;
  heightLabel?: string;
}

export interface DiagramData {
  kind:
    | 'none'
    | 'svg'
    | 'chemistry_smiles'
    | 'chemistry_reaction'
    | 'math_plot'
    | 'geometry'
    | 'physics_diagram';
  svgCode?: string;
  smiles?: string;
  reaction?: ReactionScheme;
  mathPlot?: MathPlotSpec;
  geometry?: GeometrySpec;
  physics?: PhysicsDiagramSpec;
  caption?: string;
}

export interface QuestionOption {
  label: string;
  text: string;
  smiles?: string;
}

export interface MatchColumnsData {
  leftHeader: string;
  rightHeader: string;
  leftItems: { key: string; text: string }[];
  rightItems: { key: string; text: string }[];
}

export interface DppQuestion {
  id: string;
  number: number;
  type: QuestionType;
  marks: number;
  negativeMarks: number;
  pyqTag?: string;
  sectionLabel?: string;
  subjectTag?: string;
  stem: string;
  options?: QuestionOption[];
  assertion?: string;
  reason?: string;
  matchColumns?: MatchColumnsData;
  diagram?: DiagramData;
  correctAnswer: string;
  solutionSteps: string[];
  solutionDiagram?: DiagramData;
}

export interface DppMetadata {
  classLevel: ClassLevel;
  boardOrExam: string;
  tierOrLevel: string;
  subject: string;
  chapter: string;
  topic: string;
  referenceBooks: string[];
  medium: LanguageMedium;
  paperType?: PaperType;
  topicMode?: TopicMode;
  mixedTopics?: MixedTopicItem[];
  sampleExamId?: SamplePaperExamId;
  sampleSyllabusScope?: SampleSyllabusScope;
  sampleDistributionMode?: SampleDistributionMode;
  sampleSelectedChapters?: SampleChapterSelection[];
}

export interface DppDocument {
  title: string;
  subtitle: string;
  metadata: DppMetadata;
  questions: DppQuestion[];
  isStarterPreview?: boolean;
}

export interface TextStyleConfig {
  color: string;
  fontSize: number; // in px
  bold: boolean;
  italic: boolean;
  underline: boolean;
}

export type PageOrientation = 'portrait' | 'landscape';
export type BorderStyleType = 'none' | 'solid' | 'double' | 'dashed' | 'dotted' | 'ornate';
export type PaperFontFamily = 'Source Serif 4' | 'Plus Jakarta Sans' | 'Lora' | 'DM Sans';

export interface DppStyleConfig {
  // Branding
  brandName: string;
  brandSubtitle: string;
  brandStyle: TextStyleConfig;
  subtitleStyle: TextStyleConfig;
  showHeaderMeta: boolean;
  batchName: string;
  testCode: string;
  duration: string;
  dateText: string;
  footerNote: string;

  // Paper Layout, Border & Watermark
  orientation: PageOrientation;
  columns: 1 | 2;
  pageColor: string;
  borderStyle: BorderStyleType;
  borderColor: string;
  borderWidth: number;
  paperFontFamily: PaperFontFamily;
  showWatermark: boolean;
  watermarkOpacity: number; // 4 to 20 (%)
  questionSpacing: number; // 8 to 28 (px)

  // Page-Saver & Compact Layout Controls (6 Sliders)
  mcqOptionsLayout: number; // 0 = Auto, 1 = 2/Row, 2 = All 4 in 1 Line
  letterSpacing: number; // -1.0 to 0.5 px
  wordSpacing: number; // -3.5 to 2.0 px
  lineHeight: number; // 1.0 to 1.8
  paragraphSpacing: number; // 0 to 24 px
  pageMarginMm: number; // 0 to 12 mm

  // Granular Element Typography & Colors (All support size, color, bold, italic, underline)
  headerMetaStyle: TextStyleConfig;
  chapterLineStyle: TextStyleConfig;
  questionStyle: TextStyleConfig;
  optionStyle: TextStyleConfig;
  subjectiveStyle: TextStyleConfig;
  matchLeftStyle: TextStyleConfig;
  matchRightStyle: TextStyleConfig;
  assertionStyle: TextStyleConfig;
  reasonStyle: TextStyleConfig;
  metaTagStyle: TextStyleConfig;
  solutionStyle: TextStyleConfig;
  footerStyle: TextStyleConfig;

  // Legacy fallback fields kept optional for smooth migration
  assertionColor?: string;
  reasonColor?: string;

  // Figure / Diagram Styling
  figureColor: string;
  figureStrokeWidth: number;
  figureScale: number; // percentage 70 - 130

  // Marks & Labels
  defaultMarksPerQuestion: number;
  defaultNegativeMarks: number;
  showMarksPerQuestion: boolean;
  showPyqTags: boolean;
}

export interface GenerateDppPayload {
  classLevel: ClassLevel;
  juniorBoard: JuniorBoard;
  juniorTier: JuniorTier;
  seniorExam: SeniorExam;
  subject: string;
  chapter: string;
  topic: string;
  questionCount: number;
  questionTypes: QuestionType[];
  diagramPercentage: number;
  medium: LanguageMedium;
  referenceBooks: string[];
  marksPerQuestion: number;
  negativeMarks: number;
  aiMode: AiReasoningMode;
  aiProvider?: AiProviderPref;
  customInstructions?: string;
  paperType?: PaperType;
  topicMode?: TopicMode;
  mixedTopics?: MixedTopicItem[];
  sampleExamId?: SamplePaperExamId;
  sampleSyllabusScope?: SampleSyllabusScope;
  sampleDistributionMode?: SampleDistributionMode;
  sampleSelectedChapters?: SampleChapterSelection[];
}
