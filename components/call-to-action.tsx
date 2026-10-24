import Link from 'next/link'

export default function CallToAction() {
    return (
        <section className="bg-muted py-16 md:py-32" id='call'>
            <div className="mx-auto max-w-5xl px-6">
                <div className="mx-auto max-w-md text-center">
                    <h2 className="text-balance text-3xl font-semibold md:text-4xl">Create, Learn and Succeed</h2>
                    <p className="text-muted-foreground mt-4 text-balance">Turn your next chapter, lecture or article into a course and an exam in a couple of minutes.</p>
                    <Link
                        href="/login?mode=signup"
                        className="mt-8 inline-flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap rounded-md text-sm font-medium h-10 px-5 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-md shadow-black/20 border-[0.5px] border-white/25 ring-1 ring-[--ring-color] [--ring-color:color-mix(in_oklab,var(--color-foreground)15%,var(--color-primary))]">
                        Build Your First Course Free
                    </Link>
                    <p className="text-muted-foreground mt-3 text-sm">No credit card required.</p>
                </div>
            </div>
        </section>
    )
}
