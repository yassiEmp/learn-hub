"use client"
import { CourseEditor } from '@/components/CourseEditor'
import React, { useState } from 'react'

const Page = () => {
  const [content, setContent] = useState('')

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
            <CourseEditor
            content={content}
            onChange={setContent}
            courseTitle="Introduction to Web Development"
            lessons={[
                { id: "1", title: "Getting Started", isActive: true },
                { id: "2", title: "HTML Basics" },
                { id: "3", title: "CSS Fundamentals" },
                // ... more lessons
            ]}
            className="h-[calc(100vh-2rem)]"
            />
        </div>
    </main>
  )
}

export default Page