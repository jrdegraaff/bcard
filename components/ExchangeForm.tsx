'use client'
import { useState } from 'react'

type Props = { cardId: string; ownerName: string }

export default function ExchangeForm({ cardId, ownerName }: Props) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', title: '', note: '' })
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  function set(field: string, value: string) {
    setForm(f => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    await fetch('/api/exchange', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cardId, ...form }),
    })
    setLoading(false)
    setDone(true)
  }

  if (done) {
    return (
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 text-center">
        <div className="text-4xl mb-2">🤝</div>
        <p className="font-semibold text-gray-900">Details shared with {ownerName}!</p>
        <p className="text-sm text-gray-500 mt-1">They can now save you to their contacts.</p>
      </div>
    )
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-semibold hover:bg-indigo-700 transition-colors shadow-md text-base"
      >
        Share your details with {ownerName} →
      </button>
    )
  }

  const fields = [
    { key: 'name', label: 'Full name', type: 'text', required: true },
    { key: 'email', label: 'Email', type: 'email', required: true },
    { key: 'phone', label: 'Phone', type: 'tel' },
    { key: 'company', label: 'Company', type: 'text' },
    { key: 'title', label: 'Job title', type: 'text' },
    { key: 'note', label: 'Note (optional)', type: 'text' },
  ]

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 space-y-4">
      <h2 className="font-semibold text-gray-900">Share your details</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        {fields.map(({ key, label, type, required }) => (
          <div key={key}>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              {label}{required && <span className="text-indigo-500 ml-0.5">*</span>}
            </label>
            <input
              type={type}
              value={form[key as keyof typeof form]}
              onChange={e => set(key, e.target.value)}
              required={required}
              className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        ))}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Sharing…' : 'Share my details'}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="w-full text-gray-400 text-sm hover:text-gray-600 py-1"
        >
          Cancel
        </button>
      </form>
    </div>
  )
}
