import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import Link from 'next/link'
import BusinessCard from '@/components/BusinessCard'
import QRDisplay from '@/components/QRDisplay'
import LogoutButton from '@/components/LogoutButton'

export default async function DashboardPage() {
  const user = await getSession()
  if (!user) redirect('/login')

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
  const cardUrl = user.card ? `${appUrl}/card/${user.card.id}` : null

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">My Card</h1>
          <div className="flex items-center gap-4">
            <Link href="/dashboard/contacts" className="text-sm text-indigo-600 hover:underline">
              Contacts received
            </Link>
            <LogoutButton />
          </div>
        </div>

        {user.card ? (
          <>
            <BusinessCard card={user.card} />
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center gap-4">
              <h2 className="text-lg font-semibold text-gray-900">Your QR Code</h2>
              <QRDisplay url={cardUrl!} />
              <p className="text-sm text-gray-500 text-center max-w-xs">
                Show this — someone scans it, sees your card, and can share their details back with you.
              </p>
              <div className="flex gap-4 text-sm">
                <a href={`/api/vcard/${user.card.id}`} className="text-indigo-600 hover:underline">
                  Download my vCard
                </a>
                <Link href="/dashboard/edit" className="text-gray-500 hover:underline">
                  Edit card
                </Link>
              </div>
            </div>
          </>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center">
            <p className="text-gray-500 mb-4">You haven't created your card yet.</p>
            <Link
              href="/dashboard/edit"
              className="inline-block bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
            >
              Create your card
            </Link>
          </div>
        )}
      </div>
    </main>
  )
}
