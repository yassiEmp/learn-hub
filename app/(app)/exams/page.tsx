"use client"
import { CourseBrowser } from '@/components/CourseBrowser'
import Nav from '@/components/hearderApp'
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