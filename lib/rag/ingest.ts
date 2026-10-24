import "server-only";
import { eq } from "drizzle-orm";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { db } from "@/lib/db";
import { documentChunks } from "@/lib/db/schema";
import type { Result } from "@/utils/utils";
import { CHUNK_OVERLAP, CHUNK_SIZE, ChunkMetadata, ragEmbeddings } from "./config";

export type IngestInput = {
  /** Text already extracted upstream by pdf-parse, youtube-transcript or cheerio. */
  text: string;
  metadata: ChunkMetadata;
};

const INSERT_BATCH = 100;

/**
 * Chunk, embed and store one document in the document_chunks table.
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
    if (chunks.length === 0) return { err: null, res: 0 };

    const embeddings = await ragEmbeddings().embedDocuments(chunks);

    const rows = chunks.map((content, index) => ({
      documentId: metadata.documentId,
      userId: metadata.userId,
      chunkIndex: index,
      content,
      source: metadata.source || "course",
      embedding: embeddings[index] ?? [],
    }));

    // Skip chunks the embedding call returned nothing for.
    const valid = rows.filter((r) => r.embedding.length > 0);

    for (let i = 0; i < valid.length; i += INSERT_BATCH) {
      await db.insert(documentChunks).values(valid.slice(i, i + INSERT_BATCH));
    }

    return { err: null, res: valid.length };
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
    await db.delete(documentChunks).where(eq(documentChunks.documentId, documentId));
    return { err: null, res: true };
  } catch (err) {
    return { err, res: null };
  }
}
