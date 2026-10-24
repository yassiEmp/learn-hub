import "server-only";
import type { Embeddings } from "@langchain/core/embeddings";
import { createEmbeddings } from "@/utils/ai/model";

export const CHUNK_SIZE = 1000;
export const CHUNK_OVERLAP = 200;
export const EMBEDDING_MODEL = process.env.EMBEDDING_MODEL || "text-embedding-004";
export const EMBEDDING_DIMENSIONS = 768;
export const DEFAULT_K = 10;

export type ChunkMetadata = {
  userId: string;
  documentId: string;
  source: string;
};

export const ragEmbeddings = (): Embeddings => createEmbeddings();
