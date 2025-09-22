"use client"
import { CourseBrowser } from '@/components/CourseBrowser'
import Nav from '@/components/hearderApp'

const Page = () => {
  return (
    <>
        <Nav currentPath='/courses' />

          <CourseBrowser />
    </>
  )
}

export default Page