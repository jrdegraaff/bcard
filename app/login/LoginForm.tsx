'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function LoginForm({ error }: { error?: string }) {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const res = await fetch('/api/auth/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
    setLoading(false)
    if (res.ok) setSent(true)
  }

  if (sent) {
    return (
      <main className="flex min-h-screen items-center justify-center p-8">
        <div className="max-w-sm w-full text-center">
          <div className="text-5xl mb-4">✉️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Check your email</h1>
          <p className="text-gray-600">
            We sent a sign-in link to <strong>{email}</strong>.
            {!process.env.NEXT_PUBLIC_RESEND_CONFIGURED && (
              <span className="block mt-2 text-sm text-gray-400">
                (Dev mode: check your server console for the link)
              </span>
            )}
          </p>
        </div>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-8">
      <div className="max-w-sm w-full">
        <Link href="/" className="block text-center text-3xl mb-6">🪪</Link>
        <h1 className="text-2xl font-bold text-gray-900 mb-1 text-center">Sign in</h1>
        <p className="text-gray-500 text-sm text-center mb-6">
          Enter your email — we'll send a magic link
        </p>

        {error === 'expired' && (
          <p className="text-red-600 text-sm mb-4 text-center bg-red-50 rounded-lg p-3">
            That link has expired. Request a new one.
          </p>
        )}
        {error === 'invalid' && (
          <p className="text-red-600 text-sm mb-4 text-center bg-red-50 rounded-lg p-3">
            Invalid link.
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Sending…' : 'Send magic link'}
          </button>
        </form>
      </div>
    </main>
  )
}
