import { cn } from '@/lib/utils'
import { Card } from '@/components/ui/card'
import { Check, FileText, Globe, Lightbulb, Mic, Type, Youtube, X } from 'lucide-react'

export default function FeaturesSection() {
    return (
        <section>
            <div className="bg-background/50 py-24" id='Features'>
                <div className="mx-auto w-full max-w-5xl px-6">
                    <div>
                        <h2 className="text-foreground mt-4 text-4xl font-semibold">Everything you need to learn it, not just read it</h2>
                        <p className="text-muted-foreground mb-12 mt-4 text-balance text-lg">FlashMind does the slow part (structuring the material and writing the questions) so your time goes into actually learning.</p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <Card className="p-6 lg:col-span-3">
                            <div className="flex aspect-video items-center justify-center">
                                <ExamIllustration className="w-full max-w-md" />
                            </div>
                            <div className="text-center">
                                <h3 className="text-foreground text-xl font-semibold">An exam written from your material</h3>
                                <p className="text-muted-foreground mt-4 text-balance text-lg">No more writing your own practice questions. FlashMind reads what you uploaded and builds an exam from it, so every question is about what you actually need to know.</p>
                            </div>
                        </Card>
                        <Card className="p-6">
                            <div className="flex aspect-video items-center justify-center">
                                <FormatsIllustration className="w-full" />
                            </div>
                            <div className="text-center">
                                <h3 className="text-foreground text-xl font-semibold">Six ways in</h3>
                                <p className="text-muted-foreground mt-4 text-balance text-lg">Notes, PDFs, web articles, YouTube, audio, or just a topic. No copy-pasting or converting.</p>
                            </div>
                        </Card>
                        <Card className="p-6 md:col-span-2">
                            <div className="flex aspect-video items-center justify-center">
                                <QuestionTypesIllustration className="w-full max-w-sm" />
                            </div>
                            <div className="text-center">
                                <h3 className="text-foreground text-xl font-semibold">Questions that test understanding</h3>
                                <p className="text-muted-foreground mt-4 text-balance text-lg">Multiple choice, true/false and fill-in-the-blank, so you can&apos;t pass on recognition alone.</p>
                            </div>
                        </Card>
                        <Card className="p-6">
                            <div className="flex aspect-video items-center justify-center">
                                <ScoreIllustration className="w-full" />
                            </div>
                            <div className="text-center">
                                <h3 className="text-foreground text-xl font-semibold">Know what to review</h3>
                                <p className="text-muted-foreground mt-4 text-balance text-lg">See your score and every answer you missed, then jump back to the lesson that covers it.</p>
                            </div>
                        </Card>
                        <Card className="p-6 col-span-1 sm:col-span-2 md:col-span-1">
                            <div className="flex aspect-video items-center justify-center">
                                <LessonsIllustration className="w-full" />
                            </div>
                            <div className="text-center">
                                <h3 className="text-foreground text-xl font-semibold">Bite-sized lessons</h3>
                                <p className="text-muted-foreground mt-4 text-balance text-lg">Long material is split into short lessons with clear objectives and a key takeaway each.</p>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </section>
    )
}

type IllustrationProps = { className?: string }

const ExamIllustration = ({ className }: IllustrationProps) => (
    <div aria-hidden className={cn('relative', className)}>
        <div className="bg-background absolute -top-4 left-2 flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs shadow-sm">
            <FileText className="size-3.5 text-primary" />
            <span className="text-muted-foreground">biology-ch4.pdf</span>
            <span className="text-foreground font-medium">→ 12 questions</span>
        </div>
        <div className="bg-background rounded-2xl border p-4 pt-6 shadow-lg shadow-zinc-950/5">
            <p className="text-muted-foreground text-[11px] font-medium uppercase tracking-wide">Question 3 of 12</p>
            <p className="text-foreground mt-1 text-sm font-medium">Where in the cell does photosynthesis take place?</p>
            <div className="mt-3 space-y-1.5 text-sm">
                <div className="flex items-center gap-2 rounded-lg border px-3 py-1.5 text-muted-foreground"><span className="size-3 rounded-full border" />Mitochondria</div>
                <div className="flex items-center gap-2 rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-1.5 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300"><Check className="size-3.5" />Chloroplasts</div>
                <div className="flex items-center gap-2 rounded-lg border px-3 py-1.5 text-muted-foreground"><span className="size-3 rounded-full border" />Nucleus</div>
            </div>
        </div>
    </div>
)

const FormatsIllustration = ({ className }: IllustrationProps) => {
    const sources = [
        { icon: Type, label: 'Text' },
        { icon: FileText, label: 'PDF' },
        { icon: Globe, label: 'URL' },
        { icon: Youtube, label: 'YouTube' },
        { icon: Lightbulb, label: 'Topic' },
        { icon: Mic, label: 'Audio' },
    ]
    return (
        <div aria-hidden className={cn('grid grid-cols-3 gap-2', className)}>
            {sources.map(({ icon: Icon, label }) => (
                <div key={label} className="bg-background flex flex-col items-center gap-1 rounded-xl border py-2 shadow-sm">
                    <Icon className="size-4 text-primary" />
                    <span className="text-muted-foreground text-[10px]">{label}</span>
                </div>
            ))}
        </div>
    )
}

const QuestionTypesIllustration = ({ className }: IllustrationProps) => (
    <div aria-hidden className={cn('space-y-2 text-xs', className)}>
        <div className="bg-background flex items-center justify-between rounded-xl border px-3 py-2 shadow-sm">
            <span className="text-foreground">Light energy is stored as glucose.</span>
            <span className="flex gap-1">
                <span className="rounded-md bg-primary px-2 py-0.5 text-primary-foreground">True</span>
                <span className="rounded-md border px-2 py-0.5 text-muted-foreground">False</span>
            </span>
        </div>
        <div className="bg-background rounded-xl border px-3 py-2 shadow-sm">
            <span className="text-foreground">Plants release </span>
            <span className="inline-block min-w-16 border-b-2 border-primary text-center font-medium text-primary">oxygen</span>
            <span className="text-foreground"> as a by-product.</span>
        </div>
        <div className="bg-background flex items-center gap-2 rounded-xl border px-3 py-2 shadow-sm">
            <span className="rounded-md bg-primary/10 px-1.5 py-0.5 font-medium text-primary">A</span>
            <span className="text-foreground">Calvin cycle</span>
            <span className="text-muted-foreground ml-auto">B · C · D</span>
        </div>
    </div>
)

const ScoreIllustration = ({ className }: IllustrationProps) => (
    <div aria-hidden className={cn('flex flex-col items-center gap-3', className)}>
        <div className="relative size-20">
            <svg viewBox="0 0 36 36" className="size-20 -rotate-90">
                <circle cx="18" cy="18" r="15.5" fill="none" className="stroke-muted" strokeWidth="3.5" />
                <circle cx="18" cy="18" r="15.5" fill="none" className="stroke-primary" strokeWidth="3.5" strokeDasharray="78 97.4" strokeLinecap="round" />
            </svg>
            <span className="text-foreground absolute inset-0 flex items-center justify-center text-lg font-semibold">8/10</span>
        </div>
        <div className="flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-[11px] text-red-700 dark:bg-red-950/40 dark:text-red-300">
            <X className="size-3" />Review: Light reactions
        </div>
    </div>
)

const LessonsIllustration = ({ className }: IllustrationProps) => (
    <div aria-hidden className={cn('space-y-1.5 text-xs', className)}>
        {['What is photosynthesis', 'Light reactions', 'The Calvin cycle'].map((title, i) => (
            <div key={title} className="bg-background flex items-center gap-2 rounded-lg border px-2.5 py-1.5 shadow-sm">
                <span className={cn('flex size-4 items-center justify-center rounded-full text-[9px]', i < 2 ? 'bg-primary text-primary-foreground' : 'border text-muted-foreground')}>
                    {i < 2 ? <Check className="size-2.5" /> : i + 1}
                </span>
                <span className={i < 2 ? 'text-muted-foreground' : 'text-foreground font-medium'}>{title}</span>
            </div>
        ))}
        <div className="bg-muted mt-2 h-1.5 overflow-hidden rounded-full"><div className="h-full w-2/3 rounded-full bg-primary" /></div>
    </div>
)
