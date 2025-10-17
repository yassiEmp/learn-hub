import { put, del, head } from '@vercel/blob';

export interface BlobUploadResult {
  url: string;
  pathname: string;
  contentType: string;
}

export interface BlobFile {
  url: string;
  pathname: string;
  type: 'document' | 'audio' | 'image';
  filename: string;
  size: number;
  uploadedAt: string;
}

/**
 * Upload a file to Vercel Blob
 */
export async function uploadToBlob(
  file: Buffer | Blob | File,
  filename: string,
  options: {
    userId: string;
    isPublic: boolean;
    contentType?: string;
  }
): Promise<BlobUploadResult> {
  const { userId, isPublic, contentType } = options;

  // Construct path: users/{userId}/{timestamp}_{filename}
  const timestamp = Date.now();
  const path = `users/${userId}/${timestamp}_${filename}`;

  let blob
  if (isPublic) {
    blob = await put(path, file, {
      access: 'public',
      contentType: contentType || 'application/octet-stream',
      addRandomSuffix: true,
    });
  } else {
    blob = await put(path, file, {
      access: 'public',
      contentType: contentType || 'application/octet-stream',
      addRandomSuffix: true,
    });
  }
  
  return {
    url: blob.url,
    pathname: blob.pathname,
    contentType: blob.contentType,
  };
}

/**
 * Delete a file from Vercel Blob
 */
export async function deleteFromBlob(pathname: string): Promise<void> {
  await del(pathname);
}

/**
 * Get blob metadata
 */
export async function getBlobMetadata(url: string) {
  return await head(url);
}

/**
 * Update blob access level (requires re-upload)
 * Note: Vercel Blob doesn't support in-place access updates
 */
export async function updateBlobAccess(
  oldPathname: string,
  newPathname: string,
  access: 'public' | 'private'
): Promise<BlobUploadResult> {
  // This is a limitation - we need to re-upload with new access
  // For now, we'll track access in database only
  console.warn('Blob access control updated in database only - re-upload required for actual access change');

  // In a real implementation, you would:
  // 1. Download the old blob
  // 2. Upload with new access level
  // 3. Delete the old blob
  // 4. Update database with new URL
  console.log(oldPathname,newPathname,access)
  throw new Error('Blob access update requires re-upload - not implemented');
}

/**
 * Create a BlobFile object for database storage
 */
export function createBlobFile(
  uploadResult: BlobUploadResult,
  filename: string,
  fileSize: number,
  type: 'document' | 'audio' | 'image'
): BlobFile {
  return {
    url: uploadResult.url,
    pathname: uploadResult.pathname,
    type,
    filename,
    size: fileSize,
    uploadedAt: new Date().toISOString(),
  };
}

