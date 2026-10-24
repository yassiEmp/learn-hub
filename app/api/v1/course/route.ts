import { after, NextRequest } from "next/server";
import { count, desc, eq } from "drizzle-orm";
import { catchErr } from "@/utils/utils";
import { verifyAuth } from "@/utils/auth/server";
import { successResponse, authErrorResponse, errorResponse, serverErrorResponse } from "@/utils/api-helpers";
import { aiClient } from "@/features/course/utils/chunkAI/ai/aiClient";
import { ingestDocument } from "@/lib/rag/ingest";
import { db } from "@/lib/db";
import { courses, lessons, type SourceType } from "@/lib/db/schema";
import { toCourseDTO } from "@/utils/db-mappers";
import { generateAndPersistLessons } from "@/features/lesson-gen/service/persist";

// Lesson generation runs in after() within this invocation.
export const maxDuration = 300;

const SOURCE_TYPES: SourceType[] = ["text", "pdf", "url", "youtube", "topic", "audio", "video"];

const capitalize = (s: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : s);

export async function POST(req: NextRequest) {
    try {
        const { user, error: authError } = await verifyAuth(req);
        if (authError || !user) {
            return authErrorResponse(authError || 'Authentication required');
        }

        const result = await catchErr(req.json());
        if (result.err || !result.res) {
            return errorResponse('The request body must be a valid JSON');
        }
        const { text, sourceType, sourceFiles } = result.res as {
            text?: unknown;
            sourceType?: unknown;
            sourceFiles?: unknown;
            style?: unknown;
        };

        if (typeof text !== 'string' || !text.trim()) {
            return errorResponse('Missing required field: text');
        }

        const type: SourceType = SOURCE_TYPES.includes(sourceType as SourceType)
            ? (sourceType as SourceType)
            : 'text';

        // 1. Course metadata (synchronous: the client needs the course row back)
        const { err, res: meta } = await aiClient.generateCourseMetadata(text);
        if (err || !meta || !Array.isArray(meta.lessonTitles) || meta.lessonTitles.length === 0) {
            if (err) console.error('Course metadata generation failed:', err);
            return errorResponse('Could not analyze this content. Try adding more text.', 422);
        }

        const lessonTitles = meta.lessonTitles.filter((t) => typeof t === 'string' && t.trim());
        const language = meta.language || 'en';

        // 2. Insert course row
        const [course] = await db
            .insert(courses)
            .values({
                ownerId: user.id,
                title: meta.title || 'Untitled course',
                description: meta.description || '',
                content: text,
                category: meta.category || 'General',
                level: capitalize(meta.level || 'beginner'),
                price: 0,
                tags: Array.isArray(meta.tags) ? meta.tags : [],
                durationMinutes: Number.isFinite(meta.durationMinutes) ? Math.round(meta.durationMinutes) : null,
                language,
                sourceType: type,
                sourceFiles: Array.isArray(sourceFiles) ? sourceFiles : [],
                status: 'generating',
                lessonsTotal: lessonTitles.length,
                lessonTitles,
            })
            .returning();

        // 3. Generate lessons + RAG ingestion after the response is sent
        after(async () => {
            try {
                await Promise.all([
                    ingestDocument({
                        text,
                        metadata: { userId: user.id, documentId: course.id, source: course.title || 'course' },
                    }).then(({ err: ingestErr, res: chunkCount }) => {
                        if (ingestErr) console.error('RAG ingestion failed for course', course.id, ingestErr);
                        else console.log(`RAG ingested ${chunkCount} chunks for course ${course.id}`);
                    }),
                    generateAndPersistLessons({
                        courseId: course.id,
                        content: text,
                        language,
                        plan: lessonTitles.map((title, position) => ({ title, position })),
                    }),
                ]);
            } catch (bgErr) {
                console.error('Background generation crashed for course', course.id, bgErr);
                await db
                    .update(courses)
                    .set({ status: 'failed', updatedAt: new Date() })
                    .where(eq(courses.id, course.id))
                    .catch((e) => console.error('Could not mark course failed', e));
            }
        });

        return successResponse(toCourseDTO(course), 'Course created successfully', 201);
    } catch (error) {
        console.error('Unexpected error in POST /api/v1/course:', error);
        return serverErrorResponse('An unexpected error occurred');
    }
}

export async function GET(req: NextRequest) {
    try {
        const { user, error: authError } = await verifyAuth(req);
        if (authError || !user) {
            return authErrorResponse(authError || 'Authentication required');
        }

        const lessonCounts = db
            .select({ courseId: lessons.courseId, n: count().as('n') })
            .from(lessons)
            .groupBy(lessons.courseId)
            .as('lesson_counts');

        const rows = await db
            .select({ course: courses, lessonsCount: lessonCounts.n })
            .from(courses)
            .leftJoin(lessonCounts, eq(lessonCounts.courseId, courses.id))
            .where(eq(courses.ownerId, user.id))
            .orderBy(desc(courses.createdAt));

        return successResponse(
            rows.map(({ course, lessonsCount }) => ({
                ...toCourseDTO(course),
                lessons_count: Number(lessonsCount ?? 0),
            })),
            'Courses fetched successfully'
        );
    } catch (error) {
        console.error('Unexpected error in GET /api/v1/course:', error);
        return serverErrorResponse('An unexpected error occurred');
    }
}
