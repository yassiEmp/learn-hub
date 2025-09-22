import { NextResponse } from 'next/server'
import { createServerClient } from '@/utils/supabase/server'

const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string 

const supabase = createServerClient(anonKey)

export async function POST(request: Request) {
  try {
    const { email } = await request.json()
    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }

    const { error } = await supabase.from('emails').insert({ email })
    if (error) {
        console.log(error)
      return NextResponse.json({ error: "something is wrong with the db try again later" }, { status: 400 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.log(err)
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 })
  }
}


