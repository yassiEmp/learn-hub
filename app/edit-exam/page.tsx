"use client"
import React from 'react'
import { ExamEditor } from '@/components/ExamEditor'
import Nav from '@/components/Header'

const Page = () => {
  return (
    <>
      <Nav currentPath="/create-exam" />
      <ExamEditor />
    </>
  )
}

export default Page