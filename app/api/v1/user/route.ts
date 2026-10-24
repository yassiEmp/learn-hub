import { NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { verifyAuth } from "@/utils/auth/server";
import { authErrorResponse, serverErrorResponse, successResponse } from "@/utils/api-helpers";
import { db } from "@/lib/db";
import { user as userTable } from "@/lib/db/schema";

export async function DELETE(req: NextRequest) {
  try {
    const { user, error: authError } = await verifyAuth(req);
    if (authError || !user) {
      return authErrorResponse(authError || "Authentication required");
    }

    // Sessions, accounts, courses (and their lessons/chunks), exams and
    // enrollments all cascade from the user row.
    await db.delete(userTable).where(eq(userTable.id, user.id));

    return successResponse(null, "Account deleted successfully.");
  } catch (err) {
    console.error("Unexpected error in DELETE /api/v1/user:", err);
    return serverErrorResponse("Failed to delete account");
  }
}
