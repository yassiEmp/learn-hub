"use client"
import React from 'react'
import { CreateExamEditor } from '@/components/CreateExamEditor'
import Nav from '@/components/Header'

const Page = () => {
  return (
    <>
      <Nav currentPath="/create-exam" />
      <CreateExamEditor />
    </>
  )
}

export default Page