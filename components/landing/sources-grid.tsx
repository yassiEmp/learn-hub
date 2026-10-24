import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { SOURCES } from './sources-data'
import { SectionHeading } from './section-heading'

export function SourcesGrid() {
    return (
        <section id="features" className="scroll-mt-20 bg-muted/40 py-20 sm:py-28">
            <div className="mx-auto max-w-6xl px-4 sm:px-6">
                <SectionHeading
                    eyebrow="Features"
                    title="Six ways in. One structured course out."
                    subtitle="Whatever format your material is in, FlashMind turns it into lessons and an exam."
                />

                <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {SOURCES.map(({ id, icon: Icon, title, description, example }) => (
                        <li
                            key={id}
                            className="group rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md motion-reduce:transition-none motion-reduce:hover:translate-y-0">
                            <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                                <Icon className="size-5" aria-hidden />
                            </span>
                            <h3 className="mt-5 text-lg font-bold">{title}</h3>
                            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
                            <p className="mt-4 text-xs font-medium text-foreground/70">{example}</p>
                        </li>
                    ))}
                </ul>

                <div className="mt-10 text-center">
                    <Link
                        href="/login?mode=signup"
                        className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/30 transition hover:brightness-110">
                        Try it with your material
                        <ArrowRight className="size-4" aria-hidden />
                    </Link>
                </div>
            </div>
        </section>
    )
}
