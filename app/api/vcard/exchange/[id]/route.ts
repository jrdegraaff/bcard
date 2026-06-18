import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { generateVCard } from '@/lib/vcard'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const ex = await db.exchange.findUnique({ where: { id } })
  if (!ex) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const vcf = generateVCard({
    name: ex.name,
    email: ex.email,
    phone: ex.phone,
    company: ex.company,
    title: ex.title,
  })
  return new NextResponse(vcf, {
    headers: {
      'Content-Type': 'text/vcard',
      'Content-Disposition': `attachment; filename="${ex.name.replace(/\s+/g, '_')}.vcf"`,
    },
  })
}
