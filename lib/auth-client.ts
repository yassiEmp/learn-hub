import { createAuthClient } from "better-auth/react";

// Same-origin: no baseURL needed, session lives in an httpOnly cookie.
export const authClient = createAuthClient();

export const { signIn, signUp, signOut, useSession } = authClient;
