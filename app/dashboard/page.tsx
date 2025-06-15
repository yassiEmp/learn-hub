"use client"
import Dashboard from '@/components/Dashboard'
import Nav from '@/components/Header'
import React from 'react'

const Page = () => {
  return (
    <>
    <Nav currentPath='/dashboard'/>
    <Dashboard onCourseSelect={()=>{}} />
    </>
  )
}

export default Page