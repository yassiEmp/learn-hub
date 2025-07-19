"use client"
import React from 'react';
import { useParams } from 'next/navigation';
import { CourseDetail } from '@/features/course/components/CourseDetail';
import { useCourse } from '@/features/course/hooks/useCourse';
import Loading from './loading';

const Page = () => {
  const params = useParams();
  const courseIdRaw = params.courseId;
  const courseId = String(courseIdRaw) ;
  const { course, loading, error } = useCourse(courseId);

  if (!courseId) return <div className="text-red-500 p-8">Invalid course ID.</div>;
  if (loading ) return <Loading />;
  if (error || !course) return <div className="text-red-500 p-8">{error || 'Course not found.'}</div>;

  return <CourseDetail course={course} />;
};

export default Page;