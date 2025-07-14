import { LessonInput, Lesson } from './types';
import { generateLessonsCheap } from './workflows/cheap';
import { generateLessonsPremium } from './workflows/premium';
import { generateLessonsHybrid } from './workflows/hybrid';

export async function generateLessons(input: LessonInput): Promise<Lesson[]> {
  switch (input.workflow) {
    case 'cheap':
      return generateLessonsCheap(input);
    case 'premium':
      return generateLessonsPremium(input);
    case 'hybrid':
      return generateLessonsHybrid(input);
    default:
      throw new Error(`Unknown workflow: ${input.workflow}`);
  }
} 