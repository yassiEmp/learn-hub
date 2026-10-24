import { Logo } from '@/components/logo'
import Link from 'next/link'

const links = [
    { title: 'Benefits', href: '#Benefits' },
    { title: 'Features', href: '#Features' },
    { title: 'How it works', href: '#How' },
    { title: 'FAQ', href: '#FAQ' },
    { title: 'Log in', href: '/login' },
    { title: 'Sign up', href: '/login?mode=signup' },
]

export default function FooterSection() {
    return (
        <footer className="py-16 md:py-32 bg-muted">
            <div className="mx-auto max-w-5xl px-6">
                <Link
                    href="/"
                    aria-label="go home"
                    className="mx-auto block size-fit">
                    <Logo />
                </Link>

                <div className="my-8 flex flex-wrap justify-center gap-6 text-sm">
                    {links.map((link, index) => (
                        <Link
                            key={index}
                            href={link.href}
                            className="text-muted-foreground hover:text-primary block duration-150">
                            <span>{link.title}</span>
                        </Link>
                    ))}
                </div>
<span className="text-muted-foreground block text-center text-sm"> © {new Date().getFullYear()} FlashMind. All rights reserved.</span>
            </div>
        </footer>
    )
}
