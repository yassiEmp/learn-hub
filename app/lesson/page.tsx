"use client"
import { CourseEditor } from '@/components/CourseEditor'
import { AuthGuard } from '@/components/AuthGuard'
import React, { useState } from 'react'

const Page = () => {
  const [content, setContent] = useState(`
    <h1>Introduction to Web Development</h1>
    <p>Welcome to this comprehensive course on web development. In this lesson, we'll cover the fundamentals of building modern web applications.</p>
    
    <h2>What You'll Learn</h2>
    <ul>
      <li>HTML structure and semantic markup</li>
      <li>CSS styling and responsive design</li>
      <li>JavaScript fundamentals and DOM manipulation</li>
      <li>Modern development tools and workflows</li>
    </ul>
    
    <h2>Getting Started</h2>
    <p>Before we dive into coding, let's set up our development environment. You'll need a text editor and a web browser.</p>
    
    <blockquote>
      <p><strong>Pro Tip:</strong> Use a modern code editor like VS Code for the best development experience.</p>
    </blockquote>
    
    <h2>Your First HTML Document</h2>
    <p>Let's create a simple HTML document to get started:</p>
    
    <pre><code><!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My First Web Page</title>
</head>
<body>
    <h1>Hello, World!</h1>
    <p>This is my first web page.</p>
</body>
</html></code></pre>
    
    <p>This basic structure forms the foundation of every web page. Let's break down each part...</p>
  `)

  const lessons = [
    { 
      id: "1", 
      title: "Getting Started", 
      isActive: true, 
      duration: "15 min",
      isCompleted: false 
    },
    { 
      id: "2", 
      title: "HTML Basics", 
      duration: "25 min",
      isCompleted: false 
    },
    { 
      id: "3", 
      title: "CSS Fundamentals", 
      duration: "30 min",
      isCompleted: false 
    },
    { 
      id: "4", 
      title: "JavaScript Introduction", 
      duration: "35 min",
      isCompleted: false 
    },
    { 
      id: "5", 
      title: "DOM Manipulation", 
      duration: "40 min",
      isCompleted: false 
    },
    { 
      id: "6", 
      title: "Responsive Design", 
      duration: "45 min",
      isCompleted: false 
    },
    { 
      id: "7", 
      title: "Modern CSS Features", 
      duration: "30 min",
      isCompleted: false 
    },
    { 
      id: "8", 
      title: "JavaScript ES6+", 
      duration: "50 min",
      isCompleted: false 
    },
    { 
      id: "9", 
      title: "Project Setup", 
      duration: "20 min",
      isCompleted: false 
    },
    { 
      id: "10", 
      title: "Final Project", 
      duration: "60 min",
      isCompleted: false 
    }
  ]

  return (
    <AuthGuard>
      <CourseEditor
        content={content}
        onChange={setContent}
        courseTitle="Introduction to Web Development"
        lessons={lessons}
        className="h-screen"
      />
    </AuthGuard>
  )
}

export default Page