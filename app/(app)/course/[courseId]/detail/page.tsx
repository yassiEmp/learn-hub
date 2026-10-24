"use client"
import React from 'react'
import { useParams } from 'next/navigation'
import Nav from '@/components/hearderApp'
import { CourseDetail } from '@/features/course/components/CourseDetail'
import { CourseStatusScreen } from '@/features/course/components/CourseStatusScreen'
import { useCourse } from '@/features/course/hooks/useCourse'

const Page = () => {
  const params = useParams()
  const courseId = String(params.courseId ?? '')
  const { course, loading, error, stalled, refetch } = useCourse(courseId)

  return (
    <>
      <Nav />
      {loading ? (
        <CourseStatusScreen kind="loading" />
      ) : error || !course ? (
        <CourseStatusScreen kind="error" message={error ?? 'Course not found.'} onRetry={refetch} />
      ) : (
        <CourseDetail course={course} stalled={stalled} />
      )}
    </>
  )
}

export default Page
