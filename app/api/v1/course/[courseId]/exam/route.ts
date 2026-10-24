import { NextRequest } from "next/server";
import { asc, eq } from "drizzle-orm";
import { verifyAuth } from "@/utils/auth/server";
import {
    successResponse,
    authErrorResponse,
    serverErrorResponse,
    notFoundResponse,
    forbiddenResponse,
} from "@/utils/api-helpers";
import { createExam } from "@/features/exam/utils/createExam";
import { retrieveChunks, chunksToContext } from "@/lib/rag/retrieve";
import { db } from "@/lib/db";
import { courses, exams, lessons } from "@/lib/db/schema";
import { isUuid, toExamDTO } from "@/utils/db-mappers";

export const maxDuration = 120;

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ courseId: string }> }
) {
    const { courseId } = await params;

    try {
        const { user, error: authError } = await verifyAuth(req);
        if (authError || !user) {
            return authErrorResponse(authError || 'Authentication required');
        }
        if (!isUuid(courseId)) return notFoundResponse('Course not found');

        const [course] = await db.select().from(courses).where(eq(courses.id, courseId)).limit(1);
        if (!course) return notFoundResponse('Course not found');
        if (course.ownerId !== user.id && !course.isPublic) {
            return forbiddenResponse('You do not have permission to use this course');
        }

        // Grounding: retrieved chunks -> lesson contents -> full source text.
        const retrievalQuery = `${course.title}\n\n${course.description}`;
        const { err: retrieveErr, res: chunks } = await retrieveChunks({
            query: retrievalQuery,
            documentId: courseId,
        });
        if (retrieveErr) {
            console.error('RAG retrieval failed for course', courseId, retrieveErr);
        }

        let grounding = '';
        if (chunks?.length) {
            grounding = chunksToContext(chunks);
        } else {
            const lessonRows = await db
                .select({ content: lessons.content })
                .from(lessons)
                .where(eq(lessons.courseId, courseId))
                .orderBy(asc(lessons.position));
            grounding = lessonRows.map((l) => l.content).filter(Boolean).join('\n\n');
        }
        if (!grounding.trim()) grounding = course.content;

        const examContent = `${retrievalQuery}\n\n${grounding}`;

        console.log(
            `Exam for course ${courseId}: ${chunks?.length ?? 0} retrieved chunks, ` +
            `top similarity ${chunks?.[0]?.similarity?.toFixed(3) ?? 'n/a'}`
        );

        const generatedExam = await createExam(examContent);
        if (generatedExam.id === "dummy-exam-retry") {
            return serverErrorResponse('Exam generation failed. Please try again.');
        }

        const [savedExam] = await db
            .insert(exams)
            .values({
                ownerId: user.id,
                courseId,
                title: generatedExam.title,
                exercises: generatedExam.exercises,
            })
            .returning();

        return successResponse({ exam: toExamDTO(savedExam) }, 'Exam created successfully');
    } catch (error) {
        console.error('Unexpected error in POST /api/v1/course/[courseId]/exam:', error);
        return serverErrorResponse('An unexpected error occurred');
    }
}
