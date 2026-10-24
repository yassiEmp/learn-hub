import { NextRequest } from "next/server";
import { and, eq } from "drizzle-orm";
import { verifyAuth } from "@/utils/auth/server";
import { successResponse, authErrorResponse, serverErrorResponse, notFoundResponse } from "@/utils/api-helpers";
import { db } from "@/lib/db";
import { exams } from "@/lib/db/schema";
import { isUuid, toExamDTO } from "@/utils/db-mappers";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ examId: string }> }
) {
    const { examId } = await params;

    try {
        const { user, error: authError } = await verifyAuth(req);
        if (authError || !user) {
            return authErrorResponse(authError || 'Authentication required');
        }
        if (!isUuid(examId)) return notFoundResponse('Exam not found');

        const [exam] = await db
            .select()
            .from(exams)
            .where(and(eq(exams.id, examId), eq(exams.ownerId, user.id)))
            .limit(1);

        if (!exam) return notFoundResponse('Exam not found');

        return successResponse(toExamDTO(exam), 'Exam fetched successfully');
    } catch (error) {
        console.error('Unexpected error in GET /api/v1/exam/[examId]:', error);
        return serverErrorResponse('An unexpected error occurred');
    }
}
