import { apiFetch } from '@/hooks/apiFetch';

type ImportEndpoint = 'url' | 'topic' | 'video' | 'audio' | 'document';

/**
 * POST JSON to a content-import route.
 *
 * Auth rides on the Better Auth session cookie. Unwraps the
 * { success, data, message } envelope and returns `data`, or throws with the
 * server's error message.
 */
export async function postImport<T>(endpoint: ImportEndpoint, body: unknown): Promise<T> {
  return apiFetch<T>(`/api/v1/content-import/${endpoint}`, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

/** POST multipart form data (file uploads) to a content-import route. */
export async function postImportForm<T>(endpoint: ImportEndpoint, form: FormData): Promise<T> {
  return apiFetch<T>(`/api/v1/content-import/${endpoint}`, {
    method: 'POST',
    body: form,
  });
}

/** Read a File as a base64 string (without the data: prefix). */
export function fileToBase64(file: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(',')[1] ?? '');
    reader.onerror = () => reject(new Error('Could not read the file. Please try another one.'));
    reader.readAsDataURL(file);
  });
}
