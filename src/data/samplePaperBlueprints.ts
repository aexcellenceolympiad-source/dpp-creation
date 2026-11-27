import { ClassLevel, QuestionType, SamplePaperExamId } from '../types/dpp';
import { getSyllabusChapters } from './syllabusCatalog';

export interface SamplePaperSectionSpec {
  id: string;
  label: string;
  subject: string;
  count: number;
  marks: number;
  negativeMarks: number;
  questionTypes: QuestionType[];
  patternNote: string;
}

export interface SamplePaperBlueprint {
  id: SamplePaperExamId;
  title: string;
  shortLabel: string;
  examHeaderTag: string;
  duration: string;
  isMultiSubject: boolean;
  classLevelLabel: string;
  boardOrExam: string;
  subjects: string[];
  defaultBoardSubject: string;
  getSections: (boardSubject?: string) => SamplePaperSectionSpec[];
}

export interface SamplePoolChapter {
  subject: string;
  classLevel: ClassLevel;
  chapter: string;
  topics: string[];
}

export const SAMPLE_PAPER_BLUEPRINTS: SamplePaperBlueprint[] = [
  {
    id: 'neet_180',
    title: 'NEET (UG) — 180 Questions (720 Marks)',
    shortLabel: 'NEET (180 Qs)',
    examHeaderTag: 'NEET (UG) · NTA Official Pattern (45 Phy + 45 Chem + 90 Bio)',
    duration: '3 Hours (180 Mins)',
    isMultiSubject: true,
    classLevelLabel: '11 & 12',
    boardOrExam: 'NEET',
    subjects: ['Physics', 'Chemistry', 'Biology'],
    defaultBoardSubject: 'Biology',
    getSections: () => [
      {
        id: 'neet-phy',
        label: 'PART I: PHYSICS (Q1–Q45 · +4 / -1)',
        subject: 'Physics',
        count: 45,
        marks: 4,
        negativeMarks: 1,
        questionTypes: ['mcq'],
        patternNote:
          'NTA NEET Physics (latest NCERT + PYQ pattern): crisp single-correct MCQs covering formula applications, conceptual NCERT traps, graphs, and statement-I/II MCQ options.',
      },
      {
        id: 'neet-chem',
        label: 'PART II: CHEMISTRY (Q46–Q90 · +4 / -1)',
        subject: 'Chemistry',
        count: 45,
        marks: 4,
        negativeMarks: 1,
        questionTypes: ['mcq'],
        patternNote:
          'NTA NEET Chemistry (Physical, Organic & Inorganic — latest NCERT + PYQ pattern): include reaction mechanisms, periodic trends, numericals, and statement/matching MCQs.',
      },
      {
        id: 'neet-bio',
        label: 'PART III: BIOLOGY — BOTANY & ZOOLOGY (Q91–Q180 · +4 / -1)',
        subject: 'Biology',
        count: 90,
        marks: 4,
        negativeMarks: 1,
        questionTypes: ['mcq'],
        patternNote:
          'NTA NEET Biology (45 Botany + 45 Zoology — strict NCERT line-by-line + PYQ pattern): include Statement-I/II, Assertion-Reason framed as 4-option MCQ, Match-List MCQs, and NCERT diagram/cycle recall.',
      },
    ],
  },
  {
    id: 'jee_main_75',
    title: 'JEE Main (NTA) — 75 Questions (300 Marks)',
    shortLabel: 'JEE Main (75 Qs)',
    examHeaderTag: 'JEE Main (NTA) · 25 Maths + 25 Physics + 25 Chemistry (300 Marks)',
    duration: '3 Hours (180 Mins)',
    isMultiSubject: true,
    classLevelLabel: '11 & 12',
    boardOrExam: 'JEE Mains',
    subjects: ['Mathematics', 'Physics', 'Chemistry'],
    defaultBoardSubject: 'Mathematics',
    getSections: () => [
      {
        id: 'jm-math-a',
        label: 'PART I: MATHEMATICS — Section A: Single Correct MCQ (20 Qs · +4 / -1)',
        subject: 'Mathematics',
        count: 20,
        marks: 4,
        negativeMarks: 1,
        questionTypes: ['mcq'],
        patternNote: 'NTA JEE Main Mathematics Section A (2022–2026 PYQ standard): 20 single-correct MCQs.',
      },
      {
        id: 'jm-math-b',
        label: 'PART I: MATHEMATICS — Section B: Numerical Value (5 Qs · +4 / -1)',
        subject: 'Mathematics',
        count: 5,
        marks: 4,
        negativeMarks: 1,
        questionTypes: ['fill_blank'],
        patternNote:
          'NTA JEE Main Mathematics Section B: 5 compulsory numerical-value questions whose answer is an exact integer or terminating decimal (no options).',
      },
      {
        id: 'jm-phy-a',
        label: 'PART II: PHYSICS — Section A: Single Correct MCQ (20 Qs · +4 / -1)',
        subject: 'Physics',
        count: 20,
        marks: 4,
        negativeMarks: 1,
        questionTypes: ['mcq'],
        patternNote: 'NTA JEE Main Physics Section A (2022–2026 PYQ standard): 20 single-correct MCQs.',
      },
      {
        id: 'jm-phy-b',
        label: 'PART II: PHYSICS — Section B: Numerical Value (5 Qs · +4 / -1)',
        subject: 'Physics',
        count: 5,
        marks: 4,
        negativeMarks: 1,
        questionTypes: ['fill_blank'],
        patternNote:
          'NTA JEE Main Physics Section B: 5 compulsory numerical-value questions with exact integer/numerical answers.',
      },
      {
        id: 'jm-chem-a',
        label: 'PART III: CHEMISTRY — Section A: Single Correct MCQ (20 Qs · +4 / -1)',
        subject: 'Chemistry',
        count: 20,
        marks: 4,
        negativeMarks: 1,
        questionTypes: ['mcq'],
        patternNote: 'NTA JEE Main Chemistry Section A (Physical, Organic & Inorganic PYQ standard): 20 single-correct MCQs.',
      },
      {
        id: 'jm-chem-b',
        label: 'PART III: CHEMISTRY — Section B: Numerical Value (5 Qs · +4 / -1)',
        subject: 'Chemistry',
        count: 5,
        marks: 4,
        negativeMarks: 1,
        questionTypes: ['fill_blank'],
        patternNote:
          'NTA JEE Main Chemistry Section B: 5 compulsory numerical-value questions (Physical/Stoichiometry/Equilibrium/Electrochemistry/Isomer count).',
      },
    ],
  },
  {
    id: 'jee_adv_54',
    title: 'JEE Advanced (IIT) — 54 Questions (180 Marks)',
    shortLabel: 'JEE Adv (54 Qs)',
    examHeaderTag: 'JEE Advanced (IIT) · 18 Phy + 18 Chem + 18 Maths (180 Marks)',
    duration: '3 Hours (180 Mins)',
    isMultiSubject: true,
    classLevelLabel: '11 & 12',
    boardOrExam: 'JEE Advanced',
    subjects: ['Physics', 'Chemistry', 'Mathematics'],
    defaultBoardSubject: 'Physics',
    getSections: () => [
      {
        id: 'ja-phy-1',
        label: 'PHYSICS — Section 1: Single Correct MCQ (4 Qs · +3 / -1)',
        subject: 'Physics',
        count: 4,
        marks: 3,
        negativeMarks: 1,
        questionTypes: ['mcq'],
        patternNote: 'IIT-JEE Advanced multi-concept single-correct MCQs (HC Verma / Irodov / Pathfinder level).',
      },
      {
        id: 'ja-phy-2',
        label: 'PHYSICS — Section 2: One or More Than One Correct (4 Qs · +4 / -2)',
        subject: 'Physics',
        count: 4,
        marks: 4,
        negativeMarks: 2,
        questionTypes: ['multiple_correct'],
        patternNote: 'IIT-JEE Advanced Multiple Correct (1 or more options A, B, C, D correct).',
      },
      {
        id: 'ja-phy-3',
        label: 'PHYSICS — Section 3: Non-Negative Integer / Numerical (6 Qs · +4 / 0)',
        subject: 'Physics',
        count: 6,
        marks: 4,
        negativeMarks: 0,
        questionTypes: ['fill_blank'],
        patternNote: 'IIT-JEE Advanced numerical/integer value problems with exact numerical answers.',
      },
      {
        id: 'ja-phy-4',
        label: 'PHYSICS — Section 4: Match the List (4 Qs · +2 / 0)',
        subject: 'Physics',
        count: 4,
        marks: 2,
        negativeMarks: 0,
        questionTypes: ['match_following'],
        patternNote: 'IIT-JEE Advanced Matrix / List-I vs List-II matching questions with 4 options.',
      },
      {
        id: 'ja-chem-1',
        label: 'CHEMISTRY — Section 1: Single Correct MCQ (4 Qs · +3 / -1)',
        subject: 'Chemistry',
        count: 4,
        marks: 3,
        negativeMarks: 1,
        questionTypes: ['mcq'],
        patternNote: 'IIT-JEE Advanced Chemistry single-correct MCQs (MS Chouhan / N Awasthi / JD Lee rigor).',
      },
      {
        id: 'ja-chem-2',
        label: 'CHEMISTRY — Section 2: One or More Than One Correct (4 Qs · +4 / -2)',
        subject: 'Chemistry',
        count: 4,
        marks: 4,
        negativeMarks: 2,
        questionTypes: ['multiple_correct'],
        patternNote: 'IIT-JEE Advanced Multiple Correct Chemistry questions.',
      },
      {
        id: 'ja-chem-3',
        label: 'CHEMISTRY — Section 3: Non-Negative Integer / Numerical (6 Qs · +4 / 0)',
        subject: 'Chemistry',
        count: 6,
        marks: 4,
        negativeMarks: 0,
        questionTypes: ['fill_blank'],
        patternNote: 'IIT-JEE Advanced numerical/integer Chemistry problems.',
      },
      {
        id: 'ja-chem-4',
        label: 'CHEMISTRY — Section 4: Match the List (4 Qs · +2 / 0)',
        subject: 'Chemistry',
        count: 4,
        marks: 2,
        negativeMarks: 0,
        questionTypes: ['match_following'],
        patternNote: 'IIT-JEE Advanced Matrix / List-I vs List-II Chemistry matching questions.',
      },
      {
        id: 'ja-math-1',
        label: 'MATHEMATICS — Section 1: Single Correct MCQ (4 Qs · +3 / -1)',
        subject: 'Mathematics',
        count: 4,
        marks: 3,
        negativeMarks: 1,
        questionTypes: ['mcq'],
        patternNote: 'IIT-JEE Advanced Maths single-correct MCQs (Black Book / Sameer Bansal / Cengage rigor).',
      },
      {
        id: 'ja-math-2',
        label: 'MATHEMATICS — Section 2: One or More Than One Correct (4 Qs · +4 / -2)',
        subject: 'Mathematics',
        count: 4,
        marks: 4,
        negativeMarks: 2,
        questionTypes: ['multiple_correct'],
        patternNote: 'IIT-JEE Advanced Multiple Correct Mathematics questions.',
      },
      {
        id: 'ja-math-3',
        label: 'MATHEMATICS — Section 3: Non-Negative Integer / Numerical (6 Qs · +4 / 0)',
        subject: 'Mathematics',
        count: 6,
        marks: 4,
        negativeMarks: 0,
        questionTypes: ['fill_blank'],
        patternNote: 'IIT-JEE Advanced numerical/integer Mathematics problems.',
      },
      {
        id: 'ja-math-4',
        label: 'MATHEMATICS — Section 4: Match the List (4 Qs · +2 / 0)',
        subject: 'Mathematics',
        count: 4,
        marks: 2,
        negativeMarks: 0,
        questionTypes: ['match_following'],
        patternNote: 'IIT-JEE Advanced Matrix / List-I vs List-II Mathematics matching questions.',
      },
    ],
  },
  {
    id: 'cbse_12_board',
    title: 'CBSE Class 12 Board Sample Paper',
    shortLabel: 'Class 12 CBSE',
    examHeaderTag: 'CBSE Class XII Official Sample Paper Blueprint (Sections A–E)',
    duration: '3 Hours (180 Mins)',
    isMultiSubject: false,
    classLevelLabel: '12',
    boardOrExam: 'Board Exams',
    subjects: ['Physics', 'Chemistry', 'Mathematics', 'Biology'],
    defaultBoardSubject: 'Physics',
    getSections: (boardSubject = 'Physics') => {
      if (boardSubject === 'Mathematics') {
        return [
          {
            id: 'c12m-a-mcq',
            label: 'SECTION A: Multiple Choice Questions (Q1–Q18 · 1 Mark each)',
            subject: 'Mathematics',
            count: 18,
            marks: 1,
            negativeMarks: 0,
            questionTypes: ['mcq'],
            patternNote: 'CBSE Class 12 Maths Sample Paper Section A: 18 competency & PYQ MCQs (1 mark each).',
          },
          {
            id: 'c12m-a-ar',
            label: 'SECTION A: Assertion-Reason Questions (Q19–Q20 · 1 Mark each)',
            subject: 'Mathematics',
            count: 2,
            marks: 1,
            negativeMarks: 0,
            questionTypes: ['assertion_reason'],
            patternNote: 'CBSE Class 12 Maths Section A: 2 Assertion-Reason questions with standard CBSE A-D options.',
          },
          {
            id: 'c12m-b',
            label: 'SECTION B: Very Short Answer Questions (Q21–Q25 · 2 Marks each)',
            subject: 'Mathematics',
            count: 5,
            marks: 2,
            negativeMarks: 0,
            questionTypes: ['subjective'],
            patternNote: 'CBSE Class 12 Maths Section B: 5 VSA 2-mark questions (include OR choice on 2 questions).',
          },
          {
            id: 'c12m-c',
            label: 'SECTION C: Short Answer Questions (Q26–Q31 · 3 Marks each)',
            subject: 'Mathematics',
            count: 6,
            marks: 3,
            negativeMarks: 0,
            questionTypes: ['subjective'],
            patternNote: 'CBSE Class 12 Maths Section C: 6 SA 3-mark questions matching CBSE marking scheme.',
          },
          {
            id: 'c12m-d',
            label: 'SECTION D: Long Answer Questions (Q32–Q35 · 5 Marks each)',
            subject: 'Mathematics',
            count: 4,
            marks: 5,
            negativeMarks: 0,
            questionTypes: ['subjective'],
            patternNote: 'CBSE Class 12 Maths Section D: 4 Long Answer 5-mark proof/application questions.',
          },
          {
            id: 'c12m-e',
            label: 'SECTION E: Case-Study Based Questions (Q36–Q38 · 4 Marks each)',
            subject: 'Mathematics',
            count: 3,
            marks: 4,
            negativeMarks: 0,
            questionTypes: ['subjective'],
            patternNote:
              'CBSE Class 12 Maths Section E: 3 real-world Case-Study passages, each with sub-questions (i), (ii), (iii) totaling 4 marks.',
          },
        ];
      }

      // Physics, Chemistry, Biology (33 Qs, 70 Marks)
      return [
        {
          id: 'c12s-a-mcq',
          label: 'SECTION A: Multiple Choice Questions (Q1–Q12 · 1 Mark each)',
          subject: boardSubject,
          count: 12,
          marks: 1,
          negativeMarks: 0,
          questionTypes: ['mcq'],
          patternNote: `CBSE Class 12 ${boardSubject} Sample Paper Section A: 12 NCERT/competency MCQs (1 mark each).`,
        },
        {
          id: 'c12s-a-ar',
          label: 'SECTION A: Assertion-Reason Questions (Q13–Q16 · 1 Mark each)',
          subject: boardSubject,
          count: 4,
          marks: 1,
          negativeMarks: 0,
          questionTypes: ['assertion_reason'],
          patternNote: `CBSE Class 12 ${boardSubject} Section A: 4 Assertion-Reason questions with standard CBSE A-D options.`,
        },
        {
          id: 'c12s-b',
          label: 'SECTION B: Very Short Answer Questions (Q17–Q21 · 2 Marks each)',
          subject: boardSubject,
          count: 5,
          marks: 2,
          negativeMarks: 0,
          questionTypes: ['subjective'],
          patternNote: `CBSE Class 12 ${boardSubject} Section B: 5 VSA 2-mark questions.`,
        },
        {
          id: 'c12s-c',
          label: 'SECTION C: Short Answer Questions (Q22–Q28 · 3 Marks each)',
          subject: boardSubject,
          count: 7,
          marks: 3,
          negativeMarks: 0,
          questionTypes: ['subjective'],
          patternNote: `CBSE Class 12 ${boardSubject} Section C: 7 SA 3-mark questions matching CBSE marking scheme.`,
        },
        {
          id: 'c12s-d',
          label: 'SECTION D: Case-Study Based Questions (Q29–Q30 · 4 Marks each)',
          subject: boardSubject,
          count: 2,
          marks: 4,
          negativeMarks: 0,
          questionTypes: ['subjective'],
          patternNote: `CBSE Class 12 ${boardSubject} Section D: 2 Case-Study passages with sub-questions (i), (ii), (iii) totaling 4 marks.`,
        },
        {
          id: 'c12s-e',
          label: 'SECTION E: Long Answer Questions (Q31–Q33 · 5 Marks each)',
          subject: boardSubject,
          count: 3,
          marks: 5,
          negativeMarks: 0,
          questionTypes: ['subjective'],
          patternNote: `CBSE Class 12 ${boardSubject} Section E: 3 Long Answer 5-mark derivation/application questions.`,
        },
      ];
    },
  },
  {
    id: 'cbse_10_board',
    title: 'CBSE Class 10 Board Sample Paper',
    shortLabel: 'Class 10 CBSE',
    examHeaderTag: 'CBSE Class X Official Sample Paper Blueprint (80 Marks · Sections A–E)',
    duration: '3 Hours (180 Mins)',
    isMultiSubject: false,
    classLevelLabel: '10',
    boardOrExam: 'CBSE',
    subjects: ['Science (Combined)', 'Mathematics', 'Social Science (Combined)', 'English', 'Hindi'],
    defaultBoardSubject: 'Science (Combined)',
    getSections: (boardSubject = 'Science (Combined)') => {
      if (boardSubject === 'Mathematics') {
        return [
          {
            id: 'c10m-a-mcq',
            label: 'SECTION A: Multiple Choice Questions (Q1–Q18 · 1 Mark each)',
            subject: 'Mathematics',
            count: 18,
            marks: 1,
            negativeMarks: 0,
            questionTypes: ['mcq'],
            patternNote: 'CBSE Class 10 Maths Standard Sample Paper Section A: 18 MCQs (1 mark each).',
          },
          {
            id: 'c10m-a-ar',
            label: 'SECTION A: Assertion-Reason Questions (Q19–Q20 · 1 Mark each)',
            subject: 'Mathematics',
            count: 2,
            marks: 1,
            negativeMarks: 0,
            questionTypes: ['assertion_reason'],
            patternNote: 'CBSE Class 10 Maths Section A: 2 Assertion-Reason questions.',
          },
          {
            id: 'c10m-b',
            label: 'SECTION B: Very Short Answer Questions (Q21–Q25 · 2 Marks each)',
            subject: 'Mathematics',
            count: 5,
            marks: 2,
            negativeMarks: 0,
            questionTypes: ['subjective'],
            patternNote: 'CBSE Class 10 Maths Section B: 5 VSA 2-mark questions.',
          },
          {
            id: 'c10m-c',
            label: 'SECTION C: Short Answer Questions (Q26–Q31 · 3 Marks each)',
            subject: 'Mathematics',
            count: 6,
            marks: 3,
            negativeMarks: 0,
            questionTypes: ['subjective'],
            patternNote: 'CBSE Class 10 Maths Section C: 6 SA 3-mark questions.',
          },
          {
            id: 'c10m-d',
            label: 'SECTION D: Long Answer Questions (Q32–Q35 · 5 Marks each)',
            subject: 'Mathematics',
            count: 4,
            marks: 5,
            negativeMarks: 0,
            questionTypes: ['subjective'],
            patternNote: 'CBSE Class 10 Maths Section D: 4 Long Answer 5-mark proof/word problems.',
          },
          {
            id: 'c10m-e',
            label: 'SECTION E: Case-Study Based Questions (Q36–Q38 · 4 Marks each)',
            subject: 'Mathematics',
            count: 3,
            marks: 4,
            negativeMarks: 0,
            questionTypes: ['subjective'],
            patternNote: 'CBSE Class 10 Maths Section E: 3 Case-Study questions with sub-parts (i), (ii), (iii).',
          },
        ];
      }

      if (boardSubject === 'Science (Combined)') {
        return [
          {
            id: 'c10s-a-mcq',
            label: 'SECTION A: Objective MCQs (Q1–Q16 · 1 Mark each)',
            subject: 'Science (Combined)',
            count: 16,
            marks: 1,
            negativeMarks: 0,
            questionTypes: ['mcq'],
            patternNote:
              'CBSE Class 10 Science Section A: 16 competency/NCERT MCQs balanced across Physics, Chemistry & Biology.',
          },
          {
            id: 'c10s-a-ar',
            label: 'SECTION A: Assertion-Reason Questions (Q17–Q20 · 1 Mark each)',
            subject: 'Science (Combined)',
            count: 4,
            marks: 1,
            negativeMarks: 0,
            questionTypes: ['assertion_reason'],
            patternNote: 'CBSE Class 10 Science Section A: 4 Assertion-Reason questions.',
          },
          {
            id: 'c10s-b',
            label: 'SECTION B: Very Short Answer Questions (Q21–Q26 · 2 Marks each)',
            subject: 'Science (Combined)',
            count: 6,
            marks: 2,
            negativeMarks: 0,
            questionTypes: ['subjective'],
            patternNote: 'CBSE Class 10 Science Section B: 6 VSA 2-mark questions.',
          },
          {
            id: 'c10s-c',
            label: 'SECTION C: Short Answer Questions (Q27–Q33 · 3 Marks each)',
            subject: 'Science (Combined)',
            count: 7,
            marks: 3,
            negativeMarks: 0,
            questionTypes: ['subjective'],
            patternNote: 'CBSE Class 10 Science Section C: 7 SA 3-mark questions.',
          },
          {
            id: 'c10s-d',
            label: 'SECTION D: Long Answer Questions (Q34–Q36 · 5 Marks each)',
            subject: 'Science (Combined)',
            count: 3,
            marks: 5,
            negativeMarks: 0,
            questionTypes: ['subjective'],
            patternNote: 'CBSE Class 10 Science Section D: 3 Long Answer 5-mark questions (1 Bio, 1 Chem, 1 Phy).',
          },
          {
            id: 'c10s-e',
            label: 'SECTION E: Case-Based / Source-Based Questions (Q37–Q39 · 4 Marks each)',
            subject: 'Science (Combined)',
            count: 3,
            marks: 4,
            negativeMarks: 0,
            questionTypes: ['subjective'],
            patternNote: 'CBSE Class 10 Science Section E: 3 Case-Study questions (1 Phy, 1 Chem, 1 Bio) with sub-parts.',
          },
        ];
      }

      // Social Science / English / Hindi (37 Qs, 80 Marks)
      return [
        {
          id: 'c10g-a',
          label: 'SECTION A: Multiple Choice & Objective Questions (Q1–Q20 · 1 Mark each)',
          subject: boardSubject,
          count: 20,
          marks: 1,
          negativeMarks: 0,
          questionTypes: ['mcq', 'assertion_reason'],
          patternNote: `CBSE Class 10 ${boardSubject} Section A: 20 competency MCQs & Assertion-Reason questions.`,
        },
        {
          id: 'c10g-b',
          label: 'SECTION B: Very Short Answer Questions (Q21–Q24 · 2 Marks each)',
          subject: boardSubject,
          count: 4,
          marks: 2,
          negativeMarks: 0,
          questionTypes: ['subjective'],
          patternNote: `CBSE Class 10 ${boardSubject} Section B: 4 VSA 2-mark questions.`,
        },
        {
          id: 'c10g-c',
          label: 'SECTION C: Short Answer Questions (Q25–Q29 · 3 Marks each)',
          subject: boardSubject,
          count: 5,
          marks: 3,
          negativeMarks: 0,
          questionTypes: ['subjective'],
          patternNote: `CBSE Class 10 ${boardSubject} Section C: 5 SA 3-mark questions.`,
        },
        {
          id: 'c10g-d',
          label: 'SECTION D: Long Answer Questions (Q30–Q33 · 5 Marks each)',
          subject: boardSubject,
          count: 4,
          marks: 5,
          negativeMarks: 0,
          questionTypes: ['subjective'],
          patternNote: `CBSE Class 10 ${boardSubject} Section D: 4 Long Answer 5-mark questions.`,
        },
        {
          id: 'c10g-e',
          label: 'SECTION E: Case-Based / Passage Questions (Q34–Q36 · 4 Marks each)',
          subject: boardSubject,
          count: 3,
          marks: 4,
          negativeMarks: 0,
          questionTypes: ['subjective'],
          patternNote: `CBSE Class 10 ${boardSubject} Section E: 3 Source/Case-Based questions with sub-parts.`,
        },
        {
          id: 'c10g-f',
          label: 'SECTION F: Map / Skill / Extended Question (Q37 · 5 Marks)',
          subject: boardSubject,
          count: 1,
          marks: 5,
          negativeMarks: 0,
          questionTypes: ['subjective'],
          patternNote: `CBSE Class 10 ${boardSubject} Section F: 1 comprehensive 5-mark skill/map/analytical question.`,
        },
      ];
    },
  },
];

export function getSamplePaperBlueprint(examId?: SamplePaperExamId): SamplePaperBlueprint {
  return (
    SAMPLE_PAPER_BLUEPRINTS.find((b) => b.id === examId) || SAMPLE_PAPER_BLUEPRINTS[0]
  );
}

export function getBlueprintStats(blueprint: SamplePaperBlueprint, boardSubject?: string) {
  const sections = blueprint.getSections(boardSubject);
  const totalQuestions = sections.reduce((sum, s) => sum + s.count, 0);
  const totalMarks = sections.reduce((sum, s) => sum + s.count * s.marks, 0);
  return { sections, totalQuestions, totalMarks };
}

export function getSamplePaperChaptersPool(
  examId: SamplePaperExamId,
  boardSubject?: string,
): SamplePoolChapter[] {
  const bp = getSamplePaperBlueprint(examId);

  if (examId === 'cbse_10_board') {
    const subj = boardSubject && bp.subjects.includes(boardSubject) ? boardSubject : bp.defaultBoardSubject;
    return getSyllabusChapters('10', subj, 'CBSE').map((entry) => ({
      subject: subj,
      classLevel: '10',
      chapter: entry.chapter,
      topics: entry.topics,
    }));
  }

  if (examId === 'cbse_12_board') {
    const subj = boardSubject && bp.subjects.includes(boardSubject) ? boardSubject : bp.defaultBoardSubject;
    return getSyllabusChapters('12', subj, 'Board Exams').map((entry) => ({
      subject: subj,
      classLevel: '12',
      chapter: entry.chapter,
      topics: entry.topics,
    }));
  }

  // Multi-subject NEET / JEE Main / JEE Advanced -> combine Class 11 + Class 12 chapters
  const pool: SamplePoolChapter[] = [];
  for (const subj of bp.subjects) {
    for (const cls of ['11', '12'] as ClassLevel[]) {
      const entries = getSyllabusChapters(cls, subj, bp.boardOrExam);
      for (const entry of entries) {
        pool.push({
          subject: subj,
          classLevel: cls,
          chapter: entry.chapter,
          topics: entry.topics,
        });
      }
    }
  }
  return pool;
}

export function getSubjectTotalQuota(
  sections: SamplePaperSectionSpec[],
  subject: string,
): number {
  return sections
    .filter((s) => s.subject === subject)
    .reduce((sum, s) => sum + s.count, 0);
}

export function computeEqualSubjectCounts(
  totalSubjectQs: number,
  chapterCount: number,
): number[] {
  if (chapterCount <= 0 || totalSubjectQs <= 0) return [];
  const base = Math.floor(totalSubjectQs / chapterCount);
  const rem = totalSubjectQs % chapterCount;
  return Array.from({ length: chapterCount }, (_, idx) => base + (idx < rem ? 1 : 0));
}

export function buildBalancedChapterSlots(
  chapters: SamplePoolChapter[],
  counts: number[],
  targetTotal: number,
): SamplePoolChapter[] {
  if (chapters.length === 0 || targetTotal <= 0) return [];
  const safeCounts = counts.map((c) => Math.max(0, Math.round(c)));
  const active = chapters
    .map((ch, idx) => ({ ch, target: safeCounts[idx] || 0 }))
    .filter((item) => item.target > 0);

  if (active.length === 0) {
    const eq = computeEqualSubjectCounts(targetTotal, chapters.length);
    return buildBalancedChapterSlots(chapters, eq, targetTotal);
  }

  // Smooth deficit-weighted interleaving so exact per-chapter counts are preserved & spread across sections
  const remaining = active.map((a) => a.target);
  const slots: SamplePoolChapter[] = [];
  for (let step = 0; step < targetTotal; step++) {
    let bestIdx = -1;
    let bestRatio = -1;
    for (let i = 0; i < active.length; i++) {
      if (remaining[i] <= 0) continue;
      const ratio = remaining[i] / active[i].target;
      if (ratio > bestRatio) {
        bestRatio = ratio;
        bestIdx = i;
      }
    }
    if (bestIdx === -1) break;
    slots.push(active[bestIdx].ch);
    remaining[bestIdx] -= 1;
  }

  // Safety pad if targetTotal > sum(active)
  let padCursor = 0;
  while (slots.length < targetTotal) {
    slots.push(active[padCursor % active.length].ch);
    padCursor++;
  }
  return slots;
}

