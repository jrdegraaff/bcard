import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 py-16 text-center">
      <div className="max-w-xl">
        <div className="text-6xl mb-6">🪪</div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">QR Card Exchange</h1>
        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
          Show your QR code. Someone scans it, sees your digital business card,
          and can share their details back — a mutual, opt-in contact exchange.
          Both sides get a link to save the contact directly to their phone.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/login"
            className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
          >
            Create your card
          </Link>
        </div>
        <div className="mt-16 grid grid-cols-3 gap-6 text-sm text-gray-500">
          <div>
            <div className="text-2xl mb-2">📱</div>
            <p>QR code on your phone or printed</p>
          </div>
          <div>
            <div className="text-2xl mb-2">🔄</div>
            <p>Two-way opt-in exchange</p>
          </div>
          <div>
            <div className="text-2xl mb-2">💾</div>
            <p>Save to Contacts via vCard</p>
          </div>
        </div>
      </div>
    </main>
  )
}
