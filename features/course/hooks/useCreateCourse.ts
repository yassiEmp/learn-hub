"use client"
import { useCallback, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { apiFetch, errorMessage } from '@/hooks/apiFetch';
import type { ApiCourse } from '@/types/course';
import type { PreparedSource, SourceJob } from '@/features/content-import/components/sourceTypes';

export type CreateStep = 'reading' | 'designing' | 'building';

export const CREATE_STEPS: { id: CreateStep; label: string }[] = [
  { id: 'reading', label: 'Reading your content' },
  { id: 'designing', label: 'Designing your course' },
  { id: 'building', label: 'Building lessons' },
];

export type CreateState =
  | { phase: 'idle' }
  | { phase: 'running'; step: CreateStep }
  | { phase: 'error'; step: CreateStep; message: string };

const MIN_EXTRACTED_CHARS = 50;

/**
 * Drives the create flow: extract the source (reading) → POST /api/v1/course
 * (designing) → redirect to the course page where lessons stream in (building).
 */
export function useCreateCourse() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [state, setState] = useState<CreateState>({ phase: 'idle' });
  const lastJob = useRef<SourceJob | null>(null);
  // Extraction result is kept so a retry after a failed course POST
  // does not re-upload / re-transcribe.
  const lastPrepared = useRef<PreparedSource | null>(null);

  const run = useCallback(
    async (job: SourceJob, reusePrepared = false) => {
      lastJob.current = job;
      let step: CreateStep = 'reading';
      try {
        let prepared = reusePrepared ? lastPrepared.current : null;
        if (!prepared) {
          setState({ phase: 'running', step: 'reading' });
          prepared = await job.prepare();
          if (!prepared.text || prepared.text.trim().length < MIN_EXTRACTED_CHARS) {
            throw new Error(
              "We couldn't find enough text in that source to build a course. Try another source or paste the text directly."
            );
          }
          lastPrepared.current = prepared;
        }

        step = 'designing';
        setState({ phase: 'running', step });
        const course = await apiFetch<ApiCourse>('/api/v1/course', {
          method: 'POST',
          body: JSON.stringify({
            text: prepared.text,
            sourceType: prepared.sourceType,
            ...(prepared.sourceFiles?.length ? { sourceFiles: prepared.sourceFiles } : {}),
          }),
        });
        if (!course?.id) throw new Error('The course was not created. Please try again.');

        step = 'building';
        setState({ phase: 'running', step });
        queryClient.invalidateQueries({ queryKey: ['courses'] });
        router.push(`/course/${course.id}/detail`);
      } catch (err) {
        if (step === 'reading') lastPrepared.current = null;
        setState({ phase: 'error', step, message: errorMessage(err) });
      }
    },
    [router, queryClient]
  );

  const start = useCallback(
    (job: SourceJob) => {
      lastPrepared.current = null;
      void run(job);
    },
    [run]
  );

  const retry = useCallback(() => {
    if (lastJob.current) void run(lastJob.current, true);
  }, [run]);

  const reset = useCallback(() => setState({ phase: 'idle' }), []);

  return { state, start, retry, reset, isRunning: state.phase === 'running' };
}
