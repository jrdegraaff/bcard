export async function sendMagicLink(email: string, token: string) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
  const link = `${appUrl}/login/verify?token=${token}`

  if (process.env.RESEND_API_KEY) {
    const { Resend } = await import('resend')
    const resend = new Resend(process.env.RESEND_API_KEY)
    await resend.emails.send({
      from: process.env.EMAIL_FROM ?? 'noreply@example.com',
      to: email,
      subject: 'Your QR Card sign-in link',
      html: `<p>Sign in to QR Card Exchange:</p><p><a href="${link}">${link}</a></p><p>Expires in 1 hour.</p>`,
    })
  } else {
    console.log(`\n[DEV] Magic link for ${email}:\n${link}\n`)
  }
}
