import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(req: NextRequest) {
  const { cardId, name, email, phone, company, title, note } = await req.json()
  if (!cardId || !name || !email) {
    return NextResponse.json({ error: 'cardId, name and email are required' }, { status: 400 })
  }

  const card = await db.card.findUnique({ where: { id: cardId } })
  if (!card) return NextResponse.json({ error: 'Card not found' }, { status: 404 })

  const exchange = await db.exchange.create({
    data: { cardId, ownerId: card.userId, name, email, phone, company, title, note },
  })
  return NextResponse.json({ exchange })
}
