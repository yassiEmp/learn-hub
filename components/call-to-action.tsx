"use client"
import React from 'react'

export default function CallToAction() {
    const [email, setEmail] = React.useState('')
    const [loading, setLoading] = React.useState(false)
    const [message, setMessage] = React.useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!email) return
        setLoading(true)
        setMessage(null)
        try {
            const res = await fetch('/api/waitlist', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            })
            if (!res.ok) {
                const data = await res.json().catch(() => ({}))
                throw new Error(data?.error || 'Request failed')
            }
            setMessage('Thanks! You\'re on the list.')
            setEmail('')
        } catch (err) {
            setMessage('Something went wrong. Please try again.')
            console.log(err)
        } finally {
            setLoading(false)
        }
    }
    return (
        <section className="bg-muted dark:bg-background py-16 md:py-32 min-h-screen flex justify-center items-center" id='call'>
            <div className="mx-auto max-w-5xl px-6">
                <div className="mx-auto max-w-md text-center">
                    <h2 className="text-balance text-3xl font-semibold md:text-4xl">Create, Learn and Succeed</h2>
                    <p className="text-muted-foreground mt-4 text-balance">Join a community of over 100+ learner and teacher who have already discovered the power of flashmind.</p>
                    
                    <form className="mx-auto my-6 w-full max-w-xs" onSubmit={handleSubmit}>
                        <label 
                            className="select-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50 group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 sr-only block text-sm font-medium" 
                            htmlFor="email"
                        >
                            Join Waitlist
                        </label>
                        <div className="flex gap-2 items-center flex-col sm:flex-row">
                            <input 
                                type="email" 
                                className="file:text-foreground placeholder:text-muted-foreground/75 border-gr selection:bg-primary selection:text-primary-foreground flex w-full min-w-0 rounded-md border px-3 py-1 text-base outline-none transition-[color,box-shadow] file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-foreground/35 focus-visible:ring-ring/25 dark:focus-visible:border-foreground/25 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive bg-background ring-foreground/10 h-8 border-transparent shadow " 
                                placeholder="Your email" 
                                id="email" 
                                required 
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <button 
                                className="cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 shadow-md border-[0.5px] border-white/25 shadow-black/20 [&_svg]:drop-shadow-sm not-in-data-[theme=dark]:text-shadow-sm bg-primary ring-1 ring-[--ring-color] [--ring-color:color-mix(in_oklab,var(--color-foreground)15%,var(--color-primary))] text-primary-foreground hover:bg-primary/90 h-8 rounded-md px-3 text-xs" 
                                type="submit"
                                disabled={loading}
                            >
                                <span>{loading ? 'Submitting...' : 'Join Waitlist'}</span>
                            </button>
                        </div>
                    </form>
                    {message && (
                        <p className="text-sm mt-2" aria-live="polite">{message}</p>
                    )}
                    
                    <p className="text-muted-foreground text-sm">
                        <span className="text-foreground font-mono font-semibold">78</span> Companies Joined Today
                    </p>
                </div>
            </div>
        </section>
    )
}
