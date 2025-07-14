import { LessonInput, Lesson } from '../types';

export async function heuristicFallback(input: LessonInput): Promise<Lesson[]> {
  // TODO: Implement heuristic fallback logic
  return [{
    title: 'Heuristic Fallback Lesson',
    content: input.content,
    summary: 'Heuristic summary',
    objectives: ['Heuristic objective'],
    resources: []
  }];
} 