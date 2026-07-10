# germanflash

Learn German A1 vocabulary with spaced repetition.

**Live:** [germanflash.vercel.app](https://germanflash.vercel.app)

## What it does

- 200+ curated German A1 words with English translations and example sentences
- Real Unsplash photos for concrete words, browser text-to-speech for pronunciation
- Colour-coded gender on nouns (der = blue, die = pink, das = green)
- SM-2 spaced repetition — cards resurface at growing intervals as you learn them (1 day → 6 days → ~3 weeks → months)
- Magic-link email sign-in — no passwords
- Home dashboard with day streak, cards due today, words studied
- Free forever, no ads

## Tech stack

**Frontend + backend**
- Next.js 16 (App Router) with React 19 and TypeScript
- Tailwind CSS 4
- Server Actions for auth and card ratings; async cookies

**Data + auth**
- Supabase (Postgres) — schema, Row-Level Security, magic-link email auth
- Postgres `SECURITY DEFINER` function for narrow-scope image writes (least-privilege pattern instead of `service_role`)

**External APIs**
- Unsplash search API for card images (with photographer attribution)
- Browser SpeechSynthesis — German pronunciation, zero cloud cost

**Hosting**
- Vercel — free tier, auto-deploy from `main` on every push

## Local setup

Prerequisites: Node.js 20+, a Supabase project, an Unsplash access key.

```bash
git clone https://github.com/sanketjoshi2012/germanflash.git
cd germanflash
npm install
```

Create `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
UNSPLASH_ACCESS_KEY=your-unsplash-access-key
```

Apply schema and seed:

- Paste each file from `supabase/migrations/` into your Supabase SQL editor and run in order
- Paste `supabase/seeds/001_a1_seed.sql` for the vocabulary

Run the dev server:

```bash
npm run dev
```

Also configure your Supabase auth redirect URLs to include `http://localhost:3000/**` and your production URL.

## Architecture decisions

**SM-2 over FSRS.** The Anki-classic SM-2 algorithm is ~30 lines of code, universally understood, and portfolio-recognisable. FSRS is marginally more accurate but needs training data and is opaque to review.

**Supabase over rolling own auth.** Every hour spent on password hashing, session cookies, and OAuth handshakes is an hour not spent on the actual product. Supabase's Row-Level Security gives multi-tenant isolation at the database level — no app-code trust dance.

**On-demand image fetching.** Batch pre-fetching all 200 images at build time would take ~4 hours to stay under Unsplash's demo rate limit. On-demand fills the cache as users study — the same total work distributed organically.

**Skip images for months and abstract words.** Unsplash search on "August" returns beach photos, art, and random imagery — the term is ambiguous. Rather than tune per-query, I skip these categories entirely (`SKIP_IMAGE_ENGLISH` in `app/review/review-client.tsx`).

**`SECURITY DEFINER` function over `service_role` key.** The function `set_word_image` runs with elevated privileges but only for a narrow operation — updating image URL + credit for a specific word. Authenticated users can call it without needing admin credentials. Also includes an in-function `auth.uid() is null` guard as defense in depth. Principle of least privilege.

## Roadmap (v1.5+)

- Full 650-word Goethe A1 wordlist via a proper Tatoeba/Wiktionary pipeline (v1 uses a 200-word curated seed)
- Session-length picker (5–25 cards) — currently fixed at 20 per session
- A2 and B1 vocabulary levels
- More languages (Spanish, French, ...)
- Custom SMTP provider (Resend/SendGrid) — Supabase's built-in email is dev-only
- Keyboard shortcuts on the review page (space to flip, 1–4 for ratings)
- Better error surfacing on the login page (URL fragment errors from Supabase auth)

## License

MIT
