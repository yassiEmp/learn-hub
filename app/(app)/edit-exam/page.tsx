"use client"
import React from 'react'
import { ExamEditor } from '@/components/ExamEditor'
import Nav from '@/components/hearderApp'
import { AuthGuard } from '@/components/AuthGuard'

const Page = () => {
  return (
    <AuthGuard>
      <Nav currentPath="/create-exam" />
      <ExamEditor />
    </AuthGuard>
  )
}

export default Page