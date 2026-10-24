"use client"
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiFetch, errorMessage } from '@/hooks/apiFetch';
import type { ExamListItem } from '@/types/course';

export type ExamData = ExamListItem & { totalQuestions: number };

interface UseExamsResult {
  exams: ExamData[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/** GET /api/v1/exams. Accepts `data` as an array or as `{ exams: [] }`. */
export function useExams(): UseExamsResult {
  const query = useQuery({
    queryKey: ['exams'],
    queryFn: async () => {
      const data = await apiFetch<ExamListItem[] | { exams?: ExamListItem[] }>('/api/v1/exams');
      const list = Array.isArray(data) ? data : data?.exams ?? [];
      return list.map((exam) => ({
        ...exam,
        course: exam.course ?? null,
        totalQuestions: Array.isArray(exam.exercises) ? exam.exercises.length : 0,
      }));
    },
    staleTime: 0,
    refetchOnMount: 'always',
  });

  return {
    exams: query.data ?? [],
    loading: query.isPending,
    error: query.error ? errorMessage(query.error, 'Could not load your exams.') : null,
    refetch: () => void query.refetch(),
  };
}

/** POST /api/v1/course/[id]/exam → returns the new exam id. */
export function useGenerateExam(courseId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const data = await apiFetch<{ id?: string; exam?: { id: string } }>(
        `/api/v1/course/${courseId}/exam`,
        { method: 'POST' }
      );
      const id = data?.id ?? data?.exam?.id;
      if (!id) throw new Error('The exam was created but we could not open it. Check the Exams page.');
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exams'] });
    },
  });
}
