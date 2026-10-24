import "server-only";
import { NextRequest } from "next/server";
import { headers as nextHeaders } from "next/headers";
import { auth } from "@/lib/auth";

export type AuthUser = { id: string; email: string; name: string; image?: string | null };

// Verify the Better Auth session cookie. Same return shape the routes used with Supabase.
export const verifyAuth = async (
  request?: NextRequest
): Promise<{ user: AuthUser; error: null } | { user: null; error: string }> => {
  try {
    const session = await auth.api.getSession({
      headers: request ? request.headers : await nextHeaders(),
    });
    if (!session?.user) return { user: null, error: "Authentication required" };
    const { id, email, name, image } = session.user;
    return { user: { id, email, name, image }, error: null };
  } catch (error) {
    console.error("Auth verification error:", error);
    return { user: null, error: "Authentication failed" };
  }
};
