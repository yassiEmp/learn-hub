import { NextRequest } from "next/server";
import { verifyAuth, supabaseAdmin } from "@/utils/supabase/server";
import { successResponse, authErrorResponse, serverErrorResponse, notFoundResponse, forbiddenResponse } from "@/utils/api-helpers";
import { CreateCourseRequest, CourseResponse } from "@/types/course";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ courseId: string }> }
) {
    const { courseId } = await params;
    
    try {
        // 1. Verify authentication
        const { user, error: authError } = await verifyAuth(req);
        
        if (authError || !user) {
            return authErrorResponse(authError || 'Authentication required');
        }

        // 2. Get course from database
        const { data: course, error: dbError } = await supabaseAdmin
            .from('courses')
            .select('*')
            .eq('id', courseId)
            .single();

        if (dbError) {
            if (dbError.code === 'PGRST116') {
                return notFoundResponse('Course not found');
            }
            console.error('Database error:', dbError);
            return serverErrorResponse('Failed to fetch course');
        }

        // 3. Check ownership (only owner can view their own courses)
        if (course.owner_id !== user.id) {
            return forbiddenResponse('You do not have permission to view this course');
        }

        return successResponse<CourseResponse>(
            course,
            'Course fetched successfully'
        );

    } catch (error) {
        console.error('Unexpected error in GET /api/v1/course/[courseId]:', error);
        return serverErrorResponse('An unexpected error occurred');
    }
}

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ courseId: string }> }
) {
    const { courseId } = await params;
    
    try {
        // 1. Verify authentication
        const { user, error: authError } = await verifyAuth(req);
        
        if (authError || !user) {
            return authErrorResponse(authError || 'Authentication required');
        }

        // 2. Get course to check ownership
        const { data: existingCourse, error: fetchError } = await supabaseAdmin
            .from('courses')
            .select('owner_id')
            .eq('id', courseId)
            .single();

        if (fetchError) {
            if (fetchError.code === 'PGRST116') {
                return notFoundResponse('Course not found');
            }
            console.error('Database error:', fetchError);
            return serverErrorResponse('Failed to fetch course');
        }

        // 3. Check ownership
        if (existingCourse.owner_id !== user.id) {
            return forbiddenResponse('You do not have permission to update this course');
        }

        // 4. Parse request body
        const body = await req.json();
        const { title, description, content, category, level, price, tags }: Partial<CreateCourseRequest> = body;

        // 5. Update course
        const updateData = {
            ...(title && { title }),
            ...(description && { description }),
            ...(content && { content }),
            ...(category && { category }),
            ...(level && { level }),
            ...(price !== undefined && { price }),
            ...(tags && { tags }),
            updated_at: new Date().toISOString()
        };

        const { data: updatedCourse, error: updateError } = await supabaseAdmin
            .from('courses')
            .update(updateData)
            .eq('id', courseId)
            .select()
            .single();

        if (updateError) {
            console.error('Update error:', updateError);
            return serverErrorResponse('Failed to update course');
        }

        return successResponse<CourseResponse>(
            updatedCourse,
            'Course updated successfully'
        );

    } catch (error) {
        console.error('Unexpected error in PUT /api/v1/course/[courseId]:', error);
        return serverErrorResponse('An unexpected error occurred');
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ courseId: string }> }
) {
    const { courseId } = await params;
    
    try {
        // 1. Verify authentication
        const { user, error: authError } = await verifyAuth(req);
        
        if (authError || !user) {
            return authErrorResponse(authError || 'Authentication required');
        }

        // 2. Get course to check ownership
        const { data: existingCourse, error: fetchError } = await supabaseAdmin
            .from('courses')
            .select('owner_id')
            .eq('id', courseId)
            .single();

        if (fetchError) {
            if (fetchError.code === 'PGRST116') {
                return notFoundResponse('Course not found');
            }
            console.error('Database error:', fetchError);
            return serverErrorResponse('Failed to fetch course');
        }

        // 3. Check ownership
        if (existingCourse.owner_id !== user.id) {
            return forbiddenResponse('You do not have permission to delete this course');
        }

        // 4. Delete course
        const { error: deleteError } = await supabaseAdmin
            .from('courses')
            .delete()
            .eq('id', courseId);

        if (deleteError) {
            console.error('Delete error:', deleteError);
            return serverErrorResponse('Failed to delete course');
        }

        return successResponse(
            null,
            'Course deleted successfully'
        );

    } catch (error) {
        console.error('Unexpected error in DELETE /api/v1/course/[courseId]:', error);
        return serverErrorResponse('An unexpected error occurred');
    }
} 