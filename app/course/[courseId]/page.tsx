"use client"
import React from 'react';
import { CourseDetail } from '../../../components/CourseDetail';
import { courses } from '../../../data/courses';

const Page = () => {
  return (
    <CourseDetail 
        course={courses[1]}
    />
  )
}

export default Page