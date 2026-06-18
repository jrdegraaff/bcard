import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { db } from '@/lib/db'
import Link from 'next/link'

export default async function ContactsPage() {
  const user = await getSession()
  if (!user) redirect('/login')

  const exchanges = await db.exchange.findMany({
    where: { ownerId: user.id },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/dashboard" className="text-gray-400 hover:text-gray-600">←</Link>
          <h1 className="text-2xl font-bold text-gray-900">Contacts received</h1>
          <span className="ml-auto text-sm text-gray-400">{exchanges.length} total</span>
        </div>

        {exchanges.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
            <div className="text-4xl mb-3">📭</div>
            <p className="text-gray-500">No contacts yet. Share your QR code to start exchanging!</p>
            <Link href="/dashboard" className="inline-block mt-4 text-sm text-indigo-600 hover:underline">
              View my QR code →
            </Link>
          </div>
        ) : (
          <ul className="space-y-3">
            {exchanges.map(ex => (
              <li key={ex.id} className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900 truncate">{ex.name}</p>
                  <p className="text-sm text-gray-500 truncate">
                    {ex.email}{ex.company ? ` · ${ex.company}` : ''}
                  </p>
                  {ex.phone && <p className="text-sm text-gray-400">{ex.phone}</p>}
                  {ex.note && <p className="text-xs text-gray-400 italic mt-1">"{ex.note}"</p>}
                </div>
                <a
                  href={`/api/vcard/exchange/${ex.id}`}
                  className="shrink-0 text-sm bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors"
                >
                  Save contact
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  )
}
