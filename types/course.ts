export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  instructorAvatar: string;
  thumbnail: string;
  duration: string;
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