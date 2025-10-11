import { NextRequest } from "next/server";
import { verifyAuth, createServerClient, getTokenFromRequest } from "@/utils/supabase/server";
import { successResponse, authErrorResponse, serverErrorResponse, notFoundResponse } from "@/utils/api-helpers";
import { createExam } from "@/features/exam/utils/createExam";

export async function POST(
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

        // 2. Create Supabase client
        const token = getTokenFromRequest(req);
        if (!token) {
            return authErrorResponse('No authorization token provided');
        }
        const supabase = createServerClient(token);

        // 3. Fetch course with lessons
        const { data: course, error: courseError } = await supabase
            .from('courses')
            .select('*')
            .eq('id', courseId)
            .single();

        if (courseError || !course) {
            return notFoundResponse('Course not found');
        }

        // 4. Fetch lessons
        const { data: lessons } = await supabase
            .from('Lesson')
            .select('content')
            .eq('courseId', courseId);

        // 5. Combine course and lesson content for exam generation
        const combinedContent = `${course.title}\n\n${course.description}\n\n${
            lessons?.map(l => l.content).join('\n\n') || ''
        }`;

        // 6. Generate exam using AI
        const generatedExam = await createExam(combinedContent);

        if (generatedExam.id === "dummy-exam-retry") {
            return serverErrorResponse('Exam generation failed. Please try again.');
        }

        // 7. Save exam to database
        const { data: savedExam, error: saveError } = await supabase
            .from('exams')
            .insert({
                owner_id: user.id,
                course_id: courseId,
                title: generatedExam.title,
                exercises: generatedExam.exercises
            })
            .select()
            .single();

        if (saveError) {
            console.error('Error saving exam:', saveError);
            return serverErrorResponse('Failed to save exam');
        }

        return successResponse(
            { exam: savedExam },
            'Exam created successfully'
        );

    } catch (error) {
        console.error('Unexpected error in POST /api/v1/course/[courseId]/exam:', error);
        return serverErrorResponse('An unexpected error occurred');
    }
}
