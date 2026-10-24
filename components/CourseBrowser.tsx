"use client"
import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Grid, List, Loader2, Plus, Search } from 'lucide-react';
import type { ApiCourse } from '@/types/course';
import { useCourses } from '@/features/course/hooks/useCourses';
import { CourseCard } from './CourseCard';

/** "My courses": the signed-in user's courses with search + category filter. */
const CourseBrowserComponent: React.FC = () => {
  const { courses, loading, error, refetch } = useCourses();
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const router = useRouter();

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(courses.map((c) => c.category).filter((c): c is string => !!c)))],
    [courses]
  );

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return courses
      .filter((c) => category === 'All' || c.category === category)
      .filter(
        (c) =>
          !term ||
          c.title?.toLowerCase().includes(term) ||
          c.description?.toLowerCase().includes(term) ||
          c.tags?.some((t) => t.toLowerCase().includes(term))
      )
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }, [courses, category, search]);

  const open = (course: ApiCourse) => router.push(`/course/${course.id}/detail`);

  return (
    <div className="min-h-screen bg-black relative">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-syne font-medium text-white tracking-tight">My courses</h1>
            <p className="text-white/60 font-geist-mono mt-2">Everything you&apos;ve turned into a course.</p>
          </div>
          <Link
            href="/create"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-black font-geist-mono font-medium hover:bg-white/90 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" /> New course
          </Link>
        </div>

        {loading ? (
          <p className="flex items-center gap-2 text-white/60 font-geist-mono py-20 justify-center">
            <Loader2 className="w-5 h-5 animate-spin" /> Loading your courses…
          </p>
        ) : error ? (
          <div className="text-center py-20 space-y-4">
            <p className="text-red-400 font-geist-mono">{error}</p>
            <button onClick={refetch} className="px-4 py-2 rounded-lg bg-white text-black text-sm font-geist-mono">
              Try again
            </button>
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-20 space-y-6 rounded-2xl border border-dashed border-white/15">
            <h2 className="text-2xl font-syne font-medium text-white">No courses yet</h2>
            <p className="text-white/60 font-geist-mono">Paste notes, drop a PDF or just type a topic.</p>
            <Link
              href="/create"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-black font-geist-mono font-medium text-lg hover:bg-white/90"
            >
              <Plus className="w-5 h-5" /> Create your first course
            </Link>
          </div>
        ) : (
          <>
            <div className="bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 p-4 mb-8 space-y-4">
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Search your courses…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="block w-full pl-11 pr-4 py-2.5 border border-white/10 rounded-xl bg-white/5 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 font-geist-mono text-sm"
                  />
                </div>
                <div className="flex items-center gap-1 bg-white/5 rounded-xl p-1">
                  {(['grid', 'list'] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setViewMode(mode)}
                      aria-label={`${mode} view`}
                      className={`p-2 rounded-lg ${viewMode === mode ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/60'}`}
                    >
                      {mode === 'grid' ? <Grid className="w-4 h-4" /> : <List className="w-4 h-4" />}
                    </button>
                  ))}
                </div>
              </div>
              {categories.length > 2 && (
                <div className="flex flex-wrap gap-2">
                  {categories.map((c) => (
                    <button
                      key={c}
                      onClick={() => setCategory(c)}
                      className={`px-3 py-1.5 rounded-full text-xs font-geist-mono transition-colors ${
                        category === c ? 'bg-white text-black' : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {filtered.length === 0 ? (
              <p className="text-center py-16 text-white/50 font-geist-mono">No courses match your search.</p>
            ) : (
              <div className={`grid gap-6 ${viewMode === 'grid' ? 'md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                {filtered.map((course) => (
                  <CourseCard key={course.id} course={course} onCourseSelect={open} viewMode={viewMode} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export const CourseBrowser = React.memo(CourseBrowserComponent);
