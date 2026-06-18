type VCardData = {
  name: string
  title?: string | null
  company?: string | null
  email: string
  phone?: string | null
  website?: string | null
  linkedin?: string | null
}

export function generateVCard(data: VCardData): string {
  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${data.name}`,
    `N:${data.name.split(' ').slice(1).join(' ')};${data.name.split(' ')[0]};;;`,
  ]
  if (data.company) lines.push(`ORG:${data.company}`)
  if (data.title) lines.push(`TITLE:${data.title}`)
  lines.push(`EMAIL;TYPE=INTERNET:${data.email}`)
  if (data.phone) lines.push(`TEL;TYPE=CELL:${data.phone}`)
  if (data.website) lines.push(`URL:${data.website}`)
  if (data.linkedin) lines.push(`URL;TYPE=linkedin:${data.linkedin}`)
  lines.push('END:VCARD')
  return lines.join('\r\n')
}
