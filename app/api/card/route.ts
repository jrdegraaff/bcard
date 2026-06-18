import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET() {
  const user = await getSession()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  return NextResponse.json({ card: user.card })
}

export async function PUT(req: NextRequest) {
  const user = await getSession()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { name, title, company, email, phone, website, linkedin, bio } = await req.json()
  if (!name || !email) {
    return NextResponse.json({ error: 'Name and email are required' }, { status: 400 })
  }

  const card = await db.card.upsert({
    where: { userId: user.id },
    update: { name, title, company, email, phone, website, linkedin, bio },
    create: { userId: user.id, name, title, company, email, phone, website, linkedin, bio },
  })
  return NextResponse.json({ card })
}
