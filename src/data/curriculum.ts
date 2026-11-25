import { ClassLevel, DppStyleConfig, JuniorBoard, JuniorTier, QuestionType, SeniorExam } from '../types/dpp';
import { ChapterEntry, getSyllabusChapters } from './syllabusCatalog';
export type { ChapterEntry };

export const CLASS_LEVELS: { value: ClassLevel; label: string; group: 'junior' | 'senior' }[] = [
  { value: '7', label: 'Class 7', group: 'junior' },
  { value: '8', label: 'Class 8', group: 'junior' },
  { value: '9', label: 'Class 9', group: 'junior' },
  { value: '10', label: 'Class 10', group: 'junior' },
  { value: '11', label: 'Class 11', group: 'senior' },
  { value: '12', label: 'Class 12', group: 'senior' },
];

export const JUNIOR_BOARDS: { value: JuniorBoard; label: string }[] = [
  { value: 'CBSE', label: 'CBSE (NCERT)' },
  { value: 'JAC', label: 'JAC (Jharkhand Board)' },
  { value: 'ICSE', label: 'ICSE (CISCE)' },
];

export const JUNIOR_TIERS: { value: JuniorTier; label: string }[] = [
  { value: 'School Level', label: 'School / Board Level' },
  { value: 'Olympiad Level', label: 'Olympiad Level (IOQM / NSEJS / SOF)' },
];

export const SENIOR_EXAMS: { value: SeniorExam; label: string }[] = [
  { value: 'Board Exams', label: 'Board Exams (CBSE / JAC / ISC)' },
  { value: 'JEE Mains', label: 'JEE Main (NTA Pattern)' },
  { value: 'NEET', label: 'NEET (UG) Medical' },
  { value: 'JEE Advanced', label: 'JEE Advanced (IIT)' },
];

export const JUNIOR_SUBJECTS = [
  'Physics',
  'Chemistry',
  'Biology',
  'Science (Combined)',
  'Mathematics',
  'History',
  'Civics',
  'Geography',
  'Social Science (Combined)',
  'Hindi',
  'English',
  'Sanskrit',
  'Computer Science',
];

export const SENIOR_SUBJECTS = ['Physics', 'Chemistry', 'Mathematics', 'Biology'];

export const QUESTION_TYPE_OPTIONS: { value: QuestionType; label: string; short: string }[] = [
  { value: 'mcq', label: 'MCQ (Single Correct)', short: 'MCQ' },
  { value: 'multiple_correct', label: 'Multiple Correct (1 or More)', short: 'Multi-MCQ' },
  { value: 'assertion_reason', label: 'Assertion & Reason', short: 'A & R' },
  { value: 'true_false', label: 'True / False', short: 'T / F' },
  { value: 'fill_blank', label: 'Fill in the Blanks', short: 'Fill Blanks' },
  { value: 'match_following', label: 'Match the Following (Column I & II)', short: 'Matching' },
  { value: 'subjective', label: 'Subjective / Numerical Proof', short: 'Subjective' },
];

export const REFERENCE_BOOKS_BY_PROFILE: Record<string, string[]> = {
  'JEE Advanced': [
    'H.C. Verma (Concepts of Physics)',
    'Cengage Series (Physics / Maths)',
    'Vikas Gupta (Black Book) & Sameer Bansal',
    'Irodov / Pathfinder',
    'MS Chouhan (Organic) & N. Awasthi',
    'A. Das Gupta / S.L. Loney / Hall & Knight',
  ],
  'JEE Mains': [
    'H.C. Verma',
    'Cengage JEE Main (G. Tewani / BM Sharma)',
    'Arihant PYQ Archive & Skills in Maths',
    'NCERT + Exemplar',
    'MS Chouhan (Elementary) & N. Awasthi',
  ],
  NEET: [
    'NCERT Line-by-Line',
    'NCERT Exemplar',
    'MTG NCERT at Your Fingertips',
    'DC Pandey NEET',
    'Errorless / Arihant NEET PYQs',
  ],
  'Board Exams': [
    'NCERT Textbook',
    'NCERT Exemplar',
    'RD Sharma / SL Arora / ML Aggarwal',
    'JAC Model Question Bank',
    'Oswaal / Arihant Board PYQs',
  ],
  'Olympiad Level': [
    'IOQM / PRMO / RMO Archives',
    'NSEJS / IJSO Past Papers',
    'Pathfinder Olympiad (Maths / Physics)',
    'Hall & Knight / S.L. Loney / Challenges',
    'Pearson IIT Foundation',
  ],
  'School Level': [
    'NCERT / JCERT Textbook',
    'Selina Concise (ICSE)',
    'RD Sharma / RS Aggarwal / ML Aggarwal',
    'Lakhmir Singh & Manjit Kaur',
    'JAC / CBSE Sample Papers',
  ],
};

const SUBJECT_BOOKS: Record<string, Record<string, string[]>> = {
  Mathematics: {
    'JEE Advanced': [
      'Vikas Gupta & Pankaj Joshi (Black Book)',
      'Sameer Bansal (Calculus)',
      'G. Tewani — Cengage Mathematics',
      'A. Das Gupta (IIT Mathematics)',
      'S.L. Loney (Trigonometry & Coordinate)',
      'Hall & Knight (Higher Algebra)',
      'I.A. Maron (Problems in Calculus)',
      'Arihant Skills in Maths (Amit M. Agarwal / S.K. Goyal)',
    ],
    'JEE Mains': [
      'G. Tewani — Cengage JEE Main Maths',
      'Arihant Skills in Mathematics (SK Goyal / Amit Agarwal)',
      'RD Sharma Objective Mathematics',
      'NTA JEE Main Maths PYQ Archive',
      'NCERT + NCERT Exemplar',
    ],
    'Board Exams': [
      'NCERT Mathematics + Exemplar',
      'R.D. Sharma (CBSE / JAC)',
      'M.L. Aggarwal (ISC / ICSE)',
      'JAC Model Question Bank',
      'Arihant / Oswaal Maths PYQs',
    ],
    'Olympiad Level': [
      'IOQM / PRMO / RMO Past Archives',
      'Pathfinder for Olympiad Mathematics',
      'Challenge & Thrill of Pre-College Mathematics',
      'Hall & Knight (Higher Algebra)',
      'S.L. Loney (Plane Trigonometry & Coordinate)',
      'Pearson IIT Foundation Mathematics',
    ],
    'School Level': [
      'NCERT / JCERT Mathematics',
      'R.D. Sharma / R.S. Aggarwal',
      'M.L. Aggarwal / Selina Concise (ICSE)',
      'NCERT Exemplar Mathematics',
      'JAC / CBSE Sample Papers',
    ],
  },
  Physics: {
    'JEE Advanced': [
      'H.C. Verma (Concepts of Physics Vol 1 & 2)',
      'B.M. Sharma — Cengage Physics',
      'I.E. Irodov (General Physics)',
      'Pathfinder for Olympiad & JEE Adv Physics',
      'D.C. Pandey (Arihant Series)',
      'Krotov / Anurag Mishra',
    ],
    'JEE Mains': [
      'H.C. Verma (Concepts of Physics)',
      'D.C. Pandey JEE Main Physics',
      'Cengage JEE Main Physics',
      'NCERT + NCERT Exemplar',
      'NTA JEE Main PYQ Archive',
    ],
    NEET: [
      'NCERT Physics Line-by-Line + Exemplar',
      'D.C. Pandey NEET Objective Physics',
      'MTG NCERT at Your Fingertips Physics',
      'Errorless / Arihant NEET PYQs',
    ],
  },
  Chemistry: {
    'JEE Advanced': [
      'M.S. Chouhan (Advanced Organic Chemistry)',
      'N. Awasthi (Physical Chemistry)',
      'V.K. Jaiswal (Inorganic Chemistry)',
      'Peter Sykes / Paula Bruice (Mechanisms)',
      'Cengage Chemistry (K.S. Verma)',
      'J.D. Lee (Sudarsan Guha Inorganic)',
    ],
    'JEE Mains': [
      'NCERT Chemistry Line-by-Line + Exemplar',
      'M.S. Chouhan (Elementary Organic)',
      'N. Awasthi (Physical Chemistry Level 1)',
      'V.K. Jaiswal / NCERT Inorganic PYQs',
      'Arihant JEE Main Chemistry PYQs',
    ],
    NEET: [
      'NCERT Chemistry Line-by-Line',
      'M.S. Chouhan NEET Organic',
      'N. Awasthi NEET Physical Chemistry',
      'MTG NCERT at Your Fingertips Chemistry',
    ],
  },
  Biology: {
    NEET: [
      'NCERT Biology Line-by-Line (Class 11 & 12)',
      'NCERT Exemplar Biology',
      'MTG NCERT at Your Fingertips Biology',
      'Dr. Ali Objective Biology',
      'Arihant / Disha NEET 37 Years PYQs',
    ],
  },
};

export function getRecommendedBooks(profileKey: string, subject: string): string[] {
  const bySubject = SUBJECT_BOOKS[subject]?.[profileKey];
  if (bySubject && bySubject.length > 0) {
    return bySubject;
  }
  return REFERENCE_BOOKS_BY_PROFILE[profileKey] || [];
}

export function getChaptersForSelection(
  classLevel: ClassLevel,
  subject: string,
  boardOrExam?: string,
): ChapterEntry[] {
  return getSyllabusChapters(classLevel, subject, boardOrExam);
}

export const DEFAULT_STYLE_CONFIG: DppStyleConfig = {
  brandName: 'SAFAL ACADEMY LIVE',
  brandSubtitle: 'Powered by Ravish Sir',
  brandStyle: {
    color: '#0F172A',
    fontSize: 22,
    bold: true,
    italic: false,
    underline: false,
  },
  subtitleStyle: {
    color: '#1D4ED8',
    fontSize: 12,
    bold: true,
    italic: true,
    underline: false,
  },
  showHeaderMeta: true,
  batchName: 'Target Ranker Batch',
  testCode: 'DPP-01',
  duration: '45 Mins',
  dateText: 'Nov 2026',
  footerNote: 'Safal Academy Live · Quality PYQ Practice Sheet',

  orientation: 'portrait',
  columns: 1,
  pageColor: '#FFFFFF',
  borderStyle: 'double',
  borderColor: '#1E293B',
  borderWidth: 2,
  paperFontFamily: 'Source Serif 4',
  showWatermark: false,
  watermarkOpacity: 8,
  questionSpacing: 14,
  mcqOptionsLayout: 0,
  letterSpacing: 0,
  wordSpacing: 0,
  lineHeight: 1.5,
  paragraphSpacing: 12,
  pageMarginMm: 6,

  headerMetaStyle: {
    color: '#334155',
    fontSize: 11,
    bold: false,
    italic: false,
    underline: false,
  },
  chapterLineStyle: {
    color: '#0F172A',
    fontSize: 12,
    bold: true,
    italic: false,
    underline: false,
  },
  questionStyle: {
    color: '#0F172A',
    fontSize: 13.5,
    bold: false,
    italic: false,
    underline: false,
  },
  optionStyle: {
    color: '#1E293B',
    fontSize: 12.5,
    bold: false,
    italic: false,
    underline: false,
  },
  subjectiveStyle: {
    color: '#1E3A8A',
    fontSize: 13.5,
    bold: false,
    italic: false,
    underline: false,
  },
  matchLeftStyle: {
    color: '#0F172A',
    fontSize: 12.5,
    bold: true,
    italic: false,
    underline: false,
  },
  matchRightStyle: {
    color: '#047857',
    fontSize: 12.5,
    bold: false,
    italic: false,
    underline: false,
  },
  assertionStyle: {
    color: '#7C2D12',
    fontSize: 13,
    bold: false,
    italic: false,
    underline: false,
  },
  reasonStyle: {
    color: '#1E40AF',
    fontSize: 13,
    bold: false,
    italic: false,
    underline: false,
  },
  metaTagStyle: {
    color: '#64748B',
    fontSize: 10.5,
    bold: true,
    italic: false,
    underline: false,
  },
  solutionStyle: {
    color: '#1E293B',
    fontSize: 12.5,
    bold: false,
    italic: false,
    underline: false,
  },
  footerStyle: {
    color: '#475569',
    fontSize: 10.5,
    bold: false,
    italic: false,
    underline: false,
  },

  figureColor: '#0F172A',
  figureStrokeWidth: 1.8,
  figureScale: 100,

  defaultMarksPerQuestion: 4,
  defaultNegativeMarks: 1,
  showMarksPerQuestion: true,
  showPyqTags: true,
};
