import { LessonInput, Lesson } from '../types';

export async function localLLMFallback(input: LessonInput): Promise<Lesson[]> {
  // TODO: Implement local LLM fallback logic
  return [{
    title: 'Local LLM Fallback Lesson',
    content: input.content,
    summary: 'Local LLM summary',
    objectives: ['Local LLM objective'],
    resources: []
  }];
} 