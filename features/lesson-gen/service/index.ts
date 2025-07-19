import { LessonInput, Lesson } from './types';
import { generateLessonsCheap } from './workflows/cheap';
import { generateLessonsPremium } from './workflows/premium';
import { generateLessonsHybrid } from './workflows/hybrid';

export type Result<T> = { err: null; res: T } | { err: unknown; res: null };

export async function* generateLessons(input: LessonInput): AsyncGenerator<Result<Lesson>, void, unknown> {
  switch (input.workflow) {
    case 'cheap': {
      console.log("executing cheap workflow");
      const result = await generateLessonsCheap(input);
      for (const lesson of result) {
        yield { err: null, res: lesson };
      }
      break;
    }
    case 'premium': {
      console.log("executing premium workflow");
      for await (const result of generateLessonsPremium(input)) {
        if (result.err) {
          console.error("Lesson generation error:", result.err);
          continue;
        }
        yield result;
      }
      break;
    }
    case 'hybrid': {
      console.log("executing hybrid workflow");
      const result = await generateLessonsHybrid(input);
      for (const lesson of result) {
        yield { err: null, res: lesson };
      }
      break;
    }
    default:
      yield { err: new Error(`Unknown workflow: ${input.workflow}`), res: null };
  }
} 