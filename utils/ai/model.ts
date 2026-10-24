import "server-only";
import type { BaseChatModel } from "@langchain/core/language_models/chat_models";
import type { Embeddings } from "@langchain/core/embeddings";
import { ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";

// One switch for every model call: OpenRouter when OPENROUTER_API_KEY is set,
// otherwise Gemini directly with GOOGLE_API_KEY.

export const OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1";

export const isOpenRouter = (): boolean => !!process.env.OPENROUTER_API_KEY;

const openRouterConfig = () => ({
  baseURL: OPENROUTER_BASE_URL,
  defaultHeaders: {
    "HTTP-Referer": process.env.BETTER_AUTH_URL || "https://flashmind.app",
    "X-Title": "FlashMind",
  },
});

/** OpenRouter model ids are namespaced ("google/gemini-2.5-flash"). */
export const chatModelName = (): string =>
  isOpenRouter()
    ? process.env.OPENROUTER_MODEL || "google/gemini-2.5-flash"
    : process.env.MODEL || "gemini-2.0-flash";

export function createChatModel({
  temperature = 0.2,
  maxOutputTokens = 8000,
  model,
}: { temperature?: number; maxOutputTokens?: number; model?: string } = {}): BaseChatModel {
  if (isOpenRouter()) {
    return new ChatOpenAI({
      model: model || chatModelName(),
      apiKey: process.env.OPENROUTER_API_KEY,
      temperature,
      maxTokens: Math.min(maxOutputTokens, 65536),
      configuration: openRouterConfig(),
    });
  }
  return new ChatGoogleGenerativeAI({
    model: model || chatModelName(),
    apiKey: process.env.GOOGLE_API_KEY,
    temperature,
    maxOutputTokens,
  });
}

export function createEmbeddings(): Embeddings {
  if (isOpenRouter()) {
    return new OpenAIEmbeddings({
      model: process.env.OPENROUTER_EMBEDDING_MODEL || "google/gemini-embedding-001",
      apiKey: process.env.OPENROUTER_API_KEY,
      configuration: openRouterConfig(),
    });
  }
  return new GoogleGenerativeAIEmbeddings({
    model: process.env.EMBEDDING_MODEL || "text-embedding-004",
    apiKey: process.env.GOOGLE_API_KEY,
  });
}

export { openRouterConfig };
