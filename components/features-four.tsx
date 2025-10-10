'use client'
import { cn } from '@/lib/utils'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Bold, Calendar1, Ellipsis, Italic, Strikethrough, Underline, Zap, Upload, HelpCircle, Brain, TrendingUp, FileText, BookOpen, Target } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/card'

export default function FeaturesSection() {
    return (
        <section>
            <div className="bg-background/50 py-24" id='Features'>
                <div className="mx-auto w-full max-w-5xl px-6">
                    <div>
                        <h2 className="text-foreground mt-4 text-4xl font-semibold">All you need to Learn Fast </h2>
                        <p className="text-muted-foreground mb-12 mt-4 text-balance text-lg">Transform any content into comprehensive learning experiences with our AI-powered platform. Stop wasting hours creating practice questions and start learning smarter.</p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <Card className="p-6 lg:col-span-3 ">
                            <div className="flex aspect-video items-center justify-center">
                                <ExamGenerationIllustration className="w-full" />
                            </div>
                            <div className="text-center">
                                <h3 className="text-foreground text-xl font-semibold">Automatic Exam Generation</h3>
                                <p className="text-muted-foreground mt-4 text-balance text-lg">Stop wasting hours creating practice questions. Our proprietary system instantly transforms any text, PDF, or YouTube video into quizzes, flashcards, and exams tailored to your material.</p>
                            </div>
                        </Card>
                        <Card className="p-6">
                            <div className="flex aspect-video items-center justify-center">
                                <MultipleFormatsIllustration className="w-full" />
                            </div>
                            <div className="text-center">
                                <h3 className="text-foreground text-xl font-semibold">Supports Multiple Formats</h3>
                                <p className="text-muted-foreground mt-4 text-balance text-lg">Whether it&apos;s lecture notes, textbooks, or videos, our platform handles them all. No conversions, no manual input — just upload and learn.</p>
                            </div>
                        </Card>
                        <Card className="p-6 md:col-span-2">
                            <div className="flex aspect-video items-center justify-center">
                                <QuestionTypesIllustration className="w-full" />
                            </div>
                            <div className="text-center">
                                <h3 className="text-foreground text-xl font-semibold">Multiple Question Types</h3>
                                <p className="text-muted-foreground mt-4 text-balance text-lg">MCQs, fill-in-the-blank, true/false questions, and flashcards — all automatically generated to test your knowledge from every angle.</p>
                            </div>
                        </Card>
                        <Card className="p-6">
                            <div className="flex aspect-video items-center justify-center">
                                <FeedbackIllustration className="w-full" />
                            </div>
                            <div className="text-center">
                                <h3 className="text-foreground text-xl font-semibold">Detailed Feedback & Knowledge Insights</h3>
                                <p className="text-muted-foreground mt-4 text-balance text-lg">After each exam, get a breakdown of your strengths and weaknesses, along with actionable recommendations to focus your study time effectively.</p>
                            </div>
                        </Card>
                        <Card className="p-6 col-span-1 sm:col-span-2 md:col-span-1">
                            <div className="flex aspect-video items-center justify-center">
                                <ProgressTrackingIllustration className="w-full" />
                            </div>
                            <div className="text-center">
                                <h3 className="text-foreground text-xl font-semibold">Progress Tracking & Analytics</h3>
                                <p className="text-muted-foreground mt-4 text-balance text-lg">Track your learning journey over time. See your improvements, identify persistent gaps, and measure your mastery across topics.</p>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </section>
    )
}

type IllustrationProps = {
    className?: string
    variant?: 'elevated' | 'outlined' | 'mixed'
}

export const ScheduleIllustation = ({ className, variant = 'elevated' }: IllustrationProps) => {
    return (
        <div className={cn('relative', className)}>
            <div
                className={cn('bg-background -translate-x-1/8 absolute flex -translate-y-[110%] items-center gap-2 rounded-lg p-1', {
                    'shadow-black-950/10 shadow-lg': variant === 'elevated',
                    'border-foreground/10 border': variant === 'outlined',
                    'border-foreground/10 border shadow-md shadow-black/5': variant === 'mixed',
                })}>
                <Button
                    size="sm"
                    className="rounded-sm">
                    <Calendar1 className="size-3" />
                    <span className="text-sm font-medium">Schedule</span>
                </Button>
                <span className="bg-border block h-4 w-px"></span>
                <ToggleGroup
                    type="multiple"
                    size="sm"
                    className="gap-0.5 *:rounded-md">
                    <ToggleGroupItem
                        value="bold"
                        aria-label="Toggle bold">
                        <Bold className="size-4" />
                    </ToggleGroupItem>
                    <ToggleGroupItem
                        value="italic"
                        aria-label="Toggle italic">
                        <Italic className="size-4" />
                    </ToggleGroupItem>
                    <ToggleGroupItem
                        value="underline"
                        aria-label="Toggle underline">
                        <Underline className="size-4" />
                    </ToggleGroupItem>
                    <ToggleGroupItem
                        value="strikethrough"
                        aria-label="Toggle strikethrough">
                        <Strikethrough className="size-4" />
                    </ToggleGroupItem>
                </ToggleGroup>
                <span className="bg-border block h-4 w-px"></span>
                <Button
                    size="icon"
                    className="size-8"
                    variant="ghost">
                    <Ellipsis className="size-3" />
                </Button>
            </div>
            <span>
                <span className="bg-secondary text-secondary-foreground py-1">Tomorrow 8:30 pm</span> is our priority.
            </span>
        </div>
    )
}

export const ExamGenerationIllustration = ({ className }: { className?: string }) => {
    return (
        <div className={cn('flex items-center justify-center space-x-2', className)}>
            <div className="flex flex-col items-center space-y-2">
                <FileText className="w-8 h-8 text-primary" />
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            </div>
            <div className="flex items-center space-x-1">
                <div className="w-1 h-8 bg-muted-foreground/30 rounded-full" />
                <div className="w-1 h-6 bg-muted-foreground/50 rounded-full" />
                <div className="w-1 h-10 bg-primary rounded-full" />
                <div className="w-1 h-4 bg-muted-foreground/40 rounded-full" />
            </div>
            <div className="flex flex-col items-center space-y-2">
                <Zap className="w-8 h-8 text-primary" />
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            </div>
        </div>
    )
}

export const MultipleFormatsIllustration = ({ className }: { className?: string }) => {
    return (
        <div className={cn('flex items-center justify-center space-x-3', className)}>
            <div className="flex flex-col items-center space-y-1">
                <FileText className="w-6 h-6 text-blue-500" />
                <span className="text-xs text-muted-foreground">PDF</span>
            </div>
            <div className="flex flex-col items-center space-y-1">
                <BookOpen className="w-6 h-6 text-green-500" />
                <span className="text-xs text-muted-foreground">Text</span>
            </div>
            <div className="flex flex-col items-center space-y-1">
                <Upload className="w-6 h-6 text-purple-500" />
                <span className="text-xs text-muted-foreground">Video</span>
            </div>
        </div>
    )
}

export const QuestionTypesIllustration = ({ className }: { className?: string }) => {
    return (
        <div className={cn('flex flex-col items-center space-y-2', className)}>
            <div className="flex space-x-2">
                <div className="w-8 h-6 bg-primary/20 rounded flex items-center justify-center">
                    <HelpCircle className="w-4 h-4 text-primary" />
                </div>
                <div className="w-8 h-6 bg-secondary rounded flex items-center justify-center">
                    <span className="text-xs font-bold">A</span>
                </div>
            </div>
            <div className="flex space-x-2">
                <div className="w-8 h-6 bg-muted rounded flex items-center justify-center">
                    <span className="text-xs">Fill</span>
                </div>
                <div className="w-8 h-6 bg-accent rounded flex items-center justify-center">
                    <span className="text-xs">True/False</span>
                </div>
            </div>
        </div>
    )
}

export const FeedbackIllustration = ({ className }: { className?: string }) => {
    return (
        <div className={cn('flex items-center justify-center space-x-2', className)}>
            <div className="flex flex-col items-center space-y-1">
                <Brain className="w-8 h-8 text-primary" />
                <div className="w-12 h-2 bg-muted rounded-full overflow-hidden">
                    <div className="w-8 h-full bg-primary rounded-full" />
                </div>
            </div>
            <div className="flex flex-col items-center space-y-1">
                <Target className="w-6 h-6 text-green-500" />
                <div className="w-2 h-2 bg-green-500 rounded-full" />
            </div>
        </div>
    )
}

export const ProgressTrackingIllustration = ({ className }: { className?: string }) => {
    return (
        <div className={cn('flex items-center justify-center', className)}>
            <div className="flex flex-col items-center space-y-2">
                <TrendingUp className="w-8 h-8 text-primary" />
                <div className="flex space-x-1">
                    <div className="w-2 h-4 bg-muted-foreground/30 rounded-t" />
                    <div className="w-2 h-6 bg-muted-foreground/50 rounded-t" />
                    <div className="w-2 h-8 bg-primary rounded-t" />
                    <div className="w-2 h-10 bg-primary rounded-t" />
                </div>
            </div>
        </div>
    )
}
