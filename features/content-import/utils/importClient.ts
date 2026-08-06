import { supabase } from '@/lib/supabase';

/**
 * POST to a content-import route.
 *
 * Centralises the two things every caller previously got wrong: attaching the
 * Bearer token the routes require, and unwrapping the
 * { success, data, message } envelope that successResponse() produces.
 *
 * Returns the `data` payload, or throws with the server's error message.
 */
export async function postImport<T>(
  endpoint: 'url' | 'topic' | 'video' | 'audio' | 'document',
  body: unknown
): Promise<T> {
  const { data: { session } } = await supabase.auth.getSession();

  const response = await fetch(`/api/v1/content-import/${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(session?.access_token
        ? { Authorization: `Bearer ${session.access_token}` }
        : {}),
    },
    body: JSON.stringify(body),
  });

  let payload: { success?: boolean; data?: T; error?: string } | null = null;
  try {
    payload = await response.json();
  } catch {
    throw new Error(`Server returned an invalid response (${response.status})`);
  }

  if (!response.ok || !payload?.success || !payload.data) {
    throw new Error(payload?.error || `Request failed (${response.status})`);
  }

  return payload.data;
}
