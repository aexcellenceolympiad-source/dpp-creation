import { ClassLevel } from '../types/dpp';
import {
  CLASS_11_BIOLOGY_BASE,
  CLASS_11_CHEMISTRY_BASE,
  CLASS_11_CHEMISTRY_JEE_ADV_EXTRAS,
  CLASS_11_MATHS_BASE,
  CLASS_11_PHYSICS_BASE,
  CLASS_12_BIOLOGY_BASE,
  CLASS_12_CHEMISTRY_BASE,
  CLASS_12_CHEMISTRY_EXTRA,
  CLASS_12_CHEMISTRY_JEE_ADV_EXTRAS,
  CLASS_12_MATHS_BASE,
  CLASS_12_PHYSICS_BASE,
} from './seniorSyllabus';
import { JUNIOR_CATALOG, JUNIOR_HUMANITIES_AND_CS } from './juniorSyllabus';

export interface ChapterEntry {
  chapter: string;
  topics: string[];
}

function filterTopicsForExam(chapters: ChapterEntry[], exam: string): ChapterEntry[] {
  if (exam === 'Board Exams') {
    return chapters
      .filter((c) => !c.chapter.includes('(JEE Mains / NEET)') && !c.chapter.includes('(JEE / NEET)'))
      .map((c) => ({
        ...c,
        topics: c.topics.filter(
          (t) => !t.includes('(JEE') && !t.includes('(NEET'),
        ),
      }))
      .filter((c) => c.topics.length > 0);
  }

  if (exam === 'NEET') {
    return chapters
      .map((c) => ({
        ...c,
        topics: c.topics.filter((t) => !t.includes('(JEE)') && !t.includes('(JEE Adv)')),
      }))
      .filter((c) => c.topics.length > 0);
  }

  if (exam === 'JEE Mains') {
    return chapters
      .map((c) => ({
        ...c,
        topics: c.topics.filter((t) => !t.includes('(JEE Adv)') && !t.includes('(NEET)')),
      }))
      .filter((c) => c.topics.length > 0);
  }

  // JEE Advanced gets full depth (minus NEET-only biology/experimental tags if any)
  return chapters
    .filter((c) => !c.chapter.includes('Experimental Physics Skills (JEE Mains / NEET)'))
    .map((c) => ({
      ...c,
      topics: c.topics.filter((t) => !t.includes('(NEET)')),
    }))
    .filter((c) => c.topics.length > 0);
}

export function getSyllabusChapters(
  classLevel: ClassLevel,
  subject: string,
  boardOrExam?: string,
): ChapterEntry[] {
  const clsNum = parseInt(classLevel, 10);

  // Classes 7–10 (CBSE, JAC, ICSE)
  if (clsNum <= 10) {
    const boardKey = boardOrExam === 'ICSE' ? 'ICSE' : 'CBSE';
    const classData =
      JUNIOR_CATALOG[classLevel]?.[boardKey]?.[subject] ||
      JUNIOR_CATALOG[classLevel]?.CBSE?.[subject];
    if (classData && classData.length > 0) {
      return classData;
    }
    const humanities =
      JUNIOR_HUMANITIES_AND_CS[subject]?.[boardKey] ||
      JUNIOR_HUMANITIES_AND_CS[subject]?.CBSE;
    if (humanities && humanities.length > 0) {
      return humanities;
    }
    return [];
  }

  // Classes 11–12 (Board Exams, JEE Mains, NEET, JEE Advanced)
  const exam = boardOrExam || 'JEE Mains';

  if (subject === 'Physics') {
    const base = classLevel === '11' ? CLASS_11_PHYSICS_BASE : CLASS_12_PHYSICS_BASE;
    return filterTopicsForExam(base, exam);
  }

  if (subject === 'Chemistry') {
    if (classLevel === '11') {
      if (exam === 'JEE Advanced') {
        return filterTopicsForExam(
          [...CLASS_11_CHEMISTRY_BASE, ...CLASS_11_CHEMISTRY_JEE_ADV_EXTRAS],
          exam,
        );
      }
      return filterTopicsForExam(CLASS_11_CHEMISTRY_BASE, exam);
    }

    // Class 12 Chemistry
    if (exam === 'JEE Advanced') {
      return filterTopicsForExam(
        [
          ...CLASS_12_CHEMISTRY_BASE,
          ...CLASS_12_CHEMISTRY_EXTRA,
          ...CLASS_12_CHEMISTRY_JEE_ADV_EXTRAS,
        ],
        exam,
      );
    }
    if (exam === 'JEE Mains' || exam === 'NEET') {
      return filterTopicsForExam(
        [...CLASS_12_CHEMISTRY_BASE, ...CLASS_12_CHEMISTRY_EXTRA],
        exam,
      );
    }
    return filterTopicsForExam(CLASS_12_CHEMISTRY_BASE, exam);
  }

  if (subject === 'Mathematics') {
    const base = classLevel === '11' ? CLASS_11_MATHS_BASE : CLASS_12_MATHS_BASE;
    const filtered = filterTopicsForExam(base, exam);
    if (exam === 'JEE Advanced' || exam === 'JEE Mains') {
      return filtered.filter((c) => c.chapter !== 'Linear Programming');
    }
    return filtered;
  }

  if (subject === 'Biology') {
    const base = classLevel === '11' ? CLASS_11_BIOLOGY_BASE : CLASS_12_BIOLOGY_BASE;
    if (exam === 'Board Exams') {
      return base.map((c) => ({
        ...c,
        topics: c.topics.filter((t) => !t.includes('(NEET)')),
      }));
    }
    return base;
  }

  return [];
}
