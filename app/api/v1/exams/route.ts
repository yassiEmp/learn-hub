import { NextRequest } from "next/server";
import { verifyAuth, createServerClient, getTokenFromRequest } from "@/utils/supabase/server";
import { successResponse, authErrorResponse, serverErrorResponse } from "@/utils/api-helpers";

export async function GET(req: NextRequest) {
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

        // 3. Fetch user's exams with course information
        const { data: exams, error: examsError } = await supabase
            .from('exams')
            .select(`
                id,
                title,
                exercises,
                created_at,
                updated_at,
                course_id,
                courses (
                    id,
                    title,
                    description,
                    category,
                    level
                )
            `)
            .eq('owner_id', user.id)
            .order('created_at', { ascending: false });

        if (examsError) {
            console.error('Error fetching exams:', examsError);
            return serverErrorResponse('Failed to fetch exams');
        }

        // 4. Transform the data to include course information
        const transformedExams = exams?.map(exam => ({
            id: exam.id,
            title: exam.title,
            exercises: exam.exercises,
            created_at: exam.created_at,
            updated_at: exam.updated_at,
            course_id: exam.course_id,
            course: exam.courses && exam.courses.length > 0 ? {
                id: exam.courses[0].id,
                title: exam.courses[0].title,
                description: exam.courses[0].description,
                category: exam.courses[0].category,
                level: exam.courses[0].level
            } : null,
            // Calculate exam stats
            totalQuestions: Array.isArray(exam.exercises) ? exam.exercises.length : 0,
            estimatedDuration: Array.isArray(exam.exercises) ? exam.exercises.length * 2 : 0 // 2 minutes per question estimate
        })) || [];

        return successResponse(
            { exams: transformedExams },
            'Exams fetched successfully'
        );

    } catch (error) {
        console.error('Unexpected error in GET /api/v1/exams:', error);
        return serverErrorResponse('An unexpected error occurred');
    }
}
