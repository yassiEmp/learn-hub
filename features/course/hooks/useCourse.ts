"use client"
import { useCallback, useEffect, useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiFetch, errorMessage } from '@/hooks/apiFetch';
import type { CourseWithLessons } from '@/types/course';

const POLL_MS = 3000;
/** No new lesson for this long while "generating" → treat as stalled. */
const STALL_MS = 4 * 60 * 1000;

export const courseQueryKey = (courseId: string) => ['course', courseId] as const;

interface UseCourseResult {
  course: CourseWithLessons | null;
  loading: boolean;
  error: string | null;
  /** True while generating but no progress has been seen for a while. */
  stalled: boolean;
  refetch: () => void;
}

/**
 * Fetches GET /api/v1/course/[id]. Polls every 3s while the course is
 * generating and stops once it is ready or failed.
 */
export function useCourse(courseId: string): UseCourseResult {
  const query = useQuery({
    queryKey: courseQueryKey(courseId),
    queryFn: () => apiFetch<CourseWithLessons>(`/api/v1/course/${courseId}`),
    enabled: !!courseId,
    staleTime: 0,
    refetchOnMount: 'always',
    refetchInterval: (q) => (q.state.data?.status === 'generating' ? POLL_MS : false),
    refetchIntervalInBackground: false,
  });

  const course = query.data ?? null;
  const lessonCount = course?.lessons?.length ?? 0;

  // Track when we last saw progress to detect a stalled generation.
  const lastProgress = useRef<{ count: number; at: number }>({ count: -1, at: Date.now() });
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (lessonCount !== lastProgress.current.count) {
      lastProgress.current = { count: lessonCount, at: Date.now() };
    }
  }, [lessonCount]);

  const generating = course?.status === 'generating';
  useEffect(() => {
    if (!generating) return;
    const id = setInterval(() => setNow(Date.now()), 15000);
    return () => clearInterval(id);
  }, [generating]);

  const serverIdleMs = course ? now - new Date(course.updated_at || course.created_at).getTime() : 0;
  const clientIdleMs = now - lastProgress.current.at;
  const stalled = generating && clientIdleMs > STALL_MS && serverIdleMs > STALL_MS;

  const { refetch } = query;
  return {
    course,
    loading: query.isPending && !!courseId,
    error: query.error ? errorMessage(query.error, 'Could not load this course.') : null,
    stalled,
    refetch: useCallback(() => void refetch(), [refetch]),
  };
}

/** POST /api/v1/course/[id]/retry → restart generation, then resume polling. */
export function useRetryGeneration(courseId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => apiFetch<unknown>(`/api/v1/course/${courseId}/retry`, { method: 'POST' }),
    onSuccess: () => {
      queryClient.setQueryData<CourseWithLessons>(courseQueryKey(courseId), (old) =>
        old ? { ...old, status: 'generating', updated_at: new Date().toISOString() } : old
      );
      queryClient.invalidateQueries({ queryKey: courseQueryKey(courseId) });
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
    // 409 = nothing missing / still generating: refresh so the page reflects the real state
    onError: () => queryClient.invalidateQueries({ queryKey: courseQueryKey(courseId) }),
  });
}
