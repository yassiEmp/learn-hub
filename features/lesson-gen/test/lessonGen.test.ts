import { generateLessons } from '../service';
import { LessonInput } from '../service/types';

describe('Lesson Generation Service', () => {
  const baseInput: LessonInput = {
    content: 'Test content for lesson generation.',
    workflow: 'cheap',
  };

  it('should generate lessons for cheap workflow', async () => {
    const lessons = await generateLessons({ ...baseInput, workflow: 'cheap' });
    expect(Array.isArray(lessons)).toBe(true);
    expect(lessons[0]).toHaveProperty('title');
  });

  it('should generate lessons for premium workflow', async () => {
    const lessons = await generateLessons({ ...baseInput, workflow: 'premium' });
    expect(Array.isArray(lessons)).toBe(true);
    expect(lessons[0]).toHaveProperty('title');
  });

  it('should generate lessons for hybrid workflow', async () => {
    const lessons = await generateLessons({ ...baseInput, workflow: 'hybrid' });
    expect(Array.isArray(lessons)).toBe(true);
    expect(lessons[0]).toHaveProperty('title');
  });
}); 