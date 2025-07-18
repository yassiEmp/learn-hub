import { useEffect, useState, useMemo } from 'react';
import { supabase as publicSupabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { Course, Lesson } from '@/types/course';
import { createServerClient } from '@/utils/supabase/server';

interface UseCourseResult {
  course: Course | null;
  loading: boolean;
  error: string | null;
}

export function useCourse(courseId: string): UseCourseResult {
  const { user, session } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Use createServerClient for per-user client if session is available
  const supabase = useMemo(() => {
    if (session?.access_token) {
      return createServerClient(session.access_token);
    }
    return publicSupabase;
  }, [session]);

  useEffect(() => {
    if (!courseId) return;
    let isMounted = true;
    setLoading(true);
    setError(null);

    async function fetchCourse() {
      // 1. Fetch course
      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .select('*')
        .eq('id', courseId)
        .single();
      if (courseError || !courseData) {
        if (isMounted) {
          setError('Course not found');
          setLoading(false);
        }
        return;
      }

      // 2. Fetch lessons
      const { data: lessonsData } = await supabase
        .from('Lesson')
        .select('*')
        .eq('courseId', courseId);
      const lessons: Lesson[] = (lessonsData as Lesson[] || []).map((l) => ({
        id: l.id?.toString() ?? '',
        title: l.title,
        duration: l.duration || '',
        videoUrl: l.videoUrl || '',
        isCompleted: false,
        isCurrent: false,
      }));

      // 3. Fetch instructor info
      let instructor = 'Unknown';
      let instructorAvatar = '';
      if (courseData.owner_id) {
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('full_name, avatar_url')
          .eq('id', courseData.owner_id)
          .single();
        instructor = profile?.full_name || 'Unknown';
        instructorAvatar = profile?.avatar_url || '';
        if (!instructorAvatar && instructor) {
          // Use initials as fallback
          const initials = instructor.split(' ').map((n: string) => n[0]).join('').toUpperCase();
          instructorAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=random`;
        }
      }

      // 4. Fetch enrollment/progress for current user
      let isEnrolled = false;
      let progress = 0;
      if (user) {
        const { data: enrollment } = await supabase
          .from('enrollments')
          .select('progress')
          .eq('user_id', user.id)
          .eq('course_id', courseId)
          .single();
        if (enrollment) {
          isEnrolled = true;
          progress = enrollment.progress || 0;
        }
      }

      // 5. Compose Course object
      const courseObj: Course = {
        id: courseData.id,
        title: courseData.title,
        description: courseData.description,
        instructor,
        instructorAvatar,
        thumbnail: courseData.thumbnail || '',
        duration: courseData.duration || '',
        durationMinutes: courseData.duration_minutes ?? null,
        lessonsCount: lessons.length,
        studentsCount: courseData.studentsCount || 1,
        rating: courseData.rating || 5,
        price: courseData.price || 0,
        originalPrice: courseData.originalPrice || 0,
        category: courseData.category || 'General',
        level: (courseData.level?.charAt(0).toUpperCase() + courseData.level?.slice(1)) as Course['level'] || 'Beginner',
        tags: courseData.tags || [],
        content: courseData.content || '',
        lessons,
        isEnrolled,
        progress,
        owner_id: courseData.owner_id,
        created_at: courseData.created_at,
        updated_at: courseData.updated_at,
      };
      if (isMounted) {
        setCourse(courseObj);
        setLoading(false);
      }
    }
    fetchCourse();
    return () => { isMounted = false; };
  }, [courseId, user, supabase]);

  return { course, loading, error };
} 