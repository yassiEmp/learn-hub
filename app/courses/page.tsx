"use client"
import { CourseBrowser } from '@/components/CourseBrowser'
import Nav from '@/components/Header'
import React, { Suspense } from 'react'
import Loading from '../loading'

const Page = () => {
  return (
    <>
      <Suspense fallback={<Loading />}>

        <Nav currentPath='/courses' />

        <Suspense fallback={<Loading />}>

          <CourseBrowser />
        </Suspense>
      </Suspense>
    </>
  )
}

export default Page