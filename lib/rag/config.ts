import "server-only";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";

export const CHUNK_SIZE = 1000;
export const CHUNK_OVERLAP = 200;
export const EMBEDDING_MODEL = "text-embedding-004";
export const EMBEDDING_DIMENSIONS = 768;
export const DEFAULT_K = 10;

export const TABLE_NAME = "documents";
export const QUERY_NAME = "match_documents";

export type ChunkMetadata = {
  userId: string;
  documentId: string;
  source: string;
};

// Writes bypass RLS, so ingestion and retrieval both use the service role key.
export const ragSupabaseClient = (): SupabaseClient =>
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );

export const ragEmbeddings = (): GoogleGenerativeAIEmbeddings =>
  new GoogleGenerativeAIEmbeddings({
    model: EMBEDDING_MODEL,
    apiKey: process.env.GOOGLE_API_KEY,
  });
