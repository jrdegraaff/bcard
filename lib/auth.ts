import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { db } from './db'

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET ?? 'change-me-in-production'
)

export const COOKIE_NAME = 'qrc_session'

export async function createMagicToken(email: string): Promise<string> {
  const token = crypto.randomUUID()
  await db.authToken.create({
    data: {
      token,
      email,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000),
    },
  })
  return token
}

export async function verifyMagicToken(token: string) {
  const record = await db.authToken.findUnique({ where: { token } })
  if (!record || record.used || record.expiresAt < new Date()) return null
  await db.authToken.update({ where: { token }, data: { used: true } })
  let user = await db.user.findUnique({ where: { email: record.email } })
  if (!user) user = await db.user.create({ data: { email: record.email } })
  return user
}

export async function createSession(userId: string): Promise<string> {
  return new SignJWT({ userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('30d')
    .sign(secret)
}

export async function getSession() {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (!token) return null
  try {
    const { payload } = await jwtVerify(token, secret)
    return db.user.findUnique({
      where: { id: payload.userId as string },
      include: { card: true },
    })
  } catch {
    return null
  }
}
