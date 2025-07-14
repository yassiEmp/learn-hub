import { LessonInput, Lesson } from '../types';
import { preprocessText } from '@/utils/textProcessing/preprocessor/textCleaner';
import { splitIntoSentences, filterSentences } from '@/utils/textProcessing/preprocessor/sentenceSplitter';
import { chunkText } from '@/utils/textProcessing/chunking/semanticChunker';
import { aiClient } from '@/utils/ai/aiClient';

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
    let title = chunk.topic ? `Lesson ${i + 1}: ${chunk.topic}` : `Lesson ${i + 1}`;

    // Content is local
    let content = chunkContent;

    // LLM summary
    let summary = chunk.summary;
    const summaryResponse = await aiClient.generateLessonSummary(content);
    if (summaryResponse && (summaryResponse as any).success && (summaryResponse as any).data) {
      summary = (summaryResponse as any).data as string;
    }

    // LLM objectives
    let objectives: string[] = [`Understand ${chunk.topic}`];
    const objectivesResponse = await aiClient.generateLearningObjectives(content);
    if (objectivesResponse && (objectivesResponse as any).success && (objectivesResponse as any).data) {
      try {
        const parsed = JSON.parse((objectivesResponse as any).data as string);
        if (Array.isArray(parsed)) objectives = parsed;
      } catch {}
    }

    // LLM exercises
    let exercises: string[] = [];
    const exercisesResponse = await aiClient.generateExercises(content, chunk.complexity);
    if (exercisesResponse && (exercisesResponse as any).success && (exercisesResponse as any).data) {
      try {
        const parsed = JSON.parse((exercisesResponse as any).data as string);
        if (Array.isArray(parsed)) exercises = parsed;
      } catch {}
    }

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