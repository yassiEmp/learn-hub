import "server-only";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { Document } from "@langchain/core/documents";
import type { Result } from "@/utils/utils";
import {
  CHUNK_OVERLAP,
  CHUNK_SIZE,
  ChunkMetadata,
  QUERY_NAME,
  TABLE_NAME,
  ragEmbeddings,
  ragSupabaseClient,
} from "./config";

export type IngestInput = {
  /** Text already extracted upstream by pdf-parse, youtube-transcript or cheerio. */
  text: string;
  metadata: ChunkMetadata;
};

/**
 * Chunk, embed and store one document in the pgvector store.
 * Returns the number of chunks written.
 */
export async function ingestDocument({
  text,
  metadata,
}: IngestInput): Promise<Result<number>> {
  if (!text?.trim()) {
    return { err: new Error("ingestDocument: empty text"), res: null };
  }

  try {
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: CHUNK_SIZE,
      chunkOverlap: CHUNK_OVERLAP,
    });

    const chunks = await splitter.splitText(text);

    const documents = chunks.map(
      (content, index) =>
        new Document({
          pageContent: content,
          metadata: { ...metadata, chunkIndex: index },
        })
    );

    await SupabaseVectorStore.fromDocuments(documents, ragEmbeddings(), {
      client: ragSupabaseClient(),
      tableName: TABLE_NAME,
      queryName: QUERY_NAME,
    });

    return { err: null, res: documents.length };
  } catch (err) {
    console.error("ingestDocument failed:", err);
    return { err, res: null };
  }
}

/** Remove every chunk of a document. Used before re-ingesting the same documentId. */
export async function deleteDocumentChunks(
  documentId: string
): Promise<Result<true>> {
  try {
    const { error } = await ragSupabaseClient()
      .from(TABLE_NAME)
      .delete()
      .contains("metadata", { documentId });

    if (error) return { err: error, res: null };
    return { err: null, res: true };
  } catch (err) {
    return { err, res: null };
  }
}
