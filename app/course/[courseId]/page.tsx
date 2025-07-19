"use client"
import { CourseEditor } from '@/components/CourseEditor'
import { AuthGuard } from '@/components/AuthGuard'
import React, { useState } from 'react'
import { useCourse } from '@/features/course/hooks/useCourse'
import { useParams } from 'next/navigation'
import Loading from './detail/loading'
// import { useEffect } from 'react';

const Page = () => {
  const params = useParams()
  const {courseId} = params
  const course = useCourse(courseId as string)
  const [currentLessonIdx,setCurrentLessonIdx] = useState(0)


  if (course.loading) {
    return <Loading />;
  }

  if (!course.course) {
    return <div>Course not found.</div>;
  }

  const lessons = course.course.lessons.map((lesson, idx) => ({
    id: lesson.id,
    title: lesson.title,
    duration: lesson.duration,
    isActive: idx === currentLessonIdx, // or your own logic for active lesson
    isCompleted: lesson.isCompleted ?? false,
  }));

  // Get the content for the current lesson, fallback to empty string if not found
  const currentLessonContent = course.course.lessons[currentLessonIdx]?.content || "";

  return (
    <AuthGuard>
      <CourseEditor
        content={currentLessonContent}
        onChange={() => {}} // or your own handler if you want to allow editing
        courseTitle={course.course.title}
        lessons={lessons}
        setCurrentLesson={setCurrentLessonIdx}
        className="h-screen"
      />
    </AuthGuard>
  );
}

export default Page