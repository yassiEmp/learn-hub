export type LessonWorkflow = 'cheap' | 'premium' | 'hybrid';

export interface LessonInput {
  content: string;
  workflow: LessonWorkflow;
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

export async function generateLessons(input: LessonInput): Promise<Lesson[]> {
  // Implementation will be provided in service/index.ts
  console.log(input)
  throw new Error('Not implemented');
} 