'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SOURCES, type SourceType } from './sources-data'
import { CoursePreview } from './course-preview'

const SIGNUP_HREF = '/login?mode=signup'

export function Hero() {
    const router = useRouter()
    const [active, setActive] = React.useState<SourceType['id']>('text')
    const [value, setValue] = React.useState('')
    const current = SOURCES.find((s) => s.id === active) ?? SOURCES[0]

    const go = (e?: React.FormEvent) => {
        e?.preventDefault()
        router.push(SIGNUP_HREF)
    }

    return (
        <section className="relative isolate overflow-hidden pt-28 sm:pt-36">
            {/* soft background glow */}
            <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[720px] bg-[radial-gradient(60%_55%_at_50%_0%,color-mix(in_oklab,var(--color-primary)_18%,transparent),transparent_75%)]"
            />
            <div aria-hidden className="landing-grid pointer-events-none absolute inset-x-0 top-0 -z-10 h-[620px]" />

            <div className="mx-auto max-w-6xl px-4 sm:px-6">
                <div className="mx-auto max-w-3xl text-center">
                    <p className="landing-fade-up mx-auto inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary sm:text-sm">
                        <span className="size-1.5 rounded-full bg-primary" aria-hidden />
                        AI course generator for anything you need to learn
                    </p>

                    <h1 className="landing-fade-up mt-6 text-balance text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
                        Turn anything into a course{' '}
                        <span className="bg-gradient-to-r from-primary to-sky-500 bg-clip-text text-transparent">
                            you&apos;ll actually finish
                        </span>
                    </h1>

                    <p className="landing-fade-up mx-auto mt-5 max-w-xl text-pretty text-base text-muted-foreground sm:text-lg">
                        Drop in notes, a PDF, a link or a topic. FlashMind builds bite-sized lessons, then quizzes you so you
                        know exactly what to review.
                    </p>
                </div>

                {/* Demo-first input bar */}
                <form
                    onSubmit={go}
                    aria-label="Start a course"
                    className="landing-fade-up mx-auto mt-8 max-w-2xl rounded-2xl border border-border bg-card p-2 shadow-xl shadow-primary/10 ring-1 ring-black/[0.02] sm:mt-10">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                        <label htmlFor="hero-input" className="sr-only">
                            What do you want to learn?
                        </label>
                        <div className="flex min-w-0 flex-1 items-center gap-3 px-3">
                            <current.icon className="size-5 shrink-0 text-primary" aria-hidden />
                            <input
                                id="hero-input"
                                type="text"
                                value={value}
                                onChange={(e) => setValue(e.target.value)}
                                placeholder={current.placeholder}
                                autoComplete="off"
                                className="h-12 w-full min-w-0 bg-transparent text-base text-foreground placeholder:text-muted-foreground/80 focus:outline-none"
                            />
                        </div>
                        <button
                            type="submit"
                            className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/30 transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background">
                            Build my course
                            <ArrowRight className="size-4" aria-hidden />
                        </button>
                    </div>

                    <div className="mt-2 flex flex-wrap gap-1.5 border-t border-border/70 px-2 pb-1 pt-3" role="group" aria-label="Source type">
                        {SOURCES.map((s) => {
                            const selected = s.id === active
                            return (
                                <button
                                    key={s.id}
                                    type="button"
                                    aria-pressed={selected}
                                    onClick={() => setActive(s.id)}
                                    className={cn(
                                        'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors sm:text-sm',
                                        selected
                                            ? 'border-primary/30 bg-primary/10 text-primary'
                                            : 'border-border bg-background text-muted-foreground hover:border-primary/30 hover:text-foreground'
                                    )}>
                                    <s.icon className="size-3.5" aria-hidden />
                                    {s.label}
                                </button>
                            )
                        })}
                    </div>
                </form>

                <ul className="landing-fade-up mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
                    {['Free to start', 'No credit card', 'Course outline in seconds'].map((t) => (
                        <li key={t} className="inline-flex items-center gap-1.5">
                            <Check className="size-4 text-primary" aria-hidden />
                            {t}
                        </li>
                    ))}
                </ul>

                <div className="relative mx-auto mt-12 max-w-3xl pb-16 sm:mt-16 sm:pb-24">
                    <CoursePreview />
                </div>
            </div>
        </section>
    )
}
