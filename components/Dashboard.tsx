"use client"
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Award, BookOpen, Brain, Clock, Loader2, Plus } from 'lucide-react';
import type { ApiCourse } from '@/types/course';
import { useAuth } from '@/hooks/useAuth';
import { useCourses } from '@/features/course/hooks/useCourses';
import { useExams } from '@/features/exam/hooks/useExams';
import { StatsGrid } from './dashboard/StatsGrid';
import { CourseCard } from './CourseCard';

const Dashboard: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { courses, loading: coursesLoading, error: coursesError, refetch } = useCourses();
  const { exams, loading: examsLoading } = useExams();

  const firstName = user?.name?.split(' ')[0];
  const sorted = [...courses].sort(
    (a, b) => new Date(b.updated_at || b.created_at).getTime() - new Date(a.updated_at || a.created_at).getTime()
  );
  const lessons = courses.reduce((n, c) => n + (c.lessons_count ?? 0), 0);
  const minutes = courses.reduce((n, c) => n + (c.duration_minutes ?? 0), 0);
  const open = (course: ApiCourse) => router.push(`/course/${course.id}/detail`);

  const stats = [
    { label: 'Courses', value: courses.length, icon: BookOpen, color: 'from-blue-400/20 to-cyan-400/20', iconColor: 'text-blue-400' },
    { label: 'Lessons', value: lessons, icon: Award, color: 'from-green-400/20 to-emerald-400/20', iconColor: 'text-green-400' },
    { label: 'Exams', value: exams.length, icon: Brain, color: 'from-purple-400/20 to-pink-400/20', iconColor: 'text-purple-400' },
    {
      label: 'Learning time',
      value: minutes >= 60 ? `${Math.round(minutes / 60)} h` : `${minutes} min`,
      icon: Clock,
      color: 'from-orange-400/20 to-red-400/20',
      iconColor: 'text-orange-400',
    },
  ];

  return (
    <div className="min-h-screen bg-black relative">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <h1 className="text-4xl md:text-5xl font-syne font-medium text-white tracking-tight">
              {firstName ? `Welcome back, ${firstName}` : 'Welcome back'}
            </h1>
            <p className="text-white/60 font-geist-mono mt-2">What are we learning today?</p>
          </div>
          <Link
            href="/create"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-black font-geist-mono font-medium hover:bg-white/90 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" /> New course
          </Link>
        </div>

        {coursesLoading ? (
          <p className="flex items-center justify-center gap-2 py-24 text-white/60 font-geist-mono">
            <Loader2 className="w-5 h-5 animate-spin" /> Loading your learning…
          </p>
        ) : coursesError ? (
          <div className="text-center py-20 space-y-4">
            <p className="text-red-400 font-geist-mono">{coursesError}</p>
            <button onClick={refetch} className="px-4 py-2 rounded-lg bg-white text-black text-sm font-geist-mono">
              Try again
            </button>
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-20 px-6 space-y-6 rounded-2xl border border-dashed border-white/15 bg-white/[0.02]">
            <h2 className="text-3xl font-syne font-medium text-white">Let&apos;s build your first course</h2>
            <p className="text-white/60 font-geist-mono max-w-lg mx-auto">
              Paste your notes, drop a PDF, share a YouTube link — or just type a topic. You&apos;ll get lessons and an exam in minutes.
            </p>
            <Link
              href="/create"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-black font-geist-mono font-medium text-lg hover:bg-white/90"
            >
              <Plus className="w-5 h-5" /> Create your first course
            </Link>
          </div>
        ) : (
          <>
            <StatsGrid stats={stats} />

            <section className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-syne font-medium text-white">Continue learning</h2>
                <Link href="/courses" className="flex items-center gap-1 text-white/60 hover:text-white font-geist-mono text-sm">
                  All courses <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sorted.slice(0, 6).map((course) => (
                  <CourseCard key={course.id} course={course} onCourseSelect={open} />
                ))}
              </div>
            </section>

            <section className="bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-syne font-medium text-white">Recent exams</h2>
                <Link href="/exams" className="flex items-center gap-1 text-white/60 hover:text-white font-geist-mono text-sm">
                  All exams <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              {examsLoading ? (
                <p className="text-white/50 font-geist-mono text-sm">Loading…</p>
              ) : exams.length === 0 ? (
                <p className="text-white/50 font-geist-mono text-sm">
                  No exams yet. Open a course and hit “Generate exam” to test yourself.
                </p>
              ) : (
                <ul className="space-y-2">
                  {exams.slice(0, 5).map((exam) => (
                    <li key={exam.id}>
                      <Link
                        href={`/exam/${exam.id}`}
                        className="flex items-center justify-between gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/15"
                      >
                        <div className="min-w-0">
                          <p className="font-geist-mono text-white text-sm truncate">{exam.title}</p>
                          <p className="font-geist-mono text-white/50 text-xs truncate">
                            {exam.totalQuestions} questions{exam.course ? ` • ${exam.course.title}` : ''}
                          </p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-white/40 shrink-0" />
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
