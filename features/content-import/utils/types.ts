export type ImportType = 'text' | 'url' | 'topic' | 'document' | 'video' | 'audio';

export interface ImportResult {
  type: ImportType;
  content: string;
  blobUrl?: string;        // Vercel Blob URL for file access
  blobPathname?: string;   // Blob pathname for deletion/management
  metadata: {
    source?: string;
    title?: string;
    duration?: number;
    fileType?: string;
    fileSize?: number;
    pages?: number;
  };
} // update to use discriminated union

export interface ImportTabProps {
  onContentImport: (result: ImportResult) => void;
  isProcessing?: boolean;
}

export interface QuotaStatus {
  type: ImportType;
  used: number;
  limit: number;
  resetDate: Date;
}

export interface ProcessingStatus {
  isProcessing: boolean;
  progress?: number;
  message?: string;
}
