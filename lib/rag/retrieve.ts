import "server-only";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { documentChunks } from "@/lib/db/schema";
import type { Result } from "@/utils/utils";
import { DEFAULT_K, ragEmbeddings } from "./config";

export type RetrievedChunk = {
  content: string;
  similarity: number;
  documentId: string;
  source: string;
};

export type RetrieveInput = {
  /** Natural language query used for the similarity search. */
  query: string;
  documentId: string;
  k?: number;
};

function cosineSimilarity(a: number[], b: number[]): number {
  const n = Math.min(a.length, b.length);
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (let i = 0; i < n; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  if (na === 0 || nb === 0) return 0;
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

/**
 * Fetch the k chunks of one document most similar to the query.
 * Retrieval is always scoped to one document, so ranking in-process is cheap.
 */
export async function retrieveChunks({
  query,
  documentId,
  k = DEFAULT_K,
}: RetrieveInput): Promise<Result<RetrievedChunk[]>> {
  try {
    const rows = await db
      .select({
        content: documentChunks.content,
        source: documentChunks.source,
        embedding: documentChunks.embedding,
      })
      .from(documentChunks)
      .where(eq(documentChunks.documentId, documentId));

    if (rows.length === 0) return { err: null, res: [] };

    const queryEmbedding = await ragEmbeddings().embedQuery(query);

    const ranked = rows
      .map((row) => ({
        content: row.content,
        similarity: cosineSimilarity(queryEmbedding, row.embedding),
        documentId,
        source: row.source,
      }))
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, k);

    return { err: null, res: ranked };
  } catch (err) {
    console.error("retrieveChunks failed:", err);
    return { err, res: null };
  }
}

/** Join retrieved chunks into the single content string the exam prompt expects. */
export function chunksToContext(chunks: RetrievedChunk[]): string {
  return chunks
    .map((chunk, index) => `[Excerpt ${index + 1}]\n${chunk.content}`)
    .join("\n\n");
}
