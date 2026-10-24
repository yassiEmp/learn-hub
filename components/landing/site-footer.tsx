import Link from 'next/link'
import { Logo } from '@/components/logo'

const COLUMNS = [
    {
        title: 'Product',
        links: [
            { label: 'How it works', href: '#how' },
            { label: 'Features', href: '#features' },
            { label: 'Who it’s for', href: '#use-cases' },
            { label: 'FAQ', href: '#faq' },
        ],
    },
    {
        title: 'Account',
        links: [
            { label: 'Get started free', href: '/login?mode=signup' },
            { label: 'Log in', href: '/login' },
        ],
    },
]

export function SiteFooter() {
    return (
        <footer className="border-t border-border bg-background">
            <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[2fr_1fr_1fr]">
                <div>
                    <Link href="/" aria-label="FlashMind home" className="inline-block">
                        <Logo />
                    </Link>
                    <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
                        Turn notes, PDFs, links, videos and audio into structured courses and exams with AI.
                    </p>
                </div>
                {COLUMNS.map((col) => (
                    <div key={col.title}>
                        <h3 className="text-sm font-semibold">{col.title}</h3>
                        <ul className="mt-4 space-y-3 text-sm">
                            {col.links.map((l) =>
                                l.href.startsWith('#') ? (
                                    <li key={l.href}>
                                        <a href={l.href} className="text-muted-foreground transition-colors hover:text-foreground">
                                            {l.label}
                                        </a>
                                    </li>
                                ) : (
                                    <li key={l.href}>
                                        <Link href={l.href} className="text-muted-foreground transition-colors hover:text-foreground">
                                            {l.label}
                                        </Link>
                                    </li>
                                )
                            )}
                        </ul>
                    </div>
                ))}
            </div>
            <div className="border-t border-border">
                <p className="mx-auto max-w-6xl px-4 py-6 text-sm text-muted-foreground sm:px-6">
                    © {new Date().getFullYear()} FlashMind. All rights reserved.
                </p>
            </div>
        </footer>
    )
}
