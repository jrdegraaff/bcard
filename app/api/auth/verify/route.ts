import { NextRequest, NextResponse } from 'next/server'
import { verifyMagicToken, createSession, COOKIE_NAME } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token')
  if (!token) return NextResponse.redirect(new URL('/login?error=invalid', req.url))

  const user = await verifyMagicToken(token)
  if (!user) return NextResponse.redirect(new URL('/login?error=expired', req.url))

  const jwt = await createSession(user.id)
  const res = NextResponse.redirect(new URL('/dashboard', req.url))
  res.cookies.set(COOKIE_NAME, jwt, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30,
    path: '/',
  })
  return res
}
