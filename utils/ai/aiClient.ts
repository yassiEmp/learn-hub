// ============================================================================
// AI Client for Enhanced Chunk AI System
// ============================================================================

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { z } from "zod";
import { jsonrepair as parseJSON } from "jsonrepair";

// 1. Define schema
const courseMetadataSchema = z.object({
  title: z.string(),
  description: z.string(),
  category: z.string(),
  level: z.enum(["beginner", "intermediate", "advanced"]),
  tags: z.array(z.string())
});

type CourseMetadata = z.infer<typeof courseMetadataSchema>;

// 2. Create parser
const parser = StructuredOutputParser.fromZodSchema(courseMetadataSchema);

// 3. Create prompt
// NOTE: All literal curly braces must be escaped as '{{' and '}}' for LangChain templates
const formatInstructions = parser.getFormatInstructions().replace(/\{/g, '{{').replace(/\}/g, '}}');
const prompt = ChatPromptTemplate.fromMessages([
  ["system", "You are a metadata-extraction assistant."],
  ["human", `\nExtract structured metadata from the following course description. \nReturn **only** a valid JSON object with these fields (no explanations, no markdown):\n\n${formatInstructions}\n\nExample:\nInput:\n\"Master React from scratch. This course covers JSX, components, hooks, and React Router. Perfect for beginners.\"\nOutput:\n{{{{\n  \"title\": \"React for Beginners\",\n  \"description\": \"Learn React from the ground up including JSX, components, hooks, and routing.\",\n  \"category\": \"Web Development\",\n  \"level\": \"beginner\",\n  \"tags\": [\"React\", \"Frontend\", \"JSX\", \"Hooks\", \"Routing\"]\n}}}}\n\nNow process this input:\n{input}\n`]
]);

// 4. Instantiate model (reuse this.llm if possible)
// ... existing code ...

// 5. Create pipeline chain with parser at the end
const chain = prompt.pipe(new ChatGoogleGenerativeAI({
  model: "gemini-2.0-flash",
  temperature: 0.2,
  maxOutputTokens: 10000
})).pipe(parser);

// 6. Function to safely parse + repair + validate
async function extractMetadata(courseText: string): Promise<CourseMetadata> {
  // Best practice: chain returns parsed object directly (see LangChain.js docs)
  let rawOutput: unknown = null;
  try {
    rawOutput = await chain.invoke({ input: courseText });
    console.log("[extractMetadata] Raw output from chain.invoke:", rawOutput);
    // The output parser in the chain ensures this is CourseMetadata
    return rawOutput as CourseMetadata;
  } catch (parseErr) {
    console.error("[extractMetadata] Error during initial parse:", parseErr);
    if (rawOutput) {
      console.error("[extractMetadata] Raw output that caused error:", rawOutput);
    }
    // If parsing fails, try to repair and validate
    try {
      // Fallback: run without parser, repair, then validate
      const modelOnlyChain = prompt.pipe(new ChatGoogleGenerativeAI({
        model: "gemini-2.0-flash",
        temperature: 0.2,
        maxOutputTokens: 10000
      }));
      const rawOutputChunk = await modelOnlyChain.invoke({ input: courseText });
      const rawOutputText = rawOutputChunk.content as string;
      console.error("[extractMetadata] Raw model output before repair:", rawOutputText);
      try {
        const repaired = parseJSON(rawOutputText);
        return courseMetadataSchema.parse(repaired);
      } catch (repairErr) {
        console.error("[extractMetadata] Repair/validation failed:", repairErr);
        console.error("[extractMetadata] Raw output that failed repair:", rawOutputText);
        throw new Error("Failed to repair and validate output.");
      }
    } catch {
      throw new Error("Failed to repair and validate output.");
    }
  }
}

export class AIClient {
  private llm: ChatGoogleGenerativeAI;
  private retryAttempts: number;
  private cache: Map<string, { metadata?: { timestamp?: number } }>; // Use a more specific type

  constructor(config: {
    apiKey: string;
    model?: string;
    temperature?: number;
    maxOutputTokens?: number;
    retryAttempts?: number;
  }) {
    this.llm = new ChatGoogleGenerativeAI({
      model: config.model || "gemini-2.0-flash-exp",
      apiKey: config.apiKey,
      temperature: config.temperature || 0.2,
      maxOutputTokens: config.maxOutputTokens || 4000,
    });
    
    this.retryAttempts = config.retryAttempts || 3;
    this.cache = new Map();
  }

  /**
   * Sends a prompt to the AI and returns the response
   */
  async sendPrompt(prompt: Record<string, unknown>): Promise<unknown> {
    const cacheKey = this.generateCacheKey(prompt);
    
    // Check cache first
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey)!;
      if (cached.metadata && typeof cached.metadata.timestamp === 'number' && Date.now() - cached.metadata.timestamp < 3600000) { // 1 hour cache
        return cached;
      }
    }

    const startTime = Date.now();
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
      try {
        // Cast prompt.system and prompt.user to string for BaseMessageLike compatibility
        const response = await this.llm.invoke([
          { role: "system", content: String(prompt.system) },
          { role: "user", content: String(prompt.user) }
        ]);

        const duration = Date.now() - startTime;
        const aiResponse = {
          success: true,
          data: response.content,
          metadata: {
            model: this.llm.model,
            tokens: response.response_metadata?.tokenUsage?.totalTokens || 0,
            duration,
            timestamp: Date.now()
          }
        };

        // Cache the response
        this.cache.set(cacheKey, aiResponse);
        
        return aiResponse;

      } catch (error) {
        lastError = error as Error;
        console.warn(`AI request attempt ${attempt} failed:`, error);
        
        if (attempt < this.retryAttempts) {
          // Wait before retrying (exponential backoff)
          await this.delay(Math.pow(2, attempt) * 1000);
        }
      }
    }

    return {
      success: false,
      error: lastError?.message || 'AI request failed after all retry attempts',
      metadata: {
        model: this.llm.model,
        tokens: 0,
        duration: Date.now() - startTime,
        timestamp: Date.now()
      }
    };
  }

  /**
   * Utility: Extract representative content for LLM context
   */
  private extractRepresentativeContent(content: string, maxLength: number = 2000): string {
    // Extract headings (Markdown style)
    const headingRegex = /^#{1,6}\s+(.+)$/gm;
    const headings: string[] = [];
    let match;
    while ((match = headingRegex.exec(content)) !== null) {
      headings.push(match[1]);
    }

    // Extract first and last N characters
    const sampleSize = Math.floor(maxLength / 3);
    const startSample = content.slice(0, sampleSize);
    const endSample = content.slice(-sampleSize);

    // Extract key sentences (first sentence of each paragraph, up to a limit)
    const paragraphs = content.split(/\n{2,}/);
    const keySentences: string[] = [];
    for (const para of paragraphs) {
      const firstSentence = para.match(/[^.!?\n]+[.!?]/);
      if (firstSentence) keySentences.push(firstSentence[0].trim());
      if (keySentences.join(' ').length > sampleSize) break;
    }

    // Compose the representative content
    let result = '';
    if (headings.length > 0) {
      result += `Headings: ${headings.join(' | ')}\n`;
    }
    result += `Start: ${startSample}\n`;
    if (keySentences.length > 0) {
      result += `Key Sentences: ${keySentences.join(' ')}\n`;
    }
    result += `End: ${endSample}`;

    // Truncate to maxLength if needed
    if (result.length > maxLength) {
      result = result.slice(0, maxLength) + '...';
    }
    return result;
  }

  /**
   * Generates course metadata (title, description, category, level, tags) from text
   */
  async generateCourseMetadata(content: string): Promise<CourseMetadata> {
  return extractMetadata(content);
  }

  /**
   * Generates a lesson title from chunk content
   */
  async generateLessonTitle(chunkContent: string, lessonNumber: number): Promise<unknown> { // Changed from AIResponse to unknown
    const prompt: Record<string, unknown> = { // Changed from AIPrompt to unknown
      system: `You are an expert educator creating lesson titles. Generate engaging, descriptive titles for educational content.

Guidelines:
- Create titles that clearly indicate what the lesson covers
- Use action verbs when appropriate
- Keep titles concise (under 50 characters)
- Make them engaging and professional
- Focus on the main concept or skill being taught
- Avoid generic titles like "Introduction" or "Overview"

Return only the title as a string, nothing else.`,
      user: `Generate a lesson title for lesson ${lessonNumber} based on this content:

${chunkContent.substring(0, 1000)}${chunkContent.length > 1000 ? '...' : ''}

Create a clear, engaging title that captures the main topic of this lesson.`,
      temperature: 0.3
    };

    return this.sendPrompt(prompt);
  }

  /**
   * Enhances lesson content with better narrative flow
   */
  async enhanceLessonContent(content: string): Promise<unknown> { // Changed from AIResponse to unknown
    const prompt: Record<string, unknown> = { // Changed from AIPrompt to unknown
      system: `You are an expert educational content writer. Your task is to enhance lesson content to improve readability and learning effectiveness.

Guidelines:
- Improve narrative flow and transitions
- Add clear explanations where needed
- Maintain the original meaning and key points
- Use clear, engaging language
- Add helpful examples when appropriate
- Structure content logically
- Keep the enhanced version concise but comprehensive

Return the enhanced content as plain text.`,
      user: `Enhance this lesson content to improve readability and learning effectiveness:

${content}

Focus on improving narrative flow, adding clear explanations, and making the content more engaging while preserving all key information.`,
      temperature: 0.2
    };

    return this.sendPrompt(prompt);
  }

  /**
   * Generates key learning points from lesson content
   */
  async generateKeyPoints(content: string): Promise<unknown> { // Changed from AIResponse to unknown
    const prompt: Record<string, unknown> = { // Changed from AIPrompt to unknown
      system: `You are an expert educator extracting key learning points from educational content.

Guidelines:
- Identify 3-5 main learning points
- Focus on the most important concepts
- Use clear, concise language
- Make points actionable when possible
- Ensure points are specific to the content
- Avoid generic statements

Return your response as a JSON array of strings:
["Key point 1", "Key point 2", "Key point 3"]`,
      user: `Extract 3-5 key learning points from this lesson content:

${content}

Focus on the most important concepts and learning outcomes.`,
      temperature: 0.2
    };

    return this.sendPrompt(prompt);
  }

  /**
   * Generates a lesson summary
   */
  async generateLessonSummary(content: string): Promise<unknown> { // Changed from AIResponse to unknown
    const prompt: Record<string, unknown> = { // Changed from AIPrompt to unknown
      system: `You are an expert educator creating lesson summaries. Create concise, informative summaries that capture the main points.

Guidelines:
- Summarize the key concepts and takeaways
- Keep summaries concise (2-3 sentences)
- Focus on what students should remember
- Use clear, accessible language
- Highlight the most important information

Return only the summary text, nothing else.`,
      user: `Create a concise summary of this lesson content:

${content}

Focus on the key concepts and main takeaways that students should remember.`,
      temperature: 0.2
    };

    return this.sendPrompt(prompt);
  }

  /**
   * Generates learning objectives for a lesson
   */
  async generateLearningObjectives(content: string): Promise<unknown> { // Changed from AIResponse to unknown
    const prompt: Record<string, unknown> = { // Changed from AIPrompt to unknown
      system: `You are an expert educator creating learning objectives. Generate clear, measurable learning objectives for educational content.

Guidelines:
- Create 2-4 specific learning objectives
- Use action verbs (understand, apply, analyze, etc.)
- Make objectives measurable and specific
- Focus on what students will be able to do
- Align with the content being taught
- Use clear, professional language

Return your response as a JSON array of strings:
["Objective 1", "Objective 2", "Objective 3"]`,
      user: `Generate 2-4 learning objectives for this lesson content:

${content}

Focus on what students will be able to do or understand after completing this lesson.`,
      temperature: 0.3
    };

    return this.sendPrompt(prompt);
  }

  /**
   * Generates transitions between lessons
   */
  async generateLessonTransition(
    previousLesson: string, 
    currentLesson: string
  ): Promise<unknown> { // Changed from AIResponse to unknown
    const prompt: Record<string, unknown> = { // Changed from AIPrompt to unknown
      system: `You are an expert educator creating smooth transitions between lessons. Generate brief, engaging transitions that connect lessons logically.

Guidelines:
- Create natural connections between topics
- Keep transitions concise (1-2 sentences)
- Use engaging language
- Preview what's coming next
- Maintain student interest
- Make logical sense

Return only the transition text, nothing else.`,
      user: `Create a smooth transition from this previous lesson to the current lesson:

Previous lesson: ${previousLesson}
Current lesson: ${currentLesson}

Generate a brief, engaging transition that connects these lessons logically.`,
      temperature: 0.4
    };

    return this.sendPrompt(prompt);
  }

  /**
   * Generates exercises or practice questions
   */
  async generateExercises(content: string, difficulty: 'beginner' | 'intermediate' | 'advanced'): Promise<unknown> { // Changed from AIResponse to unknown
    const prompt: Record<string, unknown> = { // Changed from AIPrompt to unknown
      system: `You are an expert educator creating practice exercises. Generate relevant exercises that help students apply what they've learned.

Guidelines:
- Create 2-3 practical exercises
- Match the difficulty level specified
- Focus on applying key concepts
- Make exercises engaging and relevant
- Include different types (questions, tasks, problems)
- Ensure exercises are clear and actionable

Return your response as a JSON array of strings:
["Exercise 1", "Exercise 2", "Exercise 3"]`,
      user: `Generate 2-3 practice exercises for this lesson content at ${difficulty} difficulty level:

${content}

Create exercises that help students apply the key concepts from this lesson.`,
      temperature: 0.4
    };

    return this.sendPrompt(prompt);
  }

  /**
   * Clears the response cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Gets cache statistics
   */
  getCacheStats(): { size: number; hitRate: number } {
    return {
      size: this.cache.size,
      hitRate: 0 // Would need to track hits/misses for accurate rate
    };
  }

  /**
   * Generates a cache key for a prompt
   */
  private generateCacheKey(prompt: Record<string, unknown>): string { // Changed from AIPrompt to unknown
    const content = `${prompt.system}:${prompt.user}:${prompt.temperature || 0}:${prompt.maxOutputTokens || 0}`;
    return Buffer.from(content).toString('base64').substring(0, 32);
  }

  /**
   * Delays execution for a specified number of milliseconds
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Export a default instance
export const aiClient = new AIClient({
  apiKey: process.env.GOOGLE_API_KEY!,
  model: "gemini-2.0-flash-exp",
  temperature: 0.3,
  maxOutputTokens: 4000,
  retryAttempts: 3
}); 