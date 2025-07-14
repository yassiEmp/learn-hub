import { NextApiRequest, NextApiResponse } from 'next';
import { generateLessons } from '../service';
import { LessonInput } from '../service/types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    const input: LessonInput = req.body;
    const lessons = await generateLessons(input);
    return res.status(200).json(lessons);
  } catch (error) {
    return res.status(500).json({ error: (error as {message: string})?.message || 'Internal server error' });
  }
} 