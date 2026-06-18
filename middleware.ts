import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET ?? 'change-me-in-production'
)

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('qrc_session')?.value
  if (!token) return NextResponse.redirect(new URL('/login', req.url))
  try {
    await jwtVerify(token, secret)
    return NextResponse.next()
  } catch {
    return NextResponse.redirect(new URL('/login', req.url))
  }
}

export const config = { matcher: ['/dashboard/:path*'] }
