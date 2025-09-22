"use client"
import Dashboard from '@/components/Dashboard'
import Nav from '@/components/hearderApp'
import { AuthGuard } from '@/components/AuthGuard'
import React from 'react'

const Page = () => {
  return (
    <AuthGuard>
      <Nav currentPath='/dashboard'/>
      <Dashboard onCourseSelect={()=>{}} />
    </AuthGuard>
  )
}

export default Page