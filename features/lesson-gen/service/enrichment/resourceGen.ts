export type Result<T> = { err: null; res: T } | { err: unknown; res: null };

export async function suggestResources(content: string): Promise<Result<string[]>> {
  // TODO: Implement resource suggestion logic
  console.log(content)
  return { err: null, res: ['Stub resource'] };
} 