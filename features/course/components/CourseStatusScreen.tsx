"use client"
import React from 'react'
import Link from 'next/link'
import { AlertCircle, Loader2 } from 'lucide-react'

type Props =
  | { kind: 'loading' }
  | { kind: 'error'; message: string; onRetry?: () => void }

/** Full-screen loading / error state for course pages. */
export const CourseStatusScreen: React.FC<Props> = (props) => (
  <div className="min-h-screen bg-black flex items-center justify-center px-4">
    {props.kind === 'loading' ? (
      <p className="flex items-center gap-3 text-white/60 font-geist-mono">
        <Loader2 className="w-5 h-5 animate-spin" /> Loading course…
      </p>
    ) : (
      <div className="max-w-md text-center space-y-4">
        <AlertCircle className="w-10 h-10 text-red-400 mx-auto" />
        <p className="text-white font-geist-mono">{props.message}</p>
        <div className="flex justify-center gap-3">
          {props.onRetry && (
            <button
              onClick={props.onRetry}
              className="px-4 py-2 rounded-lg bg-white text-black text-sm font-geist-mono"
            >
              Try again
            </button>
          )}
          <Link href="/courses" className="px-4 py-2 rounded-lg border border-white/15 text-white text-sm font-geist-mono">
            My courses
          </Link>
        </div>
      </div>
    )}
  </div>
)
