import "server-only";
import { and, count, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { courses, lessons } from "@/lib/db/schema";
import { generateLessons } from "./index";
import type { Lesson, LessonWorkflow } from "./types";

export type PlannedLesson = { title: string; position: number };

export type PersistLessonsInput = {
  courseId: string;
  content: string;
  language: string;
  plan: PlannedLesson[];
  workflow?: LessonWorkflow;
};

const CONCURRENCY = 2;

async function generateOne(
  content: string,
  title: string,
  language: string,
  workflow: LessonWorkflow
): Promise<Lesson | null> {
  for await (const { err, res } of generateLessons({
    content,
    workflow,
    lessonTitles: [title],
    language,
  })) {
    if (!err && res) return res;
  }
  return null;
}

/** Number of lessons currently stored for a course. */
export async function countLessons(courseId: string): Promise<number> {
  const [row] = await db
    .select({ n: count() })
    .from(lessons)
    .where(eq(lessons.courseId, courseId));
  return Number(row?.n ?? 0);
}

async function setStatus(courseId: string, status: "ready" | "failed" | "generating") {
  await db
    .update(courses)
    .set({ status, updatedAt: new Date() })
    .where(eq(courses.id, courseId));
}

/**
 * Generate the planned lessons for a course and insert each one as soon as it is
 * produced, then mark the course 'ready' (or 'failed' when it has no lessons).
 * Never throws: any crash marks the course 'failed'. Meant to run inside after().
 */
export async function generateAndPersistLessons({
  courseId,
  content,
  language,
  plan,
  workflow = "premium",
}: PersistLessonsInput): Promise<{ inserted: number }> {
  let inserted = 0;
  try {
    for (let i = 0; i < plan.length; i += CONCURRENCY) {
      const batch = plan.slice(i, i + CONCURRENCY);
      await Promise.all(
        batch.map(async ({ title, position }) => {
          try {
            const lesson = await generateOne(content, title, language || "en", workflow);
            if (!lesson) {
              console.error(`Lesson generation returned nothing for "${title}" (course ${courseId})`);
              return;
            }
            // Skip if a concurrent run already filled this slot.
            const existing = await db
              .select({ id: lessons.id })
              .from(lessons)
              .where(and(eq(lessons.courseId, courseId), eq(lessons.position, position)))
              .limit(1);
            if (existing.length > 0) return;

            await db.insert(lessons).values({
              courseId,
              position,
              title: lesson.title || title,
              content: lesson.content ?? "",
              summary: lesson.summary ?? null,
              objectives: lesson.objectives ?? null,
              resources: lesson.resources ?? null,
            });
            inserted++;
          } catch (err) {
            console.error(`Failed to generate/insert lesson "${title}" for course ${courseId}:`, err);
          }
        })
      );
    }

    const total = await countLessons(courseId);
    await setStatus(courseId, total > 0 ? "ready" : "failed");
  } catch (err) {
    console.error(`Lesson generation crashed for course ${courseId}:`, err);
    try {
      await setStatus(courseId, "failed");
    } catch (statusErr) {
      console.error(`Could not mark course ${courseId} as failed:`, statusErr);
    }
  }
  return { inserted };
}
