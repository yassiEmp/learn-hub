import { useEffect, useState, useMemo, useRef } from 'react';
import { courseApi } from '@/utils/api-client';
import { Course, Lesson, CourseResponse } from '@/types/course';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';

interface UseCoursesResult {
  courses: Course[];
  categories: string[];
  loading: boolean;
  error: string | null;
}

export function useCourses(): UseCoursesResult {
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<string[]>(['All']);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  
  // Use ref to track if we've already fetched courses to prevent unnecessary re-fetches
  const hasFetched = useRef(false);
  const lastUserId = useRef<string | null>(null);

  useEffect(() => {
    // Only fetch if we haven't fetched before or if the user has changed
    const currentUserId = user?.id || null;
    if (hasFetched.current && lastUserId.current === currentUserId) {
      return;
    }
    
    setLoading(true);
    courseApi.getAll()
      .then(async (data: CourseResponse[]) => {
        // 1. Collect all unique course IDs and owner_ids
        const courseIds = data.map((c) => c.id);
        const ownerIds = Array.from(new Set(data.map((c) => c.owner_id).filter(Boolean)));

        // 2. Fetch all lessons for these courses
        const lessonsByCourse: Record<string, Lesson[]> = {};
        if (courseIds.length > 0) {
          const { data: lessonsData, error: lessonsError } = await supabase
            .from('Lesson')
            .select('*')
            .in('courseId', courseIds);
          if (!lessonsError && lessonsData) {
            for (const l of lessonsData) {
              const lesson: Lesson = {
                id: l.id?.toString() ?? '',
                title: l.title,
                duration: l.duration || '',
                videoUrl: l.videoUrl || '',
                content: l.content || '',
                summary: l.summary || '',
                objectives: l.objectives || [],
                resources: l.resources || [],
                isCompleted: false,
                isCurrent: false,
              };
              if (!lessonsByCourse[l.courseId]) lessonsByCourse[l.courseId] = [];
              lessonsByCourse[l.courseId].push(lesson);
            }
          }
        }

        // 3. Fetch all instructor profiles
        const instructorMap: Record<string, { full_name: string; avatar_url: string }> = {};
        if (ownerIds.length > 0) {
          const { data: profiles, error: profileError } = await supabase
            .from('user_profiles')
            .select('id, full_name, avatar_url')
            .in('id', ownerIds);
          if (!profileError && profiles) {
            for (const profile of profiles) {
              instructorMap[profile.id] = {
                full_name: profile.full_name || 'Unknown',
                avatar_url: profile.avatar_url || '',
              };
            }
          }
        }

        // 4. Fetch all enrollments for the current user
        const enrollmentsByCourse: Record<string, { progress: number }> = {};
        if (user && courseIds.length > 0) {
          const { data: enrollmentsData, error: enrollmentsError } = await supabase
            .from('enrollments')
            .select('course_id, progress')
            .eq('user_id', user.id)
            .in('course_id', courseIds);
          if (!enrollmentsError && enrollmentsData) {
            for (const e of enrollmentsData) {
              enrollmentsByCourse[e.course_id] = { progress: e.progress ?? 0 };
            }
          }
        }

        // 5. Compose full Course objects
        setCourses(data.map((c: CourseResponse) => {
          const instructor = instructorMap[c.owner_id]?.full_name ?? 'Unknown';
          let instructorAvatar = instructorMap[c.owner_id]?.avatar_url ?? '';
          if (!instructorAvatar && instructor && instructor !== 'Unknown') {
            const initials = instructor.split(' ').map((n: string) => n[0]).join('').toUpperCase();
            instructorAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=random`;
          }
          const lessons: Lesson[] = lessonsByCourse[c.id] || [];
          const enrollment = enrollmentsByCourse[c.id];
          // Type guards for extra fields
          const thumbnail = 'thumbnail' in c ? (c as { thumbnail?: string }).thumbnail ?? '' : '';
          const duration = 'duration' in c ? (c as { duration?: string }).duration ?? '' : '';
          const durationMinutes = 'duration_minutes' in c && typeof (c as { duration_minutes?: number }).duration_minutes === 'number'
            ? Math.round((c as { duration_minutes: number }).duration_minutes)
            : undefined;
          const studentsCount = 'studentsCount' in c ? (c as { studentsCount?: number }).studentsCount ?? lessons.length : lessons.length;
          const rating = 'rating' in c ? (c as { rating?: number }).rating ?? 5 : 5;
          const originalPrice = 'originalPrice' in c ? (c as { originalPrice?: number }).originalPrice ?? 0 : 0;
          return {
            id: c.id,
            title: c.title,
            description: c.description,
            instructor,
            instructorAvatar,
            thumbnail,
            duration,
            durationMinutes,
            lessonsCount: lessons.length,
            studentsCount,
            rating,
            price: c.price ?? 0,
            originalPrice,
            category: c.category ?? 'General',
            level: c.level ? (c.level.charAt(0).toUpperCase() + c.level.slice(1)) as Course['level'] : 'Beginner',
            tags: c.tags ?? [],
            content: c.content ?? '',
            lessons,
            isEnrolled: enrollment !== undefined,
            progress: enrollment?.progress ?? 0,
            owner_id: c.owner_id,
            created_at: c.created_at,
            updated_at: c.updated_at,
          };
        }));
        const cats = Array.from(new Set(data.map((c: CourseResponse) => c.category || 'Uncategorized')));
        setCategories(['All', ...cats]);
        setLoading(false);
        
        // Mark as fetched and update user tracking
        hasFetched.current = true;
        lastUserId.current = currentUserId;
      })
      .catch((err: unknown) => {
        setError(err?.toString() || 'Failed to load courses');
        setLoading(false);
      });
  }, [user]); // Depend on user object for proper effect triggering

  // Memoize the return object to prevent unnecessary re-renders
  return useMemo(() => ({
    courses,
    categories,
    loading,
    error
  }), [courses, categories, loading, error]);
} 