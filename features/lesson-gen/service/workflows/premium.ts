import { LessonInput, Lesson } from '../types';
import { preprocessText } from '../../../course/utils/chunkAI/preprocessor/textCleaner';
import { splitIntoSentences, filterSentences } from '../../../course/utils/chunkAI/preprocessor/sentenceSplitter';
import { chunkText } from '../../../course/utils/chunkAI/chunking/semanticChunker';
import { aiClient } from '../../../course/utils/chunkAI/ai/aiClient';

export async function generateLessonsPremium(input: LessonInput): Promise<Lesson[]> {
  // 1. Preprocess and clean the text
  const { cleaned } = preprocessText(input.content);

  // 2. Split into sentences and filter
  const sentences = splitIntoSentences(cleaned);
  const filteredSentences = filterSentences(sentences);

  // 3. Chunk the sentences using semantic chunking
  const chunkingResult = chunkText(filteredSentences, 'semantic', {
    maxChunkSize: 300,
    minChunkSize: 100,
  });

  // 4. For each chunk, use LLM to generate enhanced lesson content
  const lessons: Lesson[] = [];
  for (let i = 0; i < chunkingResult.chunks.length; i++) {
    const chunk = chunkingResult.chunks[i];
    const chunkContent = chunk.sentences.map(s => s.text).join(' ');

    // Generate lesson title
    let title = `Lesson ${i + 1}: ${chunk.topic}`;
    const titleResponse = await aiClient.generateLessonTitle(chunkContent, i + 1);
    if (titleResponse && (titleResponse as any).success && (titleResponse as any).data) {
      title = (titleResponse as any).data as string;
    }

    // Enhance lesson content
    let content = chunkContent;
    const enhancedResponse = await aiClient.enhanceLessonContent(chunkContent);
    if (enhancedResponse && (enhancedResponse as any).success && (enhancedResponse as any).data) {
      content = (enhancedResponse as any).data as string;
    }

    // Generate summary
    let summary = chunk.summary;
    const summaryResponse = await aiClient.generateLessonSummary(content);
    if (summaryResponse && (summaryResponse as any).success && (summaryResponse as any).data) {
      summary = (summaryResponse as any).data as string;
    }

    // Generate objectives
    let objectives: string[] = [`Understand ${chunk.topic}`];
    const objectivesResponse = await aiClient.generateLearningObjectives(content);
    if (objectivesResponse && (objectivesResponse as any).success && (objectivesResponse as any).data) {
      try {
        const parsed = JSON.parse((objectivesResponse as any).data as string);
        if (Array.isArray(parsed)) objectives = parsed;
      } catch {}
    }

    // Generate exercises
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