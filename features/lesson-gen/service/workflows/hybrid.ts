import { LessonInput, Lesson } from '../types';
import { preprocessText } from '@/utils/textProcessing/preprocessor/textCleaner';
import { splitIntoSentences, filterSentences } from '@/utils/textProcessing/preprocessor/sentenceSplitter';
import { chunkText } from '@/utils/textProcessing/chunking/semanticChunker';
import {
  generateLessonSummary,
  generateLearningObjectives,
  generateExercises
} from '@/features/lesson-gen/ai/lessonAI';

export async function generateLessonsHybrid(input: LessonInput): Promise<Lesson[]> {
  // 1. Preprocess and clean the text
  const { cleaned } = preprocessText(input.content);

  // 2. Split into sentences and filter
  const sentences = splitIntoSentences(cleaned);
  const filteredSentences = filterSentences(sentences);

  // 3. Chunk the sentences using local semantic chunking
  const chunkingResult = chunkText(filteredSentences, 'semantic', {
    maxChunkSize: 300,
    minChunkSize: 100,
  });

  // 4. For each chunk, use LLM to enrich (summary, objectives, exercises)
  const lessons: Lesson[] = [];
  for (let i = 0; i < chunkingResult.chunks.length; i++) {
    const chunk = chunkingResult.chunks[i];
    const chunkContent = chunk.sentences.map(s => s.text).join(' ');

    // Title is local
    const title = chunk.topic ? `Lesson ${i + 1}: ${chunk.topic}` : `Lesson ${i + 1}`;

    // Content is local
    const content = chunkContent;

    // LLM summary
    let summary = chunk.summary;
    try {
      summary = await generateLessonSummary(content);
    } catch {}

    // LLM objectives
    let objectives: string[] = [`Understand ${chunk.topic}`];
    try {
      objectives = await generateLearningObjectives(content);
    } catch {}

    // LLM exercises
    let exercises: string[] = [];
    try {
      exercises = await generateExercises(content, chunk.complexity);
    } catch {}

    lessons.push({
      title,
      content,
      summary,
      objectives,
      resources: [],
      ...(exercises.length > 0 ? { exercises } : {}),
    });
  }

  return lessons;
}