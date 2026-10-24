/**
 * Same-origin JSON fetch for the app's /api routes.
 *
 * Auth travels in the Better Auth httpOnly cookie, so no Authorization header
 * is ever sent. Unwraps the `{ success, data, message }` envelope and throws an
 * Error carrying the server's human-readable `error` on failure.
 */
export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  let response: Response;
  try {
    response = await fetch(path, {
      credentials: 'same-origin',
      ...init,
      headers: {
        ...(init.body && !(init.body instanceof FormData) ? { 'Content-Type': 'application/json' } : {}),
        ...init.headers,
      },
    });
  } catch {
    throw new ApiError('Network error. Check your connection and try again.', 0);
  }

  let payload: { success?: boolean; data?: T; error?: string; message?: string } | null = null;
  try {
    payload = await response.json();
  } catch {
    // Non-JSON body (e.g. a platform error page)
  }

  if (!response.ok || !payload || payload.success === false) {
    const fallback =
      response.status === 401
        ? 'Your session has expired. Please sign in again.'
        : response.status === 413
          ? 'That file is too large to upload.'
          : `Something went wrong (${response.status}). Please try again.`;
    throw new ApiError(payload?.error || payload?.message || fallback, response.status);
  }

  // Tolerate routes that return a raw body instead of the envelope.
  return ('success' in payload ? payload.data : payload) as T;
}

export function errorMessage(err: unknown, fallback = 'Something went wrong. Please try again.'): string {
  if (err instanceof Error && err.message) return err.message;
  if (typeof err === 'string' && err) return err;
  return fallback;
}
