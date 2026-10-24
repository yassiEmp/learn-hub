"use client"
import React from 'react';
import { AlertTriangle, BookOpen, Clock, Loader2 } from 'lucide-react';
import type { ApiCourse } from '@/types/course';
import { cn } from '@/lib/utils';

interface CourseCardProps {
  course: ApiCourse;
  onCourseSelect: (course: ApiCourse) => void;
  viewMode?: 'grid' | 'list';
}

const PALETTE = [
  'from-blue-400/20 to-cyan-400/20',
  'from-green-400/20 to-emerald-400/20',
  'from-purple-400/20 to-pink-400/20',
  'from-orange-400/20 to-red-400/20',
  'from-indigo-400/20 to-blue-400/20',
];

function colorFor(key: string) {
  let h = 0;
  for (const ch of key) h = (h * 31 + ch.charCodeAt(0)) | 0;
  return PALETTE[Math.abs(h) % PALETTE.length];
}

export const CourseStatusBadge: React.FC<{ course: ApiCourse }> = ({ course }) => {
  if (course.status === 'generating') {
    const done = course.lessons_count ?? 0;
    const total = course.lessons_total;
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-geist-mono px-2 py-1 rounded-full bg-purple-500/15 text-purple-300 border border-purple-400/20">
        <Loader2 className="w-3 h-3 animate-spin" />
        {total ? `Generating ${done}/${total}` : 'Generating'}
      </span>
    );
  }
  if (course.status === 'failed') {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-geist-mono px-2 py-1 rounded-full bg-red-500/15 text-red-300 border border-red-400/20">
        <AlertTriangle className="w-3 h-3" />
        Needs retry
      </span>
    );
  }
  return null;
};

export const CourseCard: React.FC<CourseCardProps> = ({ course, onCourseSelect, viewMode = 'grid' }) => {
  const lessons = course.lessons_count ?? 0;
  const minutes = course.duration_minutes;
  const color = colorFor(course.category || course.id);

  return (
    <button
      type="button"
      onClick={() => onCourseSelect(course)}
      className={cn(
        'w-full text-left bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 hover:border-white/25 transition-all duration-300 overflow-hidden group',
        viewMode === 'list' ? 'flex items-stretch' : 'flex flex-col'
      )}
    >
      <div
        className={cn(
          'bg-gradient-to-br relative flex items-center justify-center shrink-0',
          color,
          viewMode === 'list' ? 'w-28' : 'h-32'
        )}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:12px_12px]" />
        <BookOpen className="w-8 h-8 text-white/80 relative" />
      </div>
      <div className="p-5 flex-1 min-w-0 space-y-3">
        <div className="flex items-center gap-2 flex-wrap">
          {course.category && (
            <span className="text-xs font-geist-mono text-white/70 px-2 py-0.5 rounded-full bg-white/10 border border-white/10">
              {course.category}
            </span>
          )}
          <CourseStatusBadge course={course} />
        </div>
        <h3 className="text-lg font-syne font-medium text-white leading-snug line-clamp-2 group-hover:text-white">
          {course.title || 'Designing your course…'}
        </h3>
        {course.description && (
          <p className="text-sm text-white/60 font-geist-mono line-clamp-2">{course.description}</p>
        )}
        <div className="flex items-center gap-4 text-xs text-white/50 font-geist-mono">
          <span className="flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5" />
            {lessons} lesson{lessons === 1 ? '' : 's'}
          </span>
          {typeof minutes === 'number' && minutes > 0 && (
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              {minutes < 60 ? `${Math.round(minutes)} min` : `${(minutes / 60).toFixed(1).replace(/\.0$/, '')} h`}
            </span>
          )}
        </div>
      </div>
    </button>
  );
};
