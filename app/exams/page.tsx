"use client"
import { CourseBrowser } from '@/components/CourseBrowser'
import Nav from '@/components/Header'
import React from 'react'

const Page = () => {
  return (
    <>
      <Nav currentPath="/exams" />
      <CourseBrowser />
    </>
  )
}

export default Page