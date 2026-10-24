"use client"
import React, { Suspense } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import { useCourse } from '@/features/course/hooks/useCourse'
import { LessonReader } from '@/features/course/components/LessonReader'
import { CourseStatusScreen } from '@/features/course/components/CourseStatusScreen'

const Reader = () => {
  const params = useParams()
  const searchParams = useSearchParams()
  const courseId = String(params.courseId ?? '')
  const { course, loading, error, refetch } = useCourse(courseId)

  if (loading) return <CourseStatusScreen kind="loading" />
  if (error || !course) return <CourseStatusScreen kind="error" message={error ?? 'Course not found.'} onRetry={refetch} />

  return <LessonReader course={course} lessonId={searchParams.get('lesson')} />
}

export default function Page() {
  return (
    <Suspense fallback={<CourseStatusScreen kind="loading" />}>
      <Reader />
    </Suspense>
  )
}
