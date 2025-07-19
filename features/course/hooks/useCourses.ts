import { useEffect, useState } from 'react';
import { courseApi } from '@/utils/api-client';
import { Course, Lesson } from '@/types/course';
import { supabase } from '@/lib/supabase';

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

  useEffect(() => {
    setLoading(true);
    courseApi.getAll()
      .then(async (data) => {
        // 1. Collect all unique owner_ids
        const ownerIds = Array.from(new Set(data.map((c: any) => c.owner_id).filter(Boolean)));
        let instructorMap: Record<string, { full_name: string; avatar_url: string }> = {};
        if (ownerIds.length > 0) {
          // 2. Fetch all instructor profiles in one query
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
        setCourses(data.map((c: any) => {
          // Instructor info
          let instructor = instructorMap[c.owner_id]?.full_name ?? 'Unknown';
          let instructorAvatar = instructorMap[c.owner_id]?.avatar_url ?? '';
          if (!instructorAvatar && instructor && instructor !== 'Unknown') {
            const initials = instructor.split(' ').map((n: string) => n[0]).join('').toUpperCase();
            instructorAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=random`;
          }

          // Lessons (if present, else empty array)
          const lessons: Lesson[] = (c.lessons as Lesson[] || []).map((l) => ({
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
          }));

          // Compose Course object
          return {
            id: c.id,
            title: c.title,
            description: c.description,
            instructor,
            instructorAvatar,
            thumbnail: c.thumbnail || '',
            duration: c.duration || '',
            durationMinutes: c.duration_minutes != null ? Math.round(c.duration_minutes) : null,
            lessonsCount: lessons.length,
            studentsCount: c.studentsCount || 1,
            rating: c.rating || 5,
            price: c.price || 0,
            originalPrice: c.originalPrice || 0,
            category: c.category || 'General',
            level: (c.level?.charAt(0).toUpperCase() + c.level?.slice(1)) as Course['level'] || 'Beginner',
            tags: c.tags || [],
            content: c.content || '',
            lessons,
            isEnrolled: c.isEnrolled ?? false,
            progress: c.progress ?? 0,
            owner_id: c.owner_id,
            created_at: c.created_at,
            updated_at: c.updated_at,
          };
        }));
        const cats = Array.from(new Set(data.map((c: any) => c.category || 'Uncategorized')));
        setCategories(['All', ...cats]);
        setLoading(false);
      })
      .catch((err) => {
        setError(err?.toString() || 'Failed to load courses');
        setLoading(false);
      });
  }, []);

  return { courses, categories, loading, error };
} 