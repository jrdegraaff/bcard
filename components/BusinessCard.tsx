type CardProps = {
  card: {
    id: string
    name: string
    title?: string | null
    company?: string | null
    email: string
    phone?: string | null
    website?: string | null
    linkedin?: string | null
    bio?: string | null
  }
  showVCard?: boolean
}

export default function BusinessCard({ card, showVCard = false }: CardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{card.name}</h1>
        {card.title && <p className="text-indigo-600 font-medium mt-0.5">{card.title}</p>}
        {card.company && <p className="text-gray-500 text-sm">{card.company}</p>}
      </div>

      {card.bio && (
        <p className="text-sm text-gray-600 leading-relaxed border-t border-gray-50 pt-3">
          {card.bio}
        </p>
      )}

      <div className="space-y-2 text-sm border-t border-gray-50 pt-3">
        <a href={`mailto:${card.email}`} className="flex items-center gap-2 text-gray-700 hover:text-indigo-600">
          <span>✉️</span>{card.email}
        </a>
        {card.phone && (
          <a href={`tel:${card.phone}`} className="flex items-center gap-2 text-gray-700 hover:text-indigo-600">
            <span>📞</span>{card.phone}
          </a>
        )}
        {card.website && (
          <a href={card.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-700 hover:text-indigo-600">
            <span>🌐</span>{card.website.replace(/^https?:\/\//, '')}
          </a>
        )}
        {card.linkedin && (
          <a href={card.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-700 hover:text-indigo-600">
            <span>💼</span>LinkedIn
          </a>
        )}
      </div>

      {showVCard && (
        <a
          href={`/api/vcard/${card.id}`}
          className="block w-full text-center border border-indigo-200 text-indigo-600 py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-50 transition-colors"
        >
          Save to contacts
        </a>
      )}
    </div>
  )
}
