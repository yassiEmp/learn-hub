"use client"
import { ExamBrowser } from '@/components/ExamBrowser'
import Nav from '@/components/hearderApp'
import React from 'react'

const Page = () => {
  return (
    <>
      <Nav currentPath="/exams" />
      <ExamBrowser />
    </>
  )
}

export default Page