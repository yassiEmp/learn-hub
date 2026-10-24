import type { SourceFile, SourceType } from '@/types/course';

/** What a source form hands to the create flow once its input is valid. */
export interface PreparedSource {
  text: string;
  sourceType: SourceType;
  sourceFiles?: SourceFile[];
}

/**
 * A validated, ready-to-run request. `prepare` performs any extraction
 * (upload, transcript, scraping) and may throw with a human-readable message.
 */
export interface SourceJob {
  sourceType: SourceType;
  prepare: () => Promise<PreparedSource>;
}

export interface SourceFormProps {
  disabled: boolean;
  onSubmit: (job: SourceJob) => void;
}

/** Blob metadata returned by the content-import upload routes. */
export interface BlobUpload {
  blobUrl?: string;
  blobPathname?: string;
}

export function toSourceFiles(
  upload: BlobUpload,
  file: { name: string; size: number },
  type: string
): SourceFile[] | undefined {
  if (!upload.blobUrl) return undefined;
  return [
    {
      url: upload.blobUrl,
      pathname: upload.blobPathname,
      type,
      filename: file.name,
      size: file.size,
      uploadedAt: new Date().toISOString(),
    },
  ];
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
