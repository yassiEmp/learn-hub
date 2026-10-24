import { CircleCheck, CircleX, FileText, Link2, Sparkles, Youtube } from 'lucide-react'
import { SectionHeading } from './section-heading'

function DropVisual() {
    return (
        <div className="flex h-full flex-col justify-center gap-2">
            {[
                { icon: FileText, label: 'chapter-4.pdf' },
                { icon: Youtube, label: 'Lecture 12 – Thermodynamics' },
                { icon: Link2, label: 'en.wikipedia.org/wiki/Entropy' },
            ].map(({ icon: Icon, label }, i) => (
                <div
                    key={label}
                    className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-xs shadow-sm"
                    style={{ marginLeft: `${i * 10}px` }}>
                    <Icon className="size-3.5 shrink-0 text-primary" />
                    <span className="truncate text-muted-foreground">{label}</span>
                </div>
            ))}
        </div>
    )
}

function BuildVisual() {
    return (
        <div className="flex h-full flex-col justify-center gap-2">
            <div className="inline-flex w-fit items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary">
                <Sparkles className="size-3" /> Thermodynamics 101
            </div>
            {['Energy and systems', 'The first law', 'Entropy, explained'].map((t, i) => (
                <div key={t} className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-xs shadow-sm">
                    <span className="flex size-5 shrink-0 items-center justify-center rounded-md bg-primary/10 text-[10px] font-bold text-primary">
                        {i + 1}
                    </span>
                    <span className="truncate">{t}</span>
                </div>
            ))}
        </div>
    )
}

function TestVisual() {
    return (
        <div className="flex h-full flex-col justify-center gap-2 text-xs">
            <div className="rounded-lg border border-border bg-background p-3 shadow-sm">
                <p className="font-medium">Entropy in an isolated system always…</p>
                <div className="mt-2 space-y-1.5">
                    <div className="flex items-center gap-2 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-1.5">
                        <CircleCheck className="size-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" /> increases or stays the same
                    </div>
                    <div className="flex items-center gap-2 rounded-md border border-border px-2 py-1.5 text-muted-foreground">
                        <CircleX className="size-3.5 shrink-0" /> decreases over time
                    </div>
                </div>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border bg-background px-3 py-2 shadow-sm">
                <span className="text-muted-foreground">Score</span>
                <span className="font-bold text-primary">9/10</span>
            </div>
        </div>
    )
}

const STEPS = [
    {
        title: 'Drop it in',
        body: 'Paste notes, upload a PDF, share a link or YouTube video, record audio, or just type a topic.',
        Visual: DropVisual,
    },
    {
        title: 'AI builds your lessons',
        body: 'FlashMind outlines a course, then writes short, focused lessons you can get through in one sitting.',
        Visual: BuildVisual,
    },
    {
        title: 'Test yourself',
        body: 'Take an exam built from the same material: multiple choice, fill-in-the-blank and true/false. See what to review.',
        Visual: TestVisual,
    },
]

export function HowItWorks() {
    return (
        <section id="how" className="scroll-mt-20 py-20 sm:py-28">
            <div className="mx-auto max-w-6xl px-4 sm:px-6">
                <SectionHeading
                    eyebrow="How it works"
                    title="From raw material to real understanding in 3 steps"
                    subtitle="No prompts to write, no course to design. Bring what you have and start learning."
                />

                <ol className="mt-14 grid gap-6 md:grid-cols-3">
                    {STEPS.map(({ title, body, Visual }, i) => (
                        <li key={title} className="flex flex-col rounded-2xl border border-border bg-card p-6 shadow-sm">
                            <div className="h-44 rounded-xl bg-muted/60 p-4">
                                <Visual />
                            </div>
                            <div className="mt-6 flex items-center gap-3">
                                <span className="flex size-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                                    {i + 1}
                                </span>
                                <h3 className="text-lg font-bold">{title}</h3>
                            </div>
                            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{body}</p>
                        </li>
                    ))}
                </ol>
            </div>
        </section>
    )
}
