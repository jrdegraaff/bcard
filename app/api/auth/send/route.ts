import { NextRequest, NextResponse } from 'next/server'
import { createMagicToken } from '@/lib/auth'
import { sendMagicLink } from '@/lib/email'

export async function POST(req: NextRequest) {
  const { email } = await req.json()
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
  }
  const token = await createMagicToken(email)
  await sendMagicLink(email, token)
  return NextResponse.json({ ok: true })
}
