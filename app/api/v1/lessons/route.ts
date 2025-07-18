import { authErrorResponse, errorResponse } from "@/utils/api-helpers";
import { verifyAuth } from "@/utils/supabase/server";
import { catchErr } from "@/utils/utils";
import { NextRequest } from "next/server";
import { generateLessons } from "@/features/lesson-gen/service";
import { getTokenFromRequest, createServerClient } from "@/utils/supabase/server";
import { Lesson } from "@/features/lesson-gen/service/types";

export async function POST(req: NextRequest) {
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
  const { content , lessonTitles , courseId, documentId , language } = body;
  if (!content || !lessonTitles) {
    return errorResponse('Missing required fields: content and lessonTitles are missing');
  }

  // 3. Create Supabase client with user token
  const token = getTokenFromRequest(req);
  if (!token) {
    return authErrorResponse('No authorization token provided');
  }
  const supabase = createServerClient(token);

  // 4. Generate and insert lessons one by one
  const workflow = "premium";
  const lessons: Lesson[] = [];
  for await (const { err, res: lesson } of generateLessons({ content, workflow , lessonTitles , language })) {
    if (err || !lesson) continue;
    const { title, content: lessonContent, summary, objectives, resources } = lesson;
    const { error: dbError, data } = await supabase
      .from('Lesson')
      .insert([{
        title,
        content: lessonContent,
        summary: summary || null,
        objectives: objectives || null,
        resources: resources || null,
        courseId: courseId || null,
        documentId: documentId || null,
        // created_at is auto, id is auto
      }])
      .select()
      .single();
    if (dbError){
        console.log("error while adding the lesson to the data base : ", dbError)
        continue
    };
    lessons.push(data as Lesson);
  }

  return new Response(JSON.stringify(lessons), { status: 200, headers: { 'Content-Type': 'application/json' } });
}