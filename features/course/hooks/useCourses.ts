"use client"
import { useQuery } from '@tanstack/react-query';
import { apiFetch, errorMessage } from '@/hooks/apiFetch';
import type { ApiCourse } from '@/types/course';

interface UseCoursesResult {
  courses: ApiCourse[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/** The signed-in user's courses (GET /api/v1/course). Polls while any is generating. */
export function useCourses(): UseCoursesResult {
  const query = useQuery({
    queryKey: ['courses'],
    queryFn: () => apiFetch<ApiCourse[]>('/api/v1/course'),
    staleTime: 0,
    refetchOnMount: 'always',
    refetchInterval: (q) => (q.state.data?.some((c) => c.status === 'generating') ? 5000 : false),
  });

  return {
    courses: Array.isArray(query.data) ? query.data : [],
    loading: query.isPending,
    error: query.error ? errorMessage(query.error, 'Could not load your courses.') : null,
    refetch: () => void query.refetch(),
  };
}
