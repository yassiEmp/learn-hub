import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export function FinalCta() {
    return (
        <section className="px-4 py-20 sm:px-6 sm:py-28">
            <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-sky-600 px-6 py-14 text-center text-white shadow-2xl shadow-primary/30 sm:px-12 sm:py-20">
                <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_60%_at_80%_0%,rgba(255,255,255,0.25),transparent_70%)]"
                />
                <div className="relative">
                    <h2 className="mx-auto max-w-2xl text-balance text-3xl font-bold tracking-tight sm:text-5xl">
                        Your next exam starts with what you already have
                    </h2>
                    <p className="mx-auto mt-4 max-w-xl text-pretty text-base text-white/85 sm:text-lg">
                        Drop in your notes, a PDF or a link and get a structured course with an exam in minutes.
                    </p>
                    <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                        <Link
                            href="/login?mode=signup"
                            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-primary shadow-lg transition hover:bg-white/90 sm:w-auto">
                            Get started free
                            <ArrowRight className="size-4" aria-hidden />
                        </Link>
                        <a
                            href="#how"
                            className="inline-flex w-full items-center justify-center rounded-full border border-white/40 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10 sm:w-auto">
                            See how it works
                        </a>
                    </div>
                    <p className="mt-4 text-sm text-white/75">Free to start. No credit card.</p>
                </div>
            </div>
        </section>
    )
}
