import { NextRequest } from "next/server";
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function DELETE(request: NextRequest) {
  try {
    // 1. Get the access token from the request
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
      console.error("No authorization token provided");
      return new Response("Unauthorized: No token provided", { status: 401 });
    }

    // 2. Create a Supabase client with the user's token
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { global: { headers: { Authorization: `Bearer ${token}` } } }
    );

    // 3. Get the user from the token
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) {
      console.error("Error getting user from token:", userError);
      return new Response(`Unauthorized: ${userError.message}`, { status: 401 });
    }
    if (!user) {
      console.error("No user found for provided token");
      return new Response("Unauthorized: No user found", { status: 401 });
    }

    // 4. Use the admin client to delete the user by their ID
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(user.id);
    if (deleteError) {
      console.error("Error deleting user:", deleteError);
      return new Response(`Failed to delete user: ${deleteError.message}`, { status: 500 });
    }

    return new Response("Account deleted successfully.", { status: 200 });
  } catch (err) {
    console.error("Unexpected error in DELETE /api/v1/user:", err);
    return new Response(`Unexpected error: ${err instanceof Error ? err.message : String(err)}`, { status: 500 });
  }
} 