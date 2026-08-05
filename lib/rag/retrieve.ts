import "server-only";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import type { Result } from "@/utils/utils";
import {
  DEFAULT_K,
  QUERY_NAME,
  TABLE_NAME,
  ragEmbeddings,
  ragSupabaseClient,
} from "./config";

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

/** Fetch the k chunks of one document most similar to the query. */
export async function retrieveChunks({
  query,
  documentId,
  k = DEFAULT_K,
}: RetrieveInput): Promise<Result<RetrievedChunk[]>> {
  try {
    const store = new SupabaseVectorStore(ragEmbeddings(), {
      client: ragSupabaseClient(),
      tableName: TABLE_NAME,
      queryName: QUERY_NAME,
    });

    const results = await store.similaritySearchWithScore(query, k, {
      documentId,
    });

    return {
      err: null,
      res: results.map(([document, similarity]) => ({
        content: document.pageContent,
        similarity,
        documentId: String(document.metadata?.documentId ?? documentId),
        source: String(document.metadata?.source ?? "unknown"),
      })),
    };
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
