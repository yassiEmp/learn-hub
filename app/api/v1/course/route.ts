import generateCourseAndLessons from "@/features/course/utils/generateLessons";
import { catchErr } from "@/utils/utils";
import { verifyAuth, supabaseAdmin } from "@/utils/supabase/server";
import { successResponse, authErrorResponse, errorResponse, serverErrorResponse } from "@/utils/api-helpers";
import { CreateCourseRequest, CourseResponse } from "@/types/course";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    try {
        // 1. Verify authentication
        const { user, error: authError } = await verifyAuth(req);
        
        if (authError || !user) {
            return authErrorResponse(authError || 'Authentication required');
        }

        // 2. Parse and validate request body
        const [err, body] = await catchErr(req.json());

        if (err || !body) {
            return errorResponse('The request body must be a valid JSON');
        }

        const { text, style, title, description, category, level, price, tags }: CreateCourseRequest & { text: string } = body;

        // 3. Validate required fields
        if (!text || !style) {
            return errorResponse('Missing required fields: text and style are required');
        }

        const validStyles = ["markdown", "aiGen", "chunk"];
        if (!validStyles.includes(style)) {
            return errorResponse('The style must be markdown, aiGen, or chunk');
        }

        // 4. Generate lessons and course metadata from the text
        const generatedCourse = await generateCourseAndLessons(text, style);

        // 5. Create course in database using generated or provided metadata
        const courseData = {
            title: generatedCourse.title || title , // Use provided title or generated one
            description: generatedCourse.description || description , // Use provided description or generated one
            content: text,
            owner_id: user.id,
            lessons: generatedCourse.lessons,
            category: category || 'General',
            level: level || 'Beginner',
            price: price || 0,
            tags: tags || [],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };

        const { data: course, error: dbError } = await supabaseAdmin
            .from('courses')
            .insert([courseData])
            .select()
            .single();

        if (dbError) {
            console.error('Database error:', dbError);
            return serverErrorResponse('Failed to create course');
        }

        // 6. Return success response
        return successResponse<CourseResponse>(
            course,
            'Course created successfully',
            201
        );

    } catch (error) {
        console.error('Unexpected error in POST /api/v1/course:', error);
        return serverErrorResponse('An unexpected error occurred');
    }
}

export async function GET(req: NextRequest) {
    try {
        // 1. Verify authentication
        const { user, error: authError } = await verifyAuth(req);
        
        if (authError || !user) {
            return authErrorResponse(authError || 'Authentication required');
        }

        // 2. Get courses owned by the user
        const { data: courses, error: dbError } = await supabaseAdmin
            .from('courses')
            .select('*')
            .eq('owner_id', user.id)
            .order('created_at', { ascending: false });

        if (dbError) {
            console.error('Database error:', dbError);
            return serverErrorResponse('Failed to fetch courses');
        }

        return successResponse<CourseResponse[]>(
            courses || [],
            'Courses fetched successfully'
        );

    } catch (error) {
        console.error('Unexpected error in GET /api/v1/course:', error);
        return serverErrorResponse('An unexpected error occurred');
    }
}