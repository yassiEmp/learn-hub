"use client"
import React from 'react'
import Nav from '@/components/hearderApp'
import InputSection from './InputSection'

const ImportPage = () => {
  return (
    <div className="relative min-h-screen w-full bg-background overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full bg-purple-500/15 blur-[120px]"
      />
      <Nav />
      <main className="relative z-10 max-w-3xl mx-auto px-4 pt-32 pb-20">
        <header className="text-center mb-10 space-y-3">
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground tracking-tight">
            What do you want to learn?
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto">
            Pick a source. We&apos;ll turn it into a short course with lessons — then you can test yourself with an exam.
          </p>
        </header>
        <InputSection />
      </main>
    </div>
  )
}

export default ImportPage
