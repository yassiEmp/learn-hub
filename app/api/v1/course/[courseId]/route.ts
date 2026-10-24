import { NextRequest } from "next/server";
import { and, asc, eq } from "drizzle-orm";
import { verifyAuth } from "@/utils/auth/server";
import {
    successResponse,
    authErrorResponse,
    errorResponse,
    serverErrorResponse,
    notFoundResponse,
    forbiddenResponse,
} from "@/utils/api-helpers";
import { db } from "@/lib/db";
import { courses, lessons } from "@/lib/db/schema";
import { isUuid, toCourseDTO, toLessonDTO } from "@/utils/db-mappers";
import { catchErr } from "@/utils/utils";

type Params = { params: Promise<{ courseId: string }> };

export async function GET(req: NextRequest, { params }: Params) {
    const { courseId } = await params;
    try {
        const { user, error: authError } = await verifyAuth(req);
        if (authError || !user) {
            return authErrorResponse(authError || 'Authentication required');
        }
        if (!isUuid(courseId)) return notFoundResponse('Course not found');

        const [course] = await db.select().from(courses).where(eq(courses.id, courseId)).limit(1);
        if (!course) return notFoundResponse('Course not found');

        const isOwner = course.ownerId === user.id;
        if (!isOwner && !course.isPublic) {
            return forbiddenResponse('You do not have permission to view this course');
        }

        const lessonRows = await db
            .select()
            .from(lessons)
            .where(eq(lessons.courseId, courseId))
            .orderBy(asc(lessons.position), asc(lessons.createdAt));

        return successResponse(
            {
                ...toCourseDTO(course),
                lessons: lessonRows.map(toLessonDTO),
                is_owner: isOwner,
            },
            'Course fetched successfully'
        );
    } catch (error) {
        console.error('Unexpected error in GET /api/v1/course/[courseId]:', error);
        return serverErrorResponse('An unexpected error occurred');
    }
}

export async function PUT(req: NextRequest, { params }: Params) {
    const { courseId } = await params;
    try {
        const { user, error: authError } = await verifyAuth(req);
        if (authError || !user) {
            return authErrorResponse(authError || 'Authentication required');
        }
        if (!isUuid(courseId)) return notFoundResponse('Course not found');

        const parsed = await catchErr(req.json());
        if (parsed.err || !parsed.res || typeof parsed.res !== 'object') {
            return errorResponse('The request body must be a valid JSON');
        }
        const body = parsed.res as Record<string, unknown>;
        const str = (v: unknown) => (typeof v === 'string' && v.trim() ? v : undefined);

        const isPublic = body.is_public ?? body.isPublic;
        const update: Partial<typeof courses.$inferInsert> = {
            ...(str(body.title) && { title: str(body.title) }),
            ...(str(body.description) && { description: str(body.description) }),
            ...(str(body.content) && { content: str(body.content) }),
            ...(str(body.category) && { category: str(body.category) }),
            ...(str(body.level) && { level: str(body.level) }),
            ...(typeof body.price === 'number' && { price: Math.max(0, Math.round(body.price)) }),
            ...(Array.isArray(body.tags) && { tags: body.tags.filter((t): t is string => typeof t === 'string') }),
            ...(typeof isPublic === 'boolean' && { isPublic }),
            updatedAt: new Date(),
        };

        const [updated] = await db
            .update(courses)
            .set(update)
            .where(and(eq(courses.id, courseId), eq(courses.ownerId, user.id)))
            .returning();

        if (!updated) {
            const [exists] = await db.select({ id: courses.id }).from(courses).where(eq(courses.id, courseId)).limit(1);
            return exists
                ? forbiddenResponse('You do not have permission to update this course')
                : notFoundResponse('Course not found');
        }

        return successResponse(toCourseDTO(updated), 'Course updated successfully');
    } catch (error) {
        console.error('Unexpected error in PUT /api/v1/course/[courseId]:', error);
        return serverErrorResponse('An unexpected error occurred');
    }
}

export async function DELETE(req: NextRequest, { params }: Params) {
    const { courseId } = await params;
    try {
        const { user, error: authError } = await verifyAuth(req);
        if (authError || !user) {
            return authErrorResponse(authError || 'Authentication required');
        }
        if (!isUuid(courseId)) return notFoundResponse('Course not found');

        // Lessons, exams and document chunks cascade.
        const deleted = await db
            .delete(courses)
            .where(and(eq(courses.id, courseId), eq(courses.ownerId, user.id)))
            .returning({ id: courses.id });

        if (deleted.length === 0) {
            const [exists] = await db.select({ id: courses.id }).from(courses).where(eq(courses.id, courseId)).limit(1);
            return exists
                ? forbiddenResponse('You do not have permission to delete this course')
                : notFoundResponse('Course not found');
        }

        return successResponse(null, 'Course deleted successfully');
    } catch (error) {
        console.error('Unexpected error in DELETE /api/v1/course/[courseId]:', error);
        return serverErrorResponse('An unexpected error occurred');
    }
}
