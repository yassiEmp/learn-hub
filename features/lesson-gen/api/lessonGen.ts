import { NextApiRequest, NextApiResponse } from 'next';
import { generateLessons } from '../service';
import { LessonInput } from '../service/types';

export type Result<T> = { err: null; res: T } | { err: unknown; res: null };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const input: LessonInput = req.body;
  const result = await generateLessons(input);
  if (result.err) {
    return res.status(500).json({ error: (result.err as {message?: string})?.message || 'Internal server error' });
  }
  return res.status(200).json(result.res);
} 