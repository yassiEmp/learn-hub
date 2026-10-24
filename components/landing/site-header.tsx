'use client'

import Link from 'next/link'
import React from 'react'
import { Menu, X, ArrowRight } from 'lucide-react'
import { Logo } from '@/components/logo'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'

const navItems = [
    { name: 'How it works', href: '#how' },
    { name: 'Features', href: '#features' },
    { name: 'FAQ', href: '#faq' },
]

export function SiteHeader() {
    const { user, loading } = useAuth()
    const [open, setOpen] = React.useState(false)
    const [scrolled, setScrolled] = React.useState(false)

    React.useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 12)
        onScroll()
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    React.useEffect(() => {
        if (!open) return
        const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [open])

    const signedIn = !loading && !!user
    const primary = signedIn
        ? { label: 'Open app', href: '/dashboard' }
        : { label: 'Get started free', href: '/login?mode=signup' }

    return (
        <header
            className={cn(
                'fixed inset-x-0 top-0 z-50 transition-colors duration-300',
                scrolled || open
                    ? 'border-b border-border/70 bg-background/80 backdrop-blur-lg'
                    : 'border-b border-transparent bg-transparent'
            )}>
            <nav aria-label="Main" className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
                <Link href="/" aria-label="FlashMind home" className="shrink-0" onClick={() => setOpen(false)}>
                    <Logo />
                </Link>

                <ul className="hidden items-center gap-8 text-sm font-medium md:flex">
                    {navItems.map((item) => (
                        <li key={item.href}>
                            <a href={item.href} className="text-muted-foreground transition-colors hover:text-foreground">
                                {item.name}
                            </a>
                        </li>
                    ))}
                </ul>

                <div className="hidden items-center gap-2 md:flex">
                    {!signedIn && (
                        <Link
                            href="/login"
                            className="rounded-full px-4 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-muted hover:text-foreground">
                            Log in
                        </Link>
                    )}
                    <Link
                        href={primary.href}
                        className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm shadow-primary/30 transition hover:brightness-110">
                        {primary.label}
                        <ArrowRight className="size-4" aria-hidden />
                    </Link>
                </div>

                <button
                    type="button"
                    onClick={() => setOpen((v) => !v)}
                    aria-expanded={open}
                    aria-controls="mobile-menu"
                    aria-label={open ? 'Close menu' : 'Open menu'}
                    className="-mr-2 inline-flex size-10 items-center justify-center rounded-full text-foreground hover:bg-muted md:hidden">
                    {open ? <X className="size-5" /> : <Menu className="size-5" />}
                </button>
            </nav>

            {open && (
                <div id="mobile-menu" className="border-t border-border/70 bg-background px-4 pb-6 pt-2 shadow-lg md:hidden">
                    <ul className="flex flex-col">
                        {navItems.map((item) => (
                            <li key={item.href}>
                                <a
                                    href={item.href}
                                    onClick={() => setOpen(false)}
                                    className="block rounded-xl px-3 py-3 text-base font-medium text-foreground/90 hover:bg-muted">
                                    {item.name}
                                </a>
                            </li>
                        ))}
                    </ul>
                    <div className="mt-4 flex flex-col gap-2">
                        {!signedIn && (
                            <Link
                                href="/login"
                                onClick={() => setOpen(false)}
                                className="rounded-full border border-border px-4 py-3 text-center text-sm font-semibold hover:bg-muted">
                                Log in
                            </Link>
                        )}
                        <Link
                            href={primary.href}
                            onClick={() => setOpen(false)}
                            className="rounded-full bg-primary px-4 py-3 text-center text-sm font-semibold text-primary-foreground">
                            {primary.label}
                        </Link>
                    </div>
                </div>
            )}
        </header>
    )
}
