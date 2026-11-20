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

export interface ReactionScheme {
  reactants: string[]; // SMILES strings
  reagentsAbove?: string;
  reagentsBelow?: string;
  products: string[]; // SMILES strings
}

export interface DiagramData {
  kind: 'none' | 'svg' | 'chemistry_smiles' | 'chemistry_reaction';
  svgCode?: string;
  smiles?: string;
  reaction?: ReactionScheme;
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
  underline?: boolean;
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

  // Paper Layout & Border
  orientation: PageOrientation;
  columns: 1 | 2;
  pageColor: string;
  borderStyle: BorderStyleType;
  borderColor: string;
  borderWidth: number;
  paperFontFamily: PaperFontFamily;

  // Element Typography & Colors
  headerMetaStyle: TextStyleConfig;
  questionStyle: TextStyleConfig;
  optionStyle: TextStyleConfig;
  subjectiveStyle: TextStyleConfig;
  matchLeftStyle: TextStyleConfig;
  matchRightStyle: TextStyleConfig;
  assertionColor: string;
  reasonColor: string;

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
  customInstructions?: string;
}
