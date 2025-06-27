import { NextRequest } from "next/server";
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Service role key required for admin actions
);

export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await request.json();
    if (!userId) {
      return new Response("Missing user ID.", { status: 400 });
    }
    const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);
    if (error) {
      return new Response(`Failed to delete user: ${error.message}`, { status: 500 });
    }
    return new Response("Account deleted successfully.", { status: 200 });
  } catch (err) {
    return new Response("Error deleting account.", { status: 500 });
  }
} 