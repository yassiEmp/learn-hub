// import generateCourseAndLessons from "@/features/course/utils/generateLessons";
import { catchErr } from "@/utils/utils";
import { verifyAuth, createServerClient, getTokenFromRequest } from "@/utils/supabase/server";
import { successResponse, authErrorResponse, errorResponse, serverErrorResponse } from "@/utils/api-helpers";
import { CreateCourseRequest, CourseResponse } from "@/types/course";
import { NextRequest } from "next/server";
import { aiClient } from "@/features/course/utils/chunkAI/ai/aiClient";

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

        const { text, style }: CreateCourseRequest & { text: string } = body;

        // 3. Validate required fields
        if (!text || !style) {
            return errorResponse('Missing required fields: text and style are required');
        }

        // const validStyles = ["markdown", "aiGen", "chunk"];
        // if (!validStyles.includes(style)) {
        //     return errorResponse('The style must be markdown, aiGen, or chunk');
        // }

        // 1. Generate course metadata using AI
        const metadata = await aiClient.generateCourseMetadata(text);
        const { title, description, category, level, tags } = metadata;

        console.log( "title: ",title, " description: ",description, " category: ",category, " level: ",level , " tags: ", tags )

        // 5. Create course in database using generated or provided metadata
        const courseData = {
            title: title , // Use provided title or generated one
            description: description , // Use provided description or generated one
            content: text,
            owner_id: user.id,
            category: category || 'General',
            level: level || 'Beginner',
            price: 0,
            tags: tags || [],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };

        // Use the user's token to create a user-bound Supabase client
        const token = getTokenFromRequest(req);
        if (!token) {
            return authErrorResponse('No authorization token provided');
        }
        const supabase = createServerClient(token);

        const { data: course, error: dbError } = await supabase
            .from('courses')
            .insert([courseData])
            .select()
            .single();

        if (dbError) {
            console.error('Database error:', dbError);
            return serverErrorResponse('Failed to create course');
        }

        // // 4. Generate lessons and course metadata from the text
        // const generateLesson = await generateLessons(text, style);

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
        const token = getTokenFromRequest(req);
        if (!token) {
            return authErrorResponse('No authorization token provided');
        }
        const supabase = createServerClient(token);

        const { data: courses, error: dbError } = await supabase
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