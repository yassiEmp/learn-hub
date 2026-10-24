import { NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { verifyAuth } from "@/utils/auth/server";
import { successResponse, authErrorResponse, serverErrorResponse, notFoundResponse, forbiddenResponse } from "@/utils/api-helpers";
import type { BlobFile } from "@/utils/blob-helpers";
import { db } from "@/lib/db";
import { courses } from "@/lib/db/schema";
import { isUuid } from "@/utils/db-mappers";

/**
 * Resolve a download URL for one source file of a course.
 *
 * Blob pathnames contain slashes, so the segment is a catch-all and is rejoined.
 */
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ courseId: string; pathname: string[] }> }
) {
    const { courseId, pathname } = await params;

    try {
        const { user, error: authError } = await verifyAuth(req);
        if (authError || !user) {
            return authErrorResponse(authError || 'Authentication required');
        }
        if (!isUuid(courseId)) return notFoundResponse('Course not found');

        const [course] = await db
            .select({ ownerId: courses.ownerId, isPublic: courses.isPublic, sourceFiles: courses.sourceFiles })
            .from(courses)
            .where(eq(courses.id, courseId))
            .limit(1);

        if (!course) return notFoundResponse('Course not found');
        if (course.ownerId !== user.id && !course.isPublic) {
            return forbiddenResponse('You do not have access to this file');
        }

        const requestedPath = decodeURIComponent(pathname.join('/'));
        const files = (Array.isArray(course.sourceFiles) ? course.sourceFiles : []) as BlobFile[];
        const file = files.find(f => f?.pathname === requestedPath);

        if (!file) return notFoundResponse('File not found for this course');

        return successResponse(
            { file: { ...file, downloadUrl: file.url } },
            'Download URL resolved'
        );
    } catch (error) {
        console.error('Unexpected error in GET /api/v1/course/[courseId]/files:', error);
        return serverErrorResponse('An unexpected error occurred');
    }
}
