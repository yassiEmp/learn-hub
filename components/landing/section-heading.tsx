import { cn } from '@/lib/utils'

export function SectionHeading({
    eyebrow,
    title,
    subtitle,
    className,
}: {
    eyebrow: string
    title: React.ReactNode
    subtitle?: React.ReactNode
    className?: string
}) {
    return (
        <div className={cn('mx-auto max-w-2xl text-center', className)}>
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">{eyebrow}</p>
            <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">{title}</h2>
            {subtitle && <p className="mx-auto mt-4 max-w-xl text-pretty text-base text-muted-foreground sm:text-lg">{subtitle}</p>}
        </div>
    )
}
