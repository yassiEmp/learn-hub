import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { waitlistEmails } from '@/lib/db/schema'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null)
    const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : ''
    if (!email || email.length > 320 || !EMAIL_RE.test(email)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }

    await db.insert(waitlistEmails).values({ email }).onConflictDoNothing()

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Waitlist insert failed:', err)
    return NextResponse.json({ error: 'Something went wrong, please try again later' }, { status: 500 })
  }
}
