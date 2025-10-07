"use client"
import { ExamComponant } from '@/components/ExamComponant'
import Nav from '@/components/hearderApp'
import React, { useMemo } from 'react'
import { sampleExam } from '@/data/exam'
import BGglow from '@/components/bg-glow'

const Page = () => {
  // Memoize the exam object to prevent re-creation on every render
  const memoizedExam = useMemo(() => (sampleExam), [])

  return (
    <section className='pt-24'>
      <Nav currentPath="/exam" />
      <BGglow />
      <ExamComponant Exam={memoizedExam} />
    </section>
  )
}

export default Page