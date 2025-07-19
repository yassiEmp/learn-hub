// ============================================================================
// AI Client for Enhanced Chunk AI System
// ============================================================================

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

export class AIClient {
  private llm: ChatGoogleGenerativeAI;
  private retryAttempts: number;
  private cache: Map<string, { data?: unknown; metadata?: { timestamp?: number } }>;

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

  async sendPrompt<T = unknown>(prompt: Record<string, unknown>): Promise<{ success: true; data: T; metadata: Record<string, unknown> } | { success: false; error: string; metadata: Record<string, unknown> }> {
    const cacheKey = this.generateCacheKey(prompt);
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey)!;
      if (cached.metadata && typeof cached.metadata.timestamp === 'number' && Date.now() - cached.metadata.timestamp < 3600000) {
        return { success: true, data: cached.data as T, metadata: cached.metadata };
      }
    }
    const startTime = Date.now();
    let lastError: Error | null = null;
    for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
      try {
        const response = await this.llm.invoke([
          { role: "system", content: String(prompt.system) },
          { role: "user", content: String(prompt.user) }
        ]);
        const duration = Date.now() - startTime;
        const aiResponse = {
          success: true as const,
          data: response.content as T,
          metadata: {
            model: this.llm.model,
            tokens: response.response_metadata?.tokenUsage?.totalTokens || 0,
            duration,
            timestamp: Date.now()
          }
        };
        this.cache.set(cacheKey, { data: aiResponse.data, metadata: aiResponse.metadata });
        return aiResponse;
      } catch (error) {
        lastError = error as Error;
        if (attempt < this.retryAttempts) {
          await this.delay(Math.pow(2, attempt) * 1000);
        }
      }
    }
    return {
      success: false as const,
      error: lastError?.message || 'AI request failed after all retry attempts',
      metadata: {
        model: this.llm.model,
        tokens: 0,
        duration: Date.now() - startTime,
        timestamp: Date.now()
      }
    };
  }

  clearCache(): void {
    this.cache.clear();
  }

  getCacheStats(): { size: number; hitRate: number } {
    return {
      size: this.cache.size,
      hitRate: 0
    };
  }

  private generateCacheKey(prompt: Record<string, unknown>): string {
    const content = `${prompt.system}:${prompt.user}:${prompt.temperature || 0}:${prompt.maxOutputTokens || 0}`;
    return Buffer.from(content).toString('base64').substring(0, 32);
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const aiClient = new AIClient({
  apiKey: process.env.GOOGLE_API_KEY!,
  model: "gemini-2.0-flash-exp",
  temperature: 0.3,
  maxOutputTokens: 4000,
  retryAttempts: 3
}); 