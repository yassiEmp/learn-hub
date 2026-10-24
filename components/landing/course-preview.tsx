'use client'

import React from 'react'
import { AnimatePresence, motion, useInView, useReducedMotion } from 'motion/react'
import { BookOpen, CircleCheck, Clock, FileText, LoaderCircle, RotateCcw, Target } from 'lucide-react'
import { cn } from '@/lib/utils'

const LESSONS = [
    { title: 'What a cell is made of', minutes: 6 },
    { title: 'The membrane: who gets in?', minutes: 7 },
    { title: 'Mitochondria and energy', minutes: 5 },
    { title: 'DNA, genes and the nucleus', minutes: 8 },
    { title: 'Mitosis, step by step', minutes: 9 },
]

const TOTAL_STEPS = LESSONS.length + 1 // lessons + exam result

/** Mock "generated course" card. Pure JSX so the promise is visible within seconds of landing. */
export function CoursePreview() {
    const ref = React.useRef<HTMLDivElement>(null)
    const inView = useInView(ref, { once: true, margin: '-80px' })
    const reduce = useReducedMotion()
    const [step, setStep] = React.useState(0)

    React.useEffect(() => {
        if (reduce) {
            setStep(TOTAL_STEPS)
            return
        }
        if (!inView) return
        const id = window.setInterval(() => {
            setStep((s) => {
                if (s >= TOTAL_STEPS) {
                    window.clearInterval(id)
                    return s
                }
                return s + 1
            })
        }, 650)
        return () => window.clearInterval(id)
    }, [inView, reduce])

    const lessonsDone = Math.min(step, LESSONS.length)
    const examReady = step >= TOTAL_STEPS

    return (
        <div ref={ref} className="relative">
            <div
                aria-hidden
                className="absolute -inset-4 -z-10 rounded-[2rem] bg-gradient-to-br from-primary/20 via-sky-400/10 to-transparent blur-2xl"
            />
            <div
                className="overflow-hidden rounded-2xl border border-border bg-card text-left shadow-2xl shadow-primary/10"
                role="img"
                aria-label="Example of a generated course: Cell Biology Basics, five lessons and an exam score of 8 out of 10">
                {/* window chrome */}
                <div className="flex items-center gap-2 border-b border-border/70 bg-muted/50 px-4 py-2.5">
                    <span className="size-2.5 rounded-full bg-red-400/80" />
                    <span className="size-2.5 rounded-full bg-amber-400/80" />
                    <span className="size-2.5 rounded-full bg-emerald-400/80" />
                    <span className="ml-2 inline-flex min-w-0 items-center gap-1.5 truncate text-xs text-muted-foreground">
                        <FileText className="size-3.5 shrink-0" />
                        <span className="truncate">biology-week-3-notes.pdf</span>
                    </span>
                </div>

                <div className="p-4 sm:p-6">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                            <p className="text-xs font-semibold uppercase tracking-wider text-primary">Your course</p>
                            <h3 className="mt-1 text-xl font-bold tracking-tight sm:text-2xl">Cell Biology: The Basics</h3>
                            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground sm:text-sm">
                                <span className="inline-flex items-center gap-1">
                                    <BookOpen className="size-3.5" /> 5 lessons
                                </span>
                                <span className="inline-flex items-center gap-1">
                                    <Clock className="size-3.5" /> ~35 min
                                </span>
                                <span className="rounded-full bg-muted px-2 py-0.5">Beginner</span>
                            </div>
                        </div>

                        <AnimatePresence>
                            {examReady && (
                                <motion.div
                                    initial={reduce ? false : { opacity: 0, scale: 0.85, y: 6 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    transition={{ type: 'spring', bounce: 0.4, duration: 0.6 }}
                                    className="inline-flex w-fit shrink-0 items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                                    <Target className="size-4" />
                                    Exam: 8/10
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* progress */}
                    <div className="mt-5">
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>{lessonsDone < LESSONS.length ? 'Building lessons…' : 'All lessons ready'}</span>
                            <span className="tabular-nums">
                                {lessonsDone}/{LESSONS.length}
                            </span>
                        </div>
                        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                            <div
                                className="h-full rounded-full bg-gradient-to-r from-primary to-sky-500 transition-[width] duration-500 ease-out"
                                style={{ width: `${(lessonsDone / LESSONS.length) * 100}%` }}
                            />
                        </div>
                    </div>

                    <ol className="mt-4 space-y-2">
                        {LESSONS.map((lesson, i) => {
                            const ready = i < lessonsDone
                            const building = i === lessonsDone && !examReady
                            return (
                                <li
                                    key={lesson.title}
                                    className={cn(
                                        'flex items-center gap-3 rounded-xl border px-3 py-2.5 transition-all duration-500',
                                        ready
                                            ? 'border-border bg-background opacity-100'
                                            : building
                                              ? 'border-dashed border-primary/30 bg-primary/5 opacity-100'
                                              : 'border-dashed border-border bg-transparent opacity-40'
                                    )}>
                                    <span
                                        className={cn(
                                            'flex size-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold',
                                            ready ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                                        )}>
                                        {i + 1}
                                    </span>
                                    <span className={cn('min-w-0 flex-1 truncate text-sm font-medium', !ready && 'text-muted-foreground')}>
                                        {ready || building ? lesson.title : 'Lesson ' + (i + 1)}
                                    </span>
                                    <span className="hidden text-xs text-muted-foreground sm:inline">{lesson.minutes} min</span>
                                    {ready ? (
                                        <CircleCheck className="size-4 shrink-0 text-emerald-500" />
                                    ) : building ? (
                                        <LoaderCircle className="size-4 shrink-0 animate-spin text-primary motion-reduce:animate-none" />
                                    ) : (
                                        <span className="size-4 shrink-0" />
                                    )}
                                </li>
                            )
                        })}
                    </ol>

                    <div
                        className={cn(
                            'mt-4 flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-sm transition-opacity duration-500',
                            examReady ? 'opacity-100' : 'opacity-0'
                        )}>
                        <RotateCcw className="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-amber-400" />
                        <p className="text-foreground/90">
                            <span className="font-semibold">Review next:</span> Mitosis phases and membrane transport. You
                            missed 2 questions there.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
