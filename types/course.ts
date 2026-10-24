export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  instructorAvatar: string;
  thumbnail: string;
  duration: string;
  durationMinutes?: number;
  lessonsCount: number;
  studentsCount: number;
  rating: number;
  price: number;
  originalPrice?: number;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  tags: string[];
  content?: string;
  lessons: Lesson[];
  isEnrolled?: boolean;
  progress?: number;
  // Database fields
  owner_id: string;
  created_at?: string;
  updated_at?: string;
}

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  videoUrl: string;
  content?: string;
  summary?: string;
  objectives?: string[];
  resources?: string[];
  isCompleted?: boolean;
  isCurrent?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  enrolledCourses: string[];
}

// Database course creation interface
export interface CreateCourseRequest {
  title: string;
  description: string;
  content: string;
  style: 'markdown' | 'aiGen' | 'chunk';
  category?: string;
  level?: 'Beginner' | 'Intermediate' | 'Advanced';
  price?: number;
  tags?: string[];
}

// Database course response interface
export interface CourseResponse {
  id: string;
  title: string;
  description: string;
  owner_id: string;
  content: string;
  lessons: Lesson[];
  category?: string;
  level?: string;
  price?: number;
  tags?: string[];
  created_at: string;
  updated_at: string;
}

// ---------------------------------------------------------------------------
// API shapes (Neon + Drizzle backend). Snake_case mirrors the JSON returned by
// /api/v1/course, /api/v1/course/[id], /api/v1/exams and /api/v1/exam/[id].
// ---------------------------------------------------------------------------

export type CourseStatus = 'generating' | 'ready' | 'failed';

export type SourceType = 'text' | 'pdf' | 'url' | 'youtube' | 'topic' | 'audio' | 'video';

export interface SourceFile {
  url: string;
  pathname?: string;
  type: string;
  filename: string;
  size: number;
  uploadedAt: string;
}

export interface ApiCourse {
  id: string;
  title: string;
  description: string | null;
  owner_id: string;
  content?: string | null;
  category: string | null;
  level: string | null;
  price?: number | null;
  tags: string[] | null;
  duration_minutes: number | null;
  language?: string | null;
  source_type?: SourceType | string | null;
  source_files?: SourceFile[] | null;
  is_public?: boolean;
  status: CourseStatus;
  lessons_total: number | null;
  lessons_count: number | null;
  created_at: string;
  updated_at: string;
}

export interface ApiLesson {
  id: string;
  title: string;
  content: string | null;
  summary: string | null;
  objectives: string[] | null;
  resources: string[] | null;
  position: number;
}

export interface CourseWithLessons extends ApiCourse {
  lessons: ApiLesson[];
  is_owner: boolean;
}

export interface ExamListItem {
  id: string;
  title: string;
  exercises?: unknown[];
  course_id: string | null;
  course: {
    id: string;
    title: string;
    description?: string | null;
    category?: string | null;
    level?: string | null;
  } | null;
  totalQuestions?: number;
  estimatedDuration?: number;
  created_at: string;
  updated_at?: string;
}
