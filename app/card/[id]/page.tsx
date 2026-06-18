import { db } from '@/lib/db'
import { notFound } from 'next/navigation'
import BusinessCard from '@/components/BusinessCard'
import ExchangeForm from '@/components/ExchangeForm'
import type { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const card = await db.card.findUnique({ where: { id } })
  if (!card) return { title: 'Card not found' }
  return {
    title: `${card.name}'s Card`,
    description: card.bio ?? `Connect with ${card.name}${card.company ? ` at ${card.company}` : ''}`,
  }
}

export default async function CardPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const card = await db.card.findUnique({ where: { id } })
  if (!card) notFound()

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6">
      <div className="max-w-sm mx-auto pt-8 space-y-4">
        <BusinessCard card={card} showVCard />
        <ExchangeForm cardId={card.id} ownerName={card.name} />
      </div>
    </main>
  )
}
