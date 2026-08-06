import { NextRequest } from "next/server";
import { verifyAuth, createServerClient, getTokenFromRequest } from "@/utils/supabase/server";
import { successResponse, authErrorResponse, serverErrorResponse, notFoundResponse, forbiddenResponse } from "@/utils/api-helpers";
import type { BlobFile } from "@/utils/blob-helpers";

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

        const token = getTokenFromRequest(req);
        if (!token) {
            return authErrorResponse('No authorization token provided');
        }
        const supabase = createServerClient(token);

        const { data: course, error: courseError } = await supabase
            .from('courses')
            .select('owner_id, source_files')
            .eq('id', courseId)
            .single();

        if (courseError || !course) {
            return notFoundResponse('Course not found');
        }

        if (course.owner_id !== user.id) {
            return forbiddenResponse('You do not have access to this file');
        }

        const requestedPath = decodeURIComponent(pathname.join('/'));
        const files: BlobFile[] = Array.isArray(course.source_files) ? course.source_files : [];
        const file = files.find(f => f.pathname === requestedPath);

        if (!file) {
            return notFoundResponse('File not found for this course');
        }

        return successResponse(
            { file: { ...file, downloadUrl: file.url } },
            'Download URL resolved'
        );

    } catch (error) {
        console.error('Unexpected error in GET /api/v1/course/[courseId]/files:', error);
        return serverErrorResponse('An unexpected error occurred');
    }
}
