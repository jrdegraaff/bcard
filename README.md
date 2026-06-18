# QR Card Exchange

A two-way digital business card exchange app. You show a QR code; a visitor scans it, sees your card, and can optionally share their own contact details back. Both parties can download a vCard (.vcf) to save directly to their phone's contacts.

## Features

- Magic-link email authentication (no passwords)
- Create and edit your digital business card
- Unique QR code per card — scannable by anyone without an account
- Visitor can share their contact details back (opt-in)
- Both sides get a vCard download link
- SQLite database via Prisma (zero config for local dev)
- JWT session cookies (30-day, httpOnly)

## Tech Stack

| Layer | Library |
|---|---|
| Framework | Next.js 15 (App Router) |
| Database | SQLite via Prisma 5 |
| Styling | Tailwind CSS v3 |
| Auth | jose (JWT) + magic links |
| QR generation | qrcode |
| Email | Resend (optional) |

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env`:

```
DATABASE_URL="file:./dev.db"
JWT_SECRET="a-long-random-secret-at-least-32-chars"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Optional — if omitted, magic links are printed to the server console
RESEND_API_KEY="re_your_key_here"
EMAIL_FROM="noreply@yourdomain.com"
```

### 3. Initialize the database

```bash
npm run db:push
```

### 4. Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

In dev mode (no `RESEND_API_KEY`), magic links are logged directly to the terminal — just click the printed URL to sign in.

## Project Structure

```
.
├── app/
│   ├── page.tsx                    # Landing page
│   ├── layout.tsx                  # Root layout
│   ├── globals.css                 # Tailwind imports
│   ├── login/
│   │   ├── page.tsx                # Login page (server)
│   │   ├── LoginForm.tsx           # Login form (client)
│   │   └── verify/page.tsx        # Magic-link redirect handler
│   ├── dashboard/
│   │   ├── page.tsx                # Card + QR display
│   │   ├── edit/page.tsx           # Create/edit card form
│   │   └── contacts/page.tsx       # Received contacts list
│   ├── card/[id]/page.tsx          # Public card page (scan target)
│   └── api/
│       ├── auth/
│       │   ├── send/route.ts       # POST — send magic link
│       │   ├── verify/route.ts     # GET  — verify token, set cookie
│       │   └── logout/route.ts     # POST — clear session cookie
│       ├── card/route.ts           # GET/PUT — user's own card
│       ├── exchange/route.ts       # POST — submit visitor contact
│       └── vcard/
│           ├── [id]/route.ts           # GET — card owner vCard
│           └── exchange/[id]/route.ts  # GET — exchange contact vCard
├── components/
│   ├── BusinessCard.tsx            # Card display component
│   ├── ExchangeForm.tsx            # Visitor contact share form
│   ├── QRDisplay.tsx               # QR code canvas renderer
│   └── LogoutButton.tsx            # Sign-out button
├── lib/
│   ├── auth.ts                     # Magic tokens, JWT, getSession()
│   ├── db.ts                       # Prisma singleton
│   ├── email.ts                    # Resend / console magic link
│   └── vcard.ts                    # RFC 6350 vCard v3 generator
├── middleware.ts                   # JWT guard for /dashboard/*
└── prisma/
    └── schema.prisma               # User, Card, Exchange, AuthToken
```

## User Flow

### Card owner
1. Sign up / sign in via magic link
2. Create your card at `/dashboard/edit`
3. Share your QR code from `/dashboard` — show it on your phone or print it
4. Check received contacts at `/dashboard/contacts`
5. Download any contact as a `.vcf` file

### Visitor (no account needed)
1. Scan the QR code — lands on `/card/[id]`
2. See the card owner's details
3. Tap "Save to contacts" to download their vCard
4. Optionally tap "Share your details" to send your own contact info back

## Database Schema

```
User         — email + auth
Card         — business card fields (1-to-1 with User)
Exchange     — visitor contact submissions (many-to-1 with Card)
AuthToken    — magic link tokens (one-time, 1h TTL)
```

## Deployment

### Vercel

1. Push to GitHub
2. Import in Vercel
3. Set environment variables (see `.env.example`)
4. For production SQLite, use Turso or PlanetScale instead — or switch `DATABASE_URL` to a file path on a persistent volume

### Environment variables for production

| Variable | Required | Notes |
|---|---|---|
| `DATABASE_URL` | Yes | `file:./prod.db` or Turso URL |
| `JWT_SECRET` | Yes | Min 32 random chars |
| `NEXT_PUBLIC_APP_URL` | Yes | Your public domain, e.g. `https://qrcard.example.com` |
| `RESEND_API_KEY` | No | Without it, magic links log to console only |
| `EMAIL_FROM` | No | Sender address for magic link emails |

### Build command

```bash
npm run build
# Runs: prisma generate && next build
```

## Development

```bash
# Run Prisma Studio (DB browser)
npm run db:studio

# Re-push schema after edits
npm run db:push

# Type-check
npx tsc --noEmit
```

## Notes

- The `qrc_session` cookie is `httpOnly` + `sameSite=lax`. In production it is also `secure`.
- Magic link tokens are single-use and expire after 1 hour.
- The `/card/[id]` route is fully public — no auth required for visitors.
- vCard format is RFC 6350 v3, compatible with iOS, Android, and macOS Contacts.
