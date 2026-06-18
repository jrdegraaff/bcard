import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { generateVCard } from '@/lib/vcard'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const card = await db.card.findUnique({ where: { id } })
  if (!card) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const vcf = generateVCard(card)
  return new NextResponse(vcf, {
    headers: {
      'Content-Type': 'text/vcard',
      'Content-Disposition': `attachment; filename="${card.name.replace(/\s+/g, '_')}.vcf"`,
    },
  })
}
