import { after, NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { verifyAuth } from "@/utils/auth/server";
import {
    successResponse,
    authErrorResponse,
    errorResponse,
    serverErrorResponse,
    notFoundResponse,
    forbiddenResponse,
} from "@/utils/api-helpers";
import { db } from "@/lib/db";
import { courses, lessons } from "@/lib/db/schema";
import { isUuid, toCourseDTO } from "@/utils/db-mappers";
import { aiClient } from "@/features/course/utils/chunkAI/ai/aiClient";
import { generateAndPersistLessons, type PlannedLesson } from "@/features/lesson-gen/service/persist";

export const maxDuration = 300;

// A run that started longer ago than this cannot still be alive (maxDuration is 300s).
const STALE_GENERATION_MS = 6 * 60 * 1000;

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ courseId: string }> }
) {
    const { courseId } = await params;
    try {
        const { user, error: authError } = await verifyAuth(req);
        if (authError || !user) {
            return authErrorResponse(authError || 'Authentication required');
        }
        if (!isUuid(courseId)) return notFoundResponse('Course not found');

        const [course] = await db.select().from(courses).where(eq(courses.id, courseId)).limit(1);
        if (!course) return notFoundResponse('Course not found');
        if (course.ownerId !== user.id) {
            return forbiddenResponse('You do not have permission to modify this course');
        }

        const existing = await db
            .select({ position: lessons.position, title: lessons.title })
            .from(lessons)
            .where(eq(lessons.courseId, courseId));

        const incomplete = existing.length < course.lessonsTotal || course.lessonsTotal === 0;
        if (course.status !== 'failed' && !incomplete) {
            return errorResponse('This course has no missing lessons to generate', 409);
        }
        if (
            course.status === 'generating' &&
            Date.now() - new Date(course.updatedAt).getTime() < STALE_GENERATION_MS
        ) {
            return errorResponse('Lessons are still being generated for this course', 409);
        }

        const [updated] = await db
            .update(courses)
            .set({ status: 'generating', updatedAt: new Date() })
            .where(eq(courses.id, courseId))
            .returning();

        after(async () => {
            try {
                // Prefer the planned titles; only courses created before they were stored re-derive them.
                let freshTitles = course.lessonTitles ?? [];
                let err: unknown = null;
                if (freshTitles.length === 0) {
                    const derived = await aiClient.generateCourseMetadata(course.content);
                    err = derived.err;
                    freshTitles = (derived.res?.lessonTitles ?? []).filter((t) => typeof t === 'string' && t.trim());
                }

                if (err || freshTitles.length === 0) {
                    console.error('Retry: could not derive lesson titles for course', courseId, err);
                    await db
                        .update(courses)
                        .set({ status: existing.length > 0 ? 'ready' : 'failed', updatedAt: new Date() })
                        .where(eq(courses.id, courseId));
                    return;
                }

                let plan: PlannedLesson[];
                if (existing.length === 0) {
                    plan = freshTitles.map((title, position) => ({ title, position }));
                    if (freshTitles.length !== course.lessonsTotal) {
                        await db
                            .update(courses)
                            .set({ lessonsTotal: freshTitles.length, lessonTitles: freshTitles })
                            .where(eq(courses.id, courseId));
                    }
                } else {
                    const taken = new Set(existing.map((l) => l.position));
                    const usedTitles = new Set(existing.map((l) => l.title.trim().toLowerCase()));
                    const candidates = freshTitles.filter((t) => !usedTitles.has(t.trim().toLowerCase()));
                    const missing: number[] = [];
                    for (let p = 0; p < course.lessonsTotal; p++) if (!taken.has(p)) missing.push(p);

                    plan = [];
                    for (const position of missing) {
                        const preferred = freshTitles[position];
                        let title: string | undefined;
                        if (preferred && candidates.includes(preferred)) {
                            title = preferred;
                        } else {
                            title = candidates[0];
                        }
                        if (!title) break;
                        candidates.splice(candidates.indexOf(title), 1);
                        plan.push({ title, position });
                    }
                }

                await generateAndPersistLessons({
                    courseId,
                    content: course.content,
                    language: course.language || 'en',
                    plan,
                });
            } catch (bgErr) {
                console.error('Retry generation crashed for course', courseId, bgErr);
                await db
                    .update(courses)
                    .set({ status: 'failed', updatedAt: new Date() })
                    .where(eq(courses.id, courseId))
                    .catch((e) => console.error('Could not mark course failed', e));
            }
        });

        return successResponse(toCourseDTO(updated), 'Lesson generation restarted');
    } catch (error) {
        console.error('Unexpected error in POST /api/v1/course/[courseId]/retry:', error);
        return serverErrorResponse('An unexpected error occurred');
    }
}
