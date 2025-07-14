import { LessonInput, Lesson } from '../types';
// Import local text processing utilities from chunkAI
import { preprocessText } from '../../../course/utils/chunkAI/preprocessor/textCleaner';
import { splitIntoSentences, filterSentences } from '../../../course/utils/chunkAI/preprocessor/sentenceSplitter';
import { chunkText } from '../../../course/utils/chunkAI/chunking/semanticChunker';

export async function generateLessonsCheap(input: LessonInput): Promise<Lesson[]> {
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

  // 4. Map each chunk to a lesson
  const lessons: Lesson[] = chunkingResult.chunks.map((chunk, i) => ({
    title: chunk.topic ? `Lesson ${i + 1}: ${chunk.topic}` : `Lesson ${i + 1}`,
    content: chunk.sentences.map(s => s.text).join(' '),
    summary: chunk.summary,
    objectives: [`Understand ${chunk.topic}`],
    resources: [],
  }));

  return lessons;
} 