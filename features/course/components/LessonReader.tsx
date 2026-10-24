"use client"
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Book, CheckCircle2, ChevronLeft, Loader2, Menu, Sparkles, Target, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { CourseWithLessons } from '@/types/course';
import { errorMessage } from '@/hooks/apiFetch';
import { useGenerateExam } from '@/features/exam/hooks/useExams';
import { LessonContent } from './LessonContent';

export const lastLessonKey = (courseId: string) => `flashmind:lastLesson:${courseId}`;

interface LessonReaderProps {
  course: CourseWithLessons;
  lessonId: string | null;
}

/** Read-only lesson reader: sidebar of lessons, content, prev/next, exam at the end. */
export const LessonReader: React.FC<LessonReaderProps> = ({ course, lessonId }) => {
  const router = useRouter();
  const exam = useGenerateExam(course.id);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const lessons = [...(course.lessons ?? [])].sort((a, b) => a.position - b.position);
  const foundIdx = lessons.findIndex((l) => l.id === lessonId);
  const idx = foundIdx >= 0 ? foundIdx : 0;
  const lesson = lessons[idx];
  const prev = lessons[idx - 1];
  const next = lessons[idx + 1];
  const generating = course.status === 'generating';

  useEffect(() => {
    if (!lesson) return;
    try {
      window.localStorage.setItem(lastLessonKey(course.id), lesson.id);
    } catch {
      // storage unavailable: resume is a convenience only
    }
    window.scrollTo({ top: 0 });
  }, [course.id, lesson]);

  const go = (id: string) => {
    setSidebarOpen(false);
    router.push(`/course/${course.id}?lesson=${id}`);
  };

  const sidebar = (
    <nav className="p-4 space-y-1">
      {lessons.map((l, i) => (
        <button
          key={l.id}
          onClick={() => go(l.id)}
          className={cn(
            'w-full flex items-start gap-3 px-3 py-2.5 rounded-xl text-sm text-left transition-colors',
            i === idx ? 'bg-white/10 text-white border border-white/20' : 'text-white/70 hover:bg-white/5 hover:text-white'
          )}
        >
          <span className="flex items-center justify-center w-6 h-6 rounded-full border border-white/30 text-xs shrink-0">
            {i < idx ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : i + 1}
          </span>
          <span className="font-geist-mono leading-snug">{l.title}</span>
        </button>
      ))}
      {generating && (
        <p className="flex items-center gap-2 px-3 py-2 text-xs text-white/50 font-geist-mono">
          <Loader2 className="w-3 h-3 animate-spin" />
          More lessons on the way…
        </p>
      )}
    </nav>
  );

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="fixed inset-0 bg-gradient-to-br from-black via-gray-900 to-black -z-0" />

      <header className="fixed top-0 inset-x-0 z-40 bg-black/60 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10"
            aria-label="Show lessons"
          >
            <Menu className="w-5 h-5" />
          </button>
          <Link
            href={`/course/${course.id}/detail`}
            className="flex items-center gap-2 text-white/60 hover:text-white font-geist-mono text-sm shrink-0"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Course overview</span>
          </Link>
          <div className="h-5 w-px bg-white/20" />
          <p className="font-syne font-medium truncate">{course.title}</p>
          <span className="ml-auto text-white/50 font-geist-mono text-xs shrink-0">
            {lessons.length ? `${idx + 1} / ${lessons.length}` : ''}
          </span>
        </div>
        <div className="h-0.5 bg-white/10">
          <div
            className="h-0.5 bg-gradient-to-r from-purple-400 to-pink-500 transition-all"
            style={{ width: lessons.length ? `${((idx + 1) / lessons.length) * 100}%` : '0%' }}
          />
        </div>
      </header>

      {/* Mobile drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/70" onClick={() => setSidebarOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-80 max-w-[85%] bg-gray-950 border-r border-white/10 overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <span className="flex items-center gap-2 font-syne"><Book className="w-4 h-4" /> Lessons</span>
              <button onClick={() => setSidebarOpen(false)} aria-label="Close lessons" className="p-1 text-white/60 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            {sidebar}
          </div>
        </div>
      )}

      <div className="relative z-10 max-w-7xl mx-auto pt-16 flex">
        <aside className="hidden lg:block w-80 shrink-0 border-r border-white/10 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
          {sidebar}
        </aside>

        <main className="flex-1 min-w-0 px-4 sm:px-8 lg:px-12 py-10">
          {!lesson ? (
            <div className="max-w-2xl mx-auto text-center py-24 space-y-4">
              {generating ? (
                <>
                  <Loader2 className="w-8 h-8 animate-spin mx-auto text-white/60" />
                  <p className="font-geist-mono text-white/70">Your first lesson is being written…</p>
                </>
              ) : (
                <>
                  <p className="font-geist-mono text-white/70">This course has no lessons yet.</p>
                  <Link href={`/course/${course.id}/detail`} className="underline text-white/80">Back to course</Link>
                </>
              )}
            </div>
          ) : (
            <article className="max-w-3xl mx-auto space-y-8">
              <header className="space-y-3">
                <p className="text-white/50 font-geist-mono text-xs uppercase tracking-wider">Lesson {idx + 1}</p>
                <h1 className="text-3xl sm:text-4xl font-syne font-medium leading-tight">{lesson.title}</h1>
              </header>

              {lesson.objectives && lesson.objectives.length > 0 && (
                <section className="p-5 rounded-2xl border border-white/10 bg-white/5">
                  <h2 className="flex items-center gap-2 text-sm font-geist-mono text-white/70 mb-3">
                    <Target className="w-4 h-4" /> In this lesson you will
                  </h2>
                  <ul className="list-disc pl-5 space-y-1 font-geist-mono text-sm text-white/85">
                    {lesson.objectives.map((o, i) => <li key={i}>{o}</li>)}
                  </ul>
                </section>
              )}

              {lesson.content ? (
                <LessonContent markdown={lesson.content} />
              ) : (
                <p className="text-white/50 font-geist-mono">This lesson has no content.</p>
              )}

              {lesson.summary && (
                <section className="p-5 rounded-2xl border border-emerald-400/20 bg-emerald-400/5">
                  <h2 className="text-sm font-geist-mono text-emerald-300 mb-2">Key takeaway</h2>
                  <p className="font-geist-mono text-sm text-white/85 leading-relaxed">{lesson.summary}</p>
                </section>
              )}

              <nav className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-white/10">
                {prev ? (
                  <button
                    onClick={() => go(prev.id)}
                    className="flex-1 flex items-center gap-2 p-4 rounded-xl border border-white/10 hover:border-white/25 text-left"
                  >
                    <ArrowLeft className="w-4 h-4 shrink-0" />
                    <span className="min-w-0">
                      <span className="block text-xs text-white/50 font-geist-mono">Previous</span>
                      <span className="block truncate font-geist-mono text-sm">{prev.title}</span>
                    </span>
                  </button>
                ) : <div className="flex-1 hidden sm:block" />}

                {next ? (
                  <button
                    onClick={() => go(next.id)}
                    className="flex-1 flex items-center justify-end gap-2 p-4 rounded-xl bg-white text-black hover:bg-white/90 text-right"
                  >
                    <span className="min-w-0">
                      <span className="block text-xs text-black/60 font-geist-mono">Next lesson</span>
                      <span className="block truncate font-geist-mono text-sm font-medium">{next.title}</span>
                    </span>
                    <ArrowRight className="w-4 h-4 shrink-0" />
                  </button>
                ) : generating ? (
                  <div className="flex-1 flex items-center justify-center gap-2 p-4 rounded-xl border border-dashed border-white/15 text-white/60 font-geist-mono text-sm">
                    <Loader2 className="w-4 h-4 animate-spin" /> Next lesson is being written…
                  </div>
                ) : course.is_owner ? (
                  <button
                    onClick={() => exam.mutate(undefined, { onSuccess: (id) => router.push(`/exam/${id}`) })}
                    disabled={exam.isPending}
                    className="flex-1 flex items-center justify-center gap-2 p-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-geist-mono font-medium hover:opacity-90 disabled:opacity-60"
                  >
                    {exam.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    {exam.isPending ? 'Writing your exam…' : 'Finished! Test yourself'}
                  </button>
                ) : (
                  <Link
                    href={`/course/${course.id}/detail`}
                    className="flex-1 flex items-center justify-center p-4 rounded-xl border border-white/10 font-geist-mono text-sm"
                  >
                    Back to course
                  </Link>
                )}
              </nav>
              {exam.isError && (
                <p role="alert" className="text-red-400 font-geist-mono text-sm text-center">
                  {errorMessage(exam.error, 'Could not generate the exam. Please try again.')}
                </p>
              )}
            </article>
          )}
        </main>
      </div>
    </div>
  );
};
