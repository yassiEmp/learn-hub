import type { CourseRow, ExamRow, LessonRow } from "@/lib/db/schema";

// API responses use snake_case keys; the Drizzle rows are camelCase.

const iso = (d: Date | string | null | undefined) =>
  d instanceof Date ? d.toISOString() : d ?? null;

export type CourseDTO = {
  id: string;
  title: string;
  description: string;
  owner_id: string;
  content: string;
  category: string;
  level: string;
  price: number;
  tags: string[];
  duration_minutes: number | null;
  language: string;
  source_type: string;
  source_files: unknown[];
  is_public: boolean;
  status: string;
  lessons_total: number;
  created_at: string | null;
  updated_at: string | null;
};

export type LessonDTO = {
  id: string;
  title: string;
  content: string;
  summary: string | null;
  objectives: string[] | null;
  resources: string[] | null;
  position: number;
};

export type ExamDTO = {
  id: string;
  title: string;
  exercises: unknown;
  course_id: string | null;
  owner_id: string;
  created_at: string | null;
  updated_at: string | null;
};

export function toCourseDTO(c: CourseRow): CourseDTO {
  return {
    id: c.id,
    title: c.title,
    description: c.description,
    owner_id: c.ownerId,
    content: c.content,
    category: c.category,
    level: c.level,
    price: c.price,
    tags: c.tags ?? [],
    duration_minutes: c.durationMinutes ?? null,
    language: c.language,
    source_type: c.sourceType,
    source_files: c.sourceFiles ?? [],
    is_public: c.isPublic,
    status: c.status,
    lessons_total: c.lessonsTotal,
    created_at: iso(c.createdAt),
    updated_at: iso(c.updatedAt),
  };
}

export function toLessonDTO(l: LessonRow): LessonDTO {
  return {
    id: l.id,
    title: l.title,
    content: l.content,
    summary: l.summary ?? null,
    objectives: l.objectives ?? null,
    resources: l.resources ?? null,
    position: l.position,
  };
}

export function toExamDTO(e: ExamRow): ExamDTO {
  return {
    id: e.id,
    title: e.title,
    exercises: e.exercises,
    course_id: e.courseId ?? null,
    owner_id: e.ownerId,
    created_at: iso(e.createdAt),
    updated_at: iso(e.updatedAt),
  };
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Route params are user input; a non-uuid would make Postgres throw. */
export const isUuid = (v: unknown): v is string => typeof v === "string" && UUID_RE.test(v);
