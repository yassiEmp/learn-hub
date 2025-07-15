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
        const result = await catchErr(req.json());
        if (result.err || !result.res) {
            return errorResponse('The request body must be a valid JSON');
        }
        const body = result.res;

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
        const { err, res } = await aiClient.generateCourseMetadata(text);
        if (err || !res) {
            return errorResponse(String(err), 500);
        }
        
        const { title, description, category, level, tags , lessonTitles } = res;

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

        // 4. Call the lesson generation API to generate lessons from the course text
        //    (We do not block on this; fire-and-forget, or you can await if you want to use the result)
        const result1 = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/v1/lessons`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                content: text,
                workflow: "premium", // or use a value from the request if available
                lessonTitles,
                metadata: {
                    title,
                    description,
                    category,
                    level,
                    tags
                }
            })
        });

        console.log(await result1.json())

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