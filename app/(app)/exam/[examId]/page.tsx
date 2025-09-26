"use client"
import ExamComponant from '@/components/ExamComponant'
import Nav from '@/components/hearderApp'
import React from 'react'
import { sampleExam } from '@/data/exam'
import BGglow from '@/components/bg-glow'


const dummyExam = sampleExam

const Page = () => {
  return (
    <section className='pt-24'>
      <Nav currentPath="/exam" />
      <BGglow />
      <ExamComponant Exam={dummyExam} />
    </section>
  )
}

export default Page