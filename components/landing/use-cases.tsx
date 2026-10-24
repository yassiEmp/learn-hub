import { Briefcase, Check, Clapperboard, GraduationCap } from 'lucide-react'
import { SectionHeading } from './section-heading'

const CASES = [
    {
        icon: GraduationCap,
        who: 'Students',
        headline: 'Cram smarter before the exam',
        points: [
            'Turn a semester of slides into a revision course tonight',
            'Practice with questions written from your own notes',
            'Spend your last hours on the topics you got wrong',
        ],
    },
    {
        icon: Briefcase,
        who: 'Professionals',
        headline: 'Upskill between meetings',
        points: [
            'Learn a new tool from its docs instead of skimming them',
            'Short lessons that fit a lunch break',
            'Check you really understood before you apply it',
        ],
    },
    {
        icon: Clapperboard,
        who: 'Creators & teachers',
        headline: 'Turn your content into a course',
        points: [
            'Convert videos, posts or lectures into structured lessons',
            'Get a ready-made quiz for your audience or class',
            'Edit any lesson or question before you share it',
        ],
    },
]

export function UseCases() {
    return (
        <section id="use-cases" className="scroll-mt-20 py-20 sm:py-28">
            <div className="mx-auto max-w-6xl px-4 sm:px-6">
                <SectionHeading
                    eyebrow="Who it's for"
                    title="Built for people who need to actually learn it"
                    subtitle="Reading isn't learning. FlashMind adds structure and retrieval practice to whatever you're studying."
                />

                <div className="mt-14 grid gap-6 lg:grid-cols-3">
                    {CASES.map(({ icon: Icon, who, headline, points }) => (
                        <article key={who} className="flex flex-col rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
                            <div className="flex items-center gap-3">
                                <span className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-sky-500 text-white">
                                    <Icon className="size-5" aria-hidden />
                                </span>
                                <span className="text-sm font-semibold text-primary">{who}</span>
                            </div>
                            <h3 className="mt-5 text-xl font-bold tracking-tight sm:text-2xl">{headline}</h3>
                            <ul className="mt-5 space-y-3">
                                {points.map((p) => (
                                    <li key={p} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
                                        <Check className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
                                        <span>{p}</span>
                                    </li>
                                ))}
                            </ul>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    )
}
