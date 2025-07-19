// ============================================================================
// Enhanced Chunk AI System - Main Entry Point
// ============================================================================

import { 
  ProcessingResult, 
  ProcessingOptions, 
  Lesson, 
  SemanticChunk
} from './types';
import { AIClient, Result, CourseMetadata } from './ai/aiClient';
import { preprocessText } from './preprocessor/textCleaner';
import { splitIntoSentences, filterSentences } from './preprocessor/sentenceSplitter';
import { chunkText } from './chunking/semanticChunker';

/**
 * Default processing options
 */
const DEFAULT_OPTIONS: ProcessingOptions = {
  maxChunkSize: 300,
  minChunkSize: 100,
  overlapPercentage: 10,
  enableEnhancement: true,
  enableProgression: true,
  targetLessonCount: 5,
  difficulty: 'intermediate'
};

/**
 * Enhanced Chunk AI System
 * Transforms raw text into structured course content using AI
 */
export class EnhancedChunkAI {
  private options: ProcessingOptions;

  constructor(options: Partial<ProcessingOptions> = {}) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
  }

  /**
   * Main processing function - transforms text into course content
   */
  async processText(text: string): Promise<Result<ProcessingResult>> {
    const startTime = Date.now();
    const errors: string[] = [];
    let aiCalls = 0;
    const aiClient = new AIClient({ apiKey: process.env.GOOGLE_API_KEY! });

    try {
      console.log('🚀 Starting Enhanced Chunk AI processing...');
      
      // Step 1: Preprocess text
      console.log('📝 Step 1: Preprocessing text...');
      const { cleaned } = preprocessText(text);

      // log the analysis and metadata 
      // TODO: remove console.log and add this to analitics or a database
      console.log('🔍 Analysis:', {});
      console.log('📊 Metadata:', {});

      if (cleaned.length < 50) {
        throw new Error('Text is too short to process effectively');
      }

      // Step 2: Split into sentences
      console.log('🔤 Step 2: Splitting into sentences...');
      const sentences = splitIntoSentences(cleaned);
      const filteredSentences = filterSentences(sentences);
      
      if (filteredSentences.length === 0) {
        throw new Error('No valid sentences found after filtering');
      }

      // Step 3: Create semantic chunks
      console.log('🧩 Step 3: Creating semantic chunks...');
      const chunkingResult = chunkText(filteredSentences, 'semantic', {
        maxChunkSize: this.options.maxChunkSize,
        minChunkSize: this.options.minChunkSize
      });

      if (chunkingResult.chunks.length === 0) {
        throw new Error('No chunks created from text');
      }

      // Step 4: Generate course metadata
      console.log('🎯 Step 4: Generating course metadata...');
      const courseContent = chunkingResult.chunks
        .map(chunk => chunk.summary)
        .join(' ');
      
      const metadataResponse = await aiClient.generateCourseMetadata(courseContent);
      aiCalls++;
      
      if (metadataResponse.err || !metadataResponse.res) {
        errors.push(metadataResponse.err instanceof Error ? metadataResponse.err.message : String(metadataResponse.err));
        return { err: metadataResponse.err, res: null };
      }
      const courseMetadata = metadataResponse.res as CourseMetadata;
      const courseTitle = courseMetadata.title || 'Generated Course';
      const courseDescription = courseMetadata.description || 'A comprehensive course based on the provided content.';
      
      // Step 5: Generate lessons from chunks
      console.log('📚 Step 5: Generating lessons...');
      const lessons = await this.generateLessonsFromChunks(chunkingResult.chunks);
      aiCalls += lessons.length * 3; // Each lesson requires multiple AI calls

      // Step 6: Create lesson progression
      console.log('🔄 Step 6: Creating lesson progression...');
      const finalLessons = this.options.enableProgression ? 
        this.createLessonProgression(lessons) : lessons;

      console.log('✅ Enhanced Chunk AI processing completed successfully!');
      console.log(`📊 Results: ${finalLessons.length} lessons, ${Date.now() - startTime}ms processing time`);

      return { err: null, res: {
        success: true,
        course: {
          title: courseTitle,
          description: courseDescription,
          lessons: finalLessons
        },
        metadata: {
          processingTime: Date.now() - startTime,
          chunkCount: chunkingResult.chunks.length,
          lessonCount: finalLessons.length,
          enhancementApplied: this.options.enableEnhancement,
          aiCalls
        }
      }};

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      errors.push(errorMessage);
      
      console.error('❌ Enhanced Chunk AI processing failed:', err);
      
      return { err, res: null };
    }
  }

  /**
   * Generates lessons from semantic chunks
   */
  private async generateLessonsFromChunks(chunks: SemanticChunk[]): Promise<Lesson[]> {
    const lessons: Lesson[] = [];
    
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      console.log(`📖 Generating lesson ${i + 1}/${chunks.length}: ${chunk.topic}`);
      
      try {
        const lesson = await this.generateLessonFromChunk(chunk, i + 1);
        lessons.push(lesson);
      } catch (error) {
        console.warn(`Failed to generate lesson ${i + 1}:`, error);
        // Create a fallback lesson
        const fallbackLesson: Lesson = {
          id: `lesson_${i + 1}`,
          title: `Lesson ${i + 1}: ${chunk.topic}`,
          content: chunk.summary,
          summary: chunk.summary,
          keyPoints: chunk.keywords.slice(0, 3),
          duration: '20 min',
          difficulty: chunk.complexity,
          prerequisites: chunk.prerequisites,
          learningObjectives: [`Understand ${chunk.topic}`]
        };
        lessons.push(fallbackLesson);
      }
    }
    
    return lessons;
  }

  /**
   * Generates a single lesson from a chunk
   */
  private async generateLessonFromChunk(chunk: SemanticChunk, lessonNumber: number): Promise<Lesson> {
    const chunkContent = chunk.sentences.map(s => s.text).join(' ');
    
    // Generate lesson title
    const aiClient = new AIClient({ apiKey: process.env.GOOGLE_API_KEY! });
    const titleResponse = await aiClient.generateLessonTitle(chunkContent, lessonNumber);
    let title = `Lesson ${lessonNumber}: ${chunk.topic}`;
    
    if (!titleResponse.err && titleResponse.res) {
      title = titleResponse.res;
    }

    // Generate lesson content (enhanced if enabled)
    let content = chunkContent;
    if (this.options.enableEnhancement) {
      const enhancedResponse = await aiClient.enhanceLessonContent(chunkContent);
      if (!enhancedResponse.err && enhancedResponse.res) {
        content = enhancedResponse.res;
      }
    }

    // Generate key points
    const keyPointsResponse = await aiClient.generateKeyPoints(chunkContent);
    let keyPoints = chunk.keywords.slice(0, 3);
    
    if (!keyPointsResponse.err && keyPointsResponse.res) {
      keyPoints = keyPointsResponse.res;
    }

    // Generate summary
    const summaryResponse = await aiClient.generateLessonSummary(chunkContent);
    let summary = chunk.summary;
    
    if (!summaryResponse.err && summaryResponse.res) {
      summary = summaryResponse.res;
    }

    // Generate learning objectives
    const objectivesResponse = await aiClient.generateLearningObjectives(chunkContent);
    let learningObjectives = [`Understand ${chunk.topic}`];
    
    if (!objectivesResponse.err && objectivesResponse.res) {
      learningObjectives = objectivesResponse.res;
    }

    // Generate exercises
    const exercisesResponse = await aiClient.generateExercises(chunkContent, 'intermediate');
    let exercises: string[] = [];
    
    if (!exercisesResponse.err && exercisesResponse.res) {
      exercises = exercisesResponse.res;
    }

    return {
      id: `lesson_${lessonNumber}`,
      title,
      content,
      summary,
      keyPoints,
      duration: this.calculateLessonDuration(content),
      difficulty: chunk.complexity,
      prerequisites: chunk.prerequisites,
      learningObjectives,
      exercises: exercises.length > 0 ? exercises : undefined
    };
  }

  /**
   * Creates logical lesson progression
   */
  private createLessonProgression(lessons: Lesson[]): Lesson[] {
    if (lessons.length <= 1) return lessons;

    // Sort by difficulty and importance
    const sortedLessons = [...lessons].sort((a, b) => {
      const difficultyOrder = { beginner: 0, intermediate: 1, advanced: 2 };
      const aDiff = difficultyOrder[a.difficulty];
      const bDiff = difficultyOrder[b.difficulty];
      
      if (aDiff !== bDiff) {
        return aDiff - bDiff;
      }
      
      // If same difficulty, sort by prerequisites
      if (a.prerequisites.length !== b.prerequisites.length) {
        return a.prerequisites.length - b.prerequisites.length;
      }
      
      return 0;
    });

    // Add transitions between lessons
    for (let i = 1; i < sortedLessons.length; i++) {
      const previousLesson = sortedLessons[i - 1];
      const currentLesson = sortedLessons[i];
      
      // Add transition at the end of previous lesson
      if (previousLesson.content && currentLesson.content) {
        const transition = this.generateSimpleTransition(previousLesson, currentLesson);
        previousLesson.content += `\n\n${transition}`;
      }
    }

    return sortedLessons;
  }

  /**
   * Generates a simple transition between lessons
   */
  private generateSimpleTransition(previous: Lesson, current: Lesson): string {
    const transitions = [
      `Now that we've covered ${previous.title.toLowerCase()}, let's move on to ${current.title.toLowerCase()}.`,
      `Building on what we learned about ${previous.title.toLowerCase()}, we'll now explore ${current.title.toLowerCase()}.`,
      `Next, we'll dive into ${current.title.toLowerCase()}, which builds upon the concepts from ${previous.title.toLowerCase()}.`,
      `Let's continue our learning journey by exploring ${current.title.toLowerCase()}.`
    ];
    
    return transitions[Math.floor(Math.random() * transitions.length)];
  }

  /**
   * Calculates lesson duration based on content length
   */
  private calculateLessonDuration(content: string): string {
    const wordCount = content.split(/\s+/).length;
    const readingTimeMinutes = Math.ceil(wordCount / 200); // 200 words per minute
    const totalMinutes = Math.max(15, Math.min(60, readingTimeMinutes + 10)); // Add 10 min for exercises
    
    if (totalMinutes < 30) {
      return `${totalMinutes} min`;
    } else {
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
    }
  }

  /**
   * Updates processing options
   */
  updateOptions(newOptions: Partial<ProcessingOptions>): void {
    this.options = { ...this.options, ...newOptions };
  }

  /**
   * Gets current processing options
   */
  getOptions(): ProcessingOptions {
    return { ...this.options };
  }

  /**
   * Clears AI cache
   */
  clearCache(): void {
    const aiClient = new AIClient({ apiKey: process.env.GOOGLE_API_KEY! });
    aiClient.clearCache();
  }

  /**
   * Gets processing statistics
   */
  getStats(): { cacheSize: number; cacheHitRate: number } {
    const aiClient = new AIClient({ apiKey: process.env.GOOGLE_API_KEY! });
    const cacheStats = aiClient.getCacheStats();
    return {
      cacheSize: cacheStats.size,
      cacheHitRate: cacheStats.hitRate
    };
  }
}

// Export default instance
export const enhancedChunkAI = new EnhancedChunkAI();

// Export for backward compatibility
export default async function generateLessons(
  text: string, 
  style: "markdown" | "aiGen" | "chunk"
): Promise<Result<{
  title: string;
  description: string;
  lessons: Array<{
    title: string;
    content: string;
    duration: string;
    videoUrl: string;
    isCompleted: boolean;
    isCurrent: boolean;
  }>;
}>> {
  if (style !== "chunk") {
    // Use fallback preprocessText stub
    const { cleaned } = preprocessText(text);
    
    // Simple title generation
    const words: string[] = cleaned.toLowerCase().split(/\s+/);
    const commonWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by']);
    const significantWords = words
      .filter((word: string) => word.length > 3 && !commonWords.has(word))
      .slice(0, 5);
    
    const title = significantWords.length > 0 
      ? significantWords.join(' ').replace(/\b\w/g, (l: string) => l.toUpperCase())
      : 'Generated Course';
    
    const description = `Learn about ${significantWords.slice(0, 3).join(', ')} through this comprehensive course.`;
    
    if (style === "aiGen") {
      return { err: null, res: {
        title,
        description,
        lessons: [{
          title: "AI Generated Course",
          content: cleaned,
          duration: "30 min",
          videoUrl: "",
          isCompleted: false,
          isCurrent: false
        }]
      }};
    } else { // markdown
      const markdownLessons = cleaned.split(/#{1,6}\s+/).filter(Boolean).map((section: string, index: number) => {
        const lines = section.trim().split('\n');
        const lessonTitle = lines[0] || `Lesson ${index + 1}`;
        const content = lines.slice(1).join('\n').trim();
        
        return {
          title: lessonTitle.length > 50 ? lessonTitle.substring(0, 50) + "..." : lessonTitle,
          content: content || section,
          duration: "15 min",
          videoUrl: "",
          isCompleted: false,
          isCurrent: false
        };
      });
      
      return { err: null, res: {
        title,
        description,
        lessons: markdownLessons.length > 0 ? markdownLessons : [{
          title: "Introduction",
          content: cleaned,
          duration: "20 min",
          videoUrl: "",
          isCompleted: false,
          isCurrent: false
        }]
      }};
    }
  }

  // Use enhanced chunk AI for chunk style
  try {
    const ai = new EnhancedChunkAI();
    const result = await ai.processText(text);
    if (result.err || !result.res) return { err: result.err, res: null };
    // Map ProcessingResult to the expected structure
    const course = result.res.course;
    if (!course || !course.title || !course.description || !course.lessons) {
      return { err: new Error('Invalid course structure from AI'), res: null };
    }
    return {
      err: null,
      res: {
        title: course.title,
        description: course.description,
        lessons: course.lessons.map((lesson: Lesson, index: number) => ({
          title: lesson.title,
          content: lesson.content,
          duration: lesson.duration,
          videoUrl: '',
          isCompleted: false,
          isCurrent: index === 0
        }))
      }
    };
  } catch (err) {
    return { err, res: null };
  }
} 