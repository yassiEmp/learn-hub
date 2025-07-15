export type Result<T> = { err: null; res: T } | { err: unknown; res: null };

export async function generateExercises(content: string): Promise<Result<string[]>> {
  // TODO: Implement exercise generation logic
  console.log(content)
  return { err: null, res: ['Stub exercise'] };
} 