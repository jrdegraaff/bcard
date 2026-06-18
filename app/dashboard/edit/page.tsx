'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

type CardData = {
  name: string; title: string; company: string; email: string
  phone: string; website: string; linkedin: string; bio: string
}

const empty: CardData = { name: '', title: '', company: '', email: '', phone: '', website: '', linkedin: '', bio: '' }

export default function EditCardPage() {
  const [form, setForm] = useState<CardData>(empty)
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetch('/api/card').then(r => r.json()).then(({ card }) => {
      if (card) setForm({ ...empty, ...card })
    })
  }, [])

  function set(field: keyof CardData, value: string) {
    setForm(f => ({ ...f, [field]: value }))
    setSaved(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    await fetch('/api/card', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    setLoading(false)
    setSaved(true)
    setTimeout(() => router.push('/dashboard'), 800)
  }

  const fields: { key: keyof CardData; label: string; type?: string; required?: boolean }[] = [
    { key: 'name', label: 'Full name', required: true },
    { key: 'email', label: 'Email', type: 'email', required: true },
    { key: 'title', label: 'Job title' },
    { key: 'company', label: 'Company' },
    { key: 'phone', label: 'Phone', type: 'tel' },
    { key: 'website', label: 'Website', type: 'url' },
    { key: 'linkedin', label: 'LinkedIn URL', type: 'url' },
    { key: 'bio', label: 'Bio' },
  ]

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/dashboard" className="text-gray-400 hover:text-gray-600">←</Link>
          <h1 className="text-2xl font-bold text-gray-900">Edit your card</h1>
        </div>
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
          {fields.map(({ key, label, type = 'text', required }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {label}{required && <span className="text-indigo-500 ml-0.5">*</span>}
              </label>
              {key === 'bio' ? (
                <textarea
                  value={form[key]}
                  onChange={e => set(key, e.target.value)}
                  rows={3}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              ) : (
                <input
                  type={type}
                  value={form[key]}
                  onChange={e => set(key, e.target.value)}
                  required={required}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              )}
            </div>
          ))}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Saving…' : saved ? 'Saved!' : 'Save card'}
          </button>
        </form>
      </div>
    </main>
  )
}
