export type Result<T> = { err: null; res: T } | { err: unknown; res: null };

export async function summarizeLesson(content: string): Promise<Result<string>> {
  // TODO: Implement summary generation logic
  console.log(content)
  return { err: null, res: 'Stub summary' };
} 