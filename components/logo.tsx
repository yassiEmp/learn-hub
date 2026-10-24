import { cn } from '@/lib/utils'

/** FlashMind mark: a lightning-bolt "flash" inside a rounded tile. */
export const LogoIcon = ({ className }: { className?: string }) => {
    return (
        <span
            aria-hidden="true"
            className={cn(
                'inline-flex size-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-sky-500 text-white shadow-sm shadow-primary/30',
                className
            )}>
            <svg viewBox="0 0 24 24" fill="none" className="size-[55%]">
                <path
                    d="M13.5 2.5 5 13.25h6L10.25 21.5 19 10.25h-6l.5-7.75Z"
                    fill="currentColor"
                    stroke="currentColor"
                    strokeWidth={1.25}
                    strokeLinejoin="round"
                />
            </svg>
        </span>
    )
}

export const Logo = ({ className }: { className?: string }) => {
    return (
        <span className={cn('inline-flex items-center gap-2 text-foreground', className)}>
            <LogoIcon />
            <span className="text-lg font-bold tracking-tight">
                Flash<span className="text-primary">Mind</span>
            </span>
        </span>
    )
}
