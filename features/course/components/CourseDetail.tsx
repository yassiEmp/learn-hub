"use client"
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  ArrowLeft,
  BookOpen,
  Brain,
  ChevronRight,
  Clock,
  Loader2,
  Play,
  RotateCcw,
  Sparkles,
  User,
} from 'lucide-react';
import type { CourseWithLessons } from '@/types/course';
import { ApiError, errorMessage } from '@/hooks/apiFetch';
import { useRetryGeneration } from '../hooks/useCourse';
import { useGenerateExam } from '@/features/exam/hooks/useExams';
import { lastLessonKey } from './LessonReader';

interface CourseDetailProps {
  course: CourseWithLessons;
  stalled?: boolean;
}

function formatDuration(minutes?: number | null): string | null {
  if (typeof minutes !== 'number' || !Number.isFinite(minutes) || minutes <= 0) return null;
  if (minutes < 60) return `${Math.round(minutes)} min`;
  const hours = minutes / 60;
  return `${hours.toFixed(1).replace(/\.0$/, '')} h`;
}

const SOURCE_LABELS: Record<string, string> = {
  text: 'your notes',
  pdf: 'a PDF',
  url: 'a web article',
  youtube: 'a YouTube video',
  topic: 'a topic',
  audio: 'an audio file',
  video: 'a video file',
};

function readLastLesson(courseId: string): string | null {
  try {
    return window.localStorage.getItem(lastLessonKey(courseId));
  } catch {
    return null;
  }
}

export const CourseDetail: React.FC<CourseDetailProps> = ({ course, stalled = false }) => {
  const router = useRouter();
  const retry = useRetryGeneration(course.id);
  const exam = useGenerateExam(course.id);
  const [lastLessonId, setLastLessonId] = useState<string | null>(null);

  useEffect(() => {
    setLastLessonId(readLastLesson(course.id));
  }, [course.id]);

  const lessons = [...(course.lessons ?? [])].sort((a, b) => a.position - b.position);
  const count = lessons.length;
  const total = Math.max(course.lessons_total ?? 0, count);
  const generating = course.status === 'generating';
  const failed = course.status === 'failed' || (course.status === 'ready' && count === 0);
  const pending = generating ? Math.max(total - count, count === 0 ? 3 : 0) : 0;
  const percent = total > 0 ? Math.round((count / total) * 100) : 0;
  const duration = formatDuration(course.duration_minutes);
  const source = course.source_type ? SOURCE_LABELS[course.source_type] : null;

  const resumeLesson = lessons.find((l) => l.id === lastLessonId);
  const firstLesson = lessons[0];
  const openLesson = (lessonId: string) => router.push(`/course/${course.id}?lesson=${lessonId}`);

  const handleGenerateExam = () => {
    exam.mutate(undefined, { onSuccess: (id) => router.push(`/exam/${id}`) });
  };

  return (
    <div className="min-h-screen bg-black relative">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        <Link
          href="/courses"
          className="inline-flex items-center text-white/60 hover:text-white mb-8 group transition-colors font-geist-mono text-sm"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          My courses
        </Link>

        <div className="grid lg:grid-cols-3 gap-8 lg:gap-10">
          {/* Left: course info + lessons */}
          <div className="lg:col-span-2 space-y-8">
            <motion.header
              className="space-y-5"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex flex-wrap items-center gap-2">
                {course.category && (
                  <span className="bg-white/10 text-white/90 text-xs px-3 py-1 rounded-full font-geist-mono border border-white/20">
                    {course.category}
                  </span>
                )}
                {course.level && (
                  <span className="text-white/50 font-geist-mono text-xs capitalize">{course.level}</span>
                )}
              </div>
              <h1 className="text-3xl md:text-5xl font-syne font-medium text-white leading-tight">
                {course.title || (generating ? 'Designing your course…' : 'Untitled course')}
              </h1>
              {course.description && (
                <p className="text-lg text-white/70 font-geist-mono leading-relaxed">{course.description}</p>
              )}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-white/60 font-geist-mono text-sm">
                <span className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  {count} lesson{count === 1 ? '' : 's'}
                </span>
                {duration && (
                  <span className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {duration}
                  </span>
                )}
                <span className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  {course.is_owner ? 'Created by you' : 'Shared course'}
                  {source && course.is_owner ? ` from ${source}` : ''}
                </span>
              </div>
            </motion.header>

            {/* Generation status */}
            {generating && !stalled && (
              <div className="p-5 rounded-2xl border border-white/10 bg-white/5" aria-live="polite">
                <div className="flex items-center justify-between gap-4 mb-3">
                  <p className="flex items-center gap-2 text-white font-geist-mono text-sm">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {course.lessons_total
                      ? `Generating lessons… ${count} of ${total}`
                      : count > 0
                        ? `Generating lessons… ${count} ready`
                        : 'Designing your lessons…'}
                  </p>
                  {course.lessons_total ? (
                    <span className="text-white/50 font-geist-mono text-xs">{percent}%</span>
                  ) : null}
                </div>
                <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                  {course.lessons_total ? (
                    <motion.div
                      className="bg-gradient-to-r from-purple-400 to-pink-500 h-2 rounded-full"
                      animate={{ width: `${Math.max(percent, 4)}%` }}
                      transition={{ duration: 0.6 }}
                    />
                  ) : (
                    <div className="h-2 w-1/3 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 animate-pulse" />
                  )}
                </div>
                <p className="mt-3 text-white/50 font-geist-mono text-xs">
                  Lessons appear below as soon as they&apos;re ready — you can start reading the first one now.
                </p>
              </div>
            )}

            {(failed || stalled) && course.is_owner && (
              <div
                role="alert"
                className={`p-5 rounded-2xl border ${failed ? 'border-red-500/30 bg-red-500/5' : 'border-amber-500/30 bg-amber-500/5'}`}
              >
                <p className={`flex items-center gap-2 font-geist-mono text-sm ${failed ? 'text-red-300' : 'text-amber-300'}`}>
                  <AlertTriangle className="w-4 h-4" />
                  {failed
                    ? count > 0
                      ? `Lesson generation stopped after ${count} lesson${count === 1 ? '' : 's'}.`
                      : 'We couldn’t generate lessons for this course.'
                    : 'This is taking longer than usual.'}
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => retry.mutate()}
                    disabled={retry.isPending}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-black text-sm font-geist-mono font-medium hover:bg-white/90 disabled:opacity-50"
                  >
                    {retry.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <RotateCcw className="w-4 h-4" />}
                    Retry generation
                  </button>
                  {retry.isError &&
                    (retry.error instanceof ApiError && retry.error.status === 409 ? (
                      <span className="text-white/70 text-sm font-geist-mono">{retry.error.message}</span>
                    ) : (
                      <span className="text-red-400 text-sm font-geist-mono">{errorMessage(retry.error)}</span>
                    ))}
                </div>
              </div>
            )}

            {/* Lessons */}
            <section className="space-y-3">
              <h2 className="text-xl font-syne font-medium text-white">Lessons</h2>
              {lessons.map((lesson, index) => (
                <motion.button
                  key={lesson.id}
                  type="button"
                  onClick={() => openLesson(lesson.id)}
                  className="w-full flex items-center justify-between gap-4 p-4 text-left bg-white/5 rounded-xl border border-white/10 hover:border-white/25 hover:bg-white/[0.07] transition-colors group"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="flex items-start gap-4 min-w-0">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full border border-white/20 text-white/80 text-sm font-geist-mono shrink-0">
                      {index + 1}
                    </span>
                    <div className="min-w-0">
                      <h3 className="font-medium text-white font-geist-mono">{lesson.title}</h3>
                      {lesson.summary && (
                        <p className="text-sm text-white/50 font-geist-mono line-clamp-2 mt-1">{lesson.summary}</p>
                      )}
                    </div>
                  </div>
                  <span className="flex items-center gap-1 text-sm text-white/50 group-hover:text-white font-geist-mono shrink-0">
                    {lesson.id === lastLessonId ? 'Continue' : 'Read'}
                    <ChevronRight className="w-4 h-4" />
                  </span>
                </motion.button>
              ))}
              {Array.from({ length: pending }).map((_, i) => (
                <div
                  key={`pending-${i}`}
                  className="flex items-center gap-4 p-4 rounded-xl border border-dashed border-white/10"
                  aria-hidden
                >
                  <span className="flex items-center justify-center w-8 h-8 rounded-full border border-white/10 text-white/30 text-sm font-geist-mono">
                    {count + i + 1}
                  </span>
                  <div className="h-4 w-1/2 rounded bg-white/10 animate-pulse" />
                </div>
              ))}
              {count === 0 && !generating && !failed && (
                <p className="text-white/50 font-geist-mono text-sm">No lessons yet.</p>
              )}
            </section>

            {course.tags && course.tags.length > 0 && (
              <section className="space-y-3">
                <h2 className="text-xl font-syne font-medium text-white">Topics covered</h2>
                <div className="flex flex-wrap gap-2">
                  {course.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full text-xs font-geist-mono text-white/80 bg-white/5 border border-white/10"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right: actions */}
          <aside className="lg:col-span-1">
            <div className="lg:sticky lg:top-28 space-y-4">
              <div className="bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 p-6 space-y-4">
                <h3 className="text-white font-syne font-medium text-lg">
                  {resumeLesson ? 'Pick up where you left off' : 'Ready when you are'}
                </h3>
                {resumeLesson && (
                  <p className="text-white/60 font-geist-mono text-sm">Last read: {resumeLesson.title}</p>
                )}
                <button
                  onClick={() => (resumeLesson ?? firstLesson) && openLesson((resumeLesson ?? firstLesson).id)}
                  disabled={!firstLesson}
                  className="w-full bg-white text-black py-3 px-6 rounded-xl font-geist-mono font-medium hover:bg-white/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Play className="w-5 h-5" />
                  {resumeLesson ? 'Continue learning' : 'Start learning'}
                </button>
                {!firstLesson && generating && (
                  <p className="text-white/50 font-geist-mono text-xs text-center">
                    Your first lesson will be ready in a moment.
                  </p>
                )}
              </div>

              {course.is_owner && (
                <div className="rounded-2xl border border-purple-400/20 bg-gradient-to-br from-purple-500/10 to-pink-500/10 p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center">
                      <Brain className="w-5 h-5 text-purple-300" />
                    </div>
                    <div>
                      <h3 className="text-white font-syne font-medium">Test yourself</h3>
                      <p className="text-white/60 font-geist-mono text-xs">Quiz, flashcards & fill-in-the-gaps</p>
                    </div>
                  </div>
                  <button
                    onClick={handleGenerateExam}
                    disabled={exam.isPending || generating || count === 0}
                    className="w-full py-3 px-6 rounded-xl font-geist-mono font-medium bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {exam.isPending ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Writing your exam…
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        Generate exam
                      </>
                    )}
                  </button>
                  {generating && (
                    <p className="text-white/50 font-geist-mono text-xs text-center">
                      Available once all lessons are ready.
                    </p>
                  )}
                  {exam.isError && (
                    <p role="alert" className="text-red-400 font-geist-mono text-sm">
                      {errorMessage(exam.error, 'Could not generate the exam. Please try again.')}
                    </p>
                  )}
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};
