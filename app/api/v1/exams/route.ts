import { NextRequest } from "next/server";
import { desc, eq } from "drizzle-orm";
import { verifyAuth } from "@/utils/auth/server";
import { successResponse, authErrorResponse, serverErrorResponse } from "@/utils/api-helpers";
import { db } from "@/lib/db";
import { courses, exams } from "@/lib/db/schema";
import { toExamDTO } from "@/utils/db-mappers";

export async function GET(req: NextRequest) {
    try {
        const { user, error: authError } = await verifyAuth(req);
        if (authError || !user) {
            return authErrorResponse(authError || 'Authentication required');
        }

        const rows = await db
            .select({
                exam: exams,
                course: {
                    id: courses.id,
                    title: courses.title,
                    description: courses.description,
                    category: courses.category,
                    level: courses.level,
                },
            })
            .from(exams)
            .leftJoin(courses, eq(courses.id, exams.courseId))
            .where(eq(exams.ownerId, user.id))
            .orderBy(desc(exams.createdAt));

        const transformed = rows.map(({ exam, course }) => {
            const count = Array.isArray(exam.exercises) ? exam.exercises.length : 0;
            return {
                ...toExamDTO(exam),
                course: course ? { ...course } : null,
                totalQuestions: count,
                estimatedDuration: count * 2, // ~2 minutes per question
            };
        });

        return successResponse({ exams: transformed }, 'Exams fetched successfully');
    } catch (error) {
        console.error('Unexpected error in GET /api/v1/exams:', error);
        return serverErrorResponse('An unexpected error occurred');
    }
}
