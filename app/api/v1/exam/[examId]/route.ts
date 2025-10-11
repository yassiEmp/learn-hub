import { NextRequest } from "next/server";
import { verifyAuth, createServerClient, getTokenFromRequest } from "@/utils/supabase/server";
import { successResponse, authErrorResponse, serverErrorResponse, notFoundResponse } from "@/utils/api-helpers";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ examId: string }> }
) {
    const { examId } = await params;
    
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

        // 3. Fetch exam from database
        const { data: exam, error: examError } = await supabase
            .from('exams')
            .select('*')
            .eq('id', examId)
            .eq('owner_id', user.id) // Ensure user can only access their own exams
            .single();

        if (examError || !exam) {
            return notFoundResponse('Exam not found');
        }

        return successResponse(exam, 'Exam fetched successfully');

    } catch (error) {
        console.error('Unexpected error in GET /api/v1/exam/[examId]:', error);
        return serverErrorResponse('An unexpected error occurred');
    }
}
