export type LessonWorkflow = 'cheap' | 'premium' | 'hybrid';

export interface LessonInput {
  content: string;
  workflow: LessonWorkflow;
  lessonTitles: string[];
  metadata?: {
    subject?: string;
    language?: string;
    audienceLevel?: string;
    tags?: string[];
  };
  lessonCount?: number;
  enrich?: boolean;
}

export interface Lesson {
  title: string;
  content: string;
  summary?: string;
  objectives?: string[];
  resources?: string[];
}

export type Result<T> = { err: null; res: T } | { err: unknown; res: null };

export async function generateLessons(input: LessonInput): Promise<Result<Lesson[]>> {
  // Implementation will be provided in service/index.ts
  console.log(input)
  return { err: new Error('Not implemented'), res: null };
} 