# NeuroMap

NeuroMap is a **sensory-accessibility review platform** for families with autistic children. Parents browse, rate, and review real-world places on 9 sensory dimensions — noise, crowdedness, lighting, staff hospitality, parking, navigation, elevators, stairs, and overall — so other families can plan outings with confidence.

**Current focus:** La Jolla, CA — 18 seeded places.

---

## Tech stack

- **Frontend:** Vite, React 19, TypeScript, Tailwind CSS v3, React Router v7
- **Map:** Leaflet + React Leaflet (OpenStreetMap tiles)
- **Backend:** Supabase (Auth, Database, RLS)
- **Deploy:** Cloudflare Pages (static SPA, GitHub-connected)
- **Icons:** lucide-react

---

## Local setup

```bash
npm install
```

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

Then run:

```bash
npm run dev        # development server (localhost:5173)
npm run build      # production build
npm run preview    # preview production build locally
npm run lint       # lint check
```

---

## Environment variables

| Variable | Purpose |
|---|---|
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase anon/publishable key |
| `VITE_SITE_URL` | Site origin (used for auth redirect URLs) |

---

## Cloudflare Pages deployment

**Build settings:**
- Build command: `npm run build`
- Build output directory: `dist`

**SPA routing:** `public/_redirects` handles React Router client-side routing on Cloudflare Pages.

**Environment variables:** Set `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, and `VITE_SITE_URL` in the Cloudflare Pages project settings (Settings → Environment variables).

---

## Supabase setup (staging)

**Project:** `wstryfcgkplkviorigct.supabase.co`

The database schema is fully migrated. Six migrations are applied:

| # | Name | Description |
|---|---|---|
| 001 | extensions | UUID and utility extensions |
| 002 | core_tables | places, profiles, reviews, favorites, review_reports |
| 003 | triggers_views_rpc | Updated-at triggers, place_rating_summaries view, get_places_with_ratings() RPC |
| 004 | rls_policies | Row Level Security on all tables |
| 005 | seed_places | 18 La Jolla places |
| 006 | seed_reviews | Seed reviews for all places |
| 007 | handle_new_user_trigger | Auto-creates profiles row on signup |

**Row Level Security** is enforced at the database level on every table. The client never bypasses it.

### Rating scale

Ratings are **1–5 where higher = calmer / more accessible**. The seed JSON stores noise, crowdedness, and lighting on an inverted scale; the seed migration applies `6 - value` before inserting so all dimensions are consistently scored.

---

## What works now (staging)

- ✅ Public browsing of 18 La Jolla places with sensory ratings
- ✅ Interactive Leaflet map with filters (category, overall, noise, crowdedness)
- ✅ Place detail pages with sensory breakdown, planning notes, and community reviews
- ✅ Email + password sign up and sign in (Supabase Auth)
- ✅ Auto-created user profiles on signup (via DB trigger)
- ✅ Account page: edit display name, view my reviews (with delete), view saved places (with unfavorite)
- ✅ Save/unsave places (favorites) — authenticated only
- ✅ Submit reviews for listed places → saved to Supabase
- ✅ Review authorship shown via profile display name
- ✅ Review delete (own reviews only, enforced by RLS)
- ✅ Review reporting (any authenticated user can report any other user's review)
- ✅ Unlisted place notes (localStorage — for places not yet in the DB)
- ✅ Fully accessible UI: keyboard navigation, skip-to-content, ARIA labels, reduced-motion support

---

## Current limitations (staging)

| Limitation | Reason | Impact |
|---|---|---|
| Email confirmation required on signup | Supabase default; no SMTP configured | Users must confirm email before signing in. For staging testing, disable "Confirm email" in Supabase Auth → Settings. |
| No password reset flow | Requires SMTP for outbound email | Sign-up works; password reset UI not yet built |
| No Google OAuth | Not yet configured in Supabase Auth | Email/password only |
| No CAPTCHA | Turnstile not yet configured | Forms are open; fine for staging scale |
| No custom domain | Not yet purchased/configured | Served from `*.pages.dev` |
| Unlisted reviews stay in localStorage | These places don't exist in the DB | Cleared when user clears site data |

---

## Remaining steps for full public launch

1. **SMTP / transactional email**
   - Configure a provider (Resend, SendGrid, Postmark) in Supabase Auth → SMTP settings
   - This unblocks: email confirmation on signup, password reset emails, magic links
   - Add `VITE_SITE_URL` to Supabase Auth → URL Configuration (redirect URLs)

2. **Google OAuth** (optional)
   - Create OAuth credentials in Google Cloud Console
   - Add client ID/secret to Supabase Auth → Providers → Google
   - Add `VITE_GOOGLE_CLIENT_ID` to env and wire up "Sign in with Google" button

3. **Cloudflare Turnstile** (optional, recommended)
   - Create a Turnstile site key in Cloudflare dashboard
   - Add `VITE_TURNSTILE_SITE_KEY` to env
   - Wire into sign-up and review submission forms

4. **Custom domain**
   - Purchase domain, configure DNS in Cloudflare
   - Update `VITE_SITE_URL` and Supabase Auth redirect URLs

5. **Password reset page**
   - Add `/reset-password` route + form
   - Requires SMTP to be working first

6. **Admin review moderation**
   - Build internal tool to act on reported reviews (set `is_hidden = true`)
   - Currently reports are collected but no moderation UI exists

---

## Project structure

```
src/
  app/          Router and App entry
  components/   Layout, map, places, reviews, and shared UI
  contexts/     AuthContext (auth state + Supabase auth methods)
  data/         Static seed metadata (categories, ratings, tags)
  hooks/        usePlaces, useReviews, useFavorites (DB hooks)
  lib/          Supabase client, DB types, utilities
  pages/        Home, Map, Place detail, Add review, About, Auth, Account
  types.ts      Core TypeScript types
public/
  _redirects    Cloudflare Pages SPA routing fallback
  logo.png
```

---

## Health + safety disclaimer

NeuroMap does not provide medical advice. Ratings and reviews reflect parent-reported experiences; they are not official or verified accessibility assessments. Always use your best judgment and consult qualified professionals for individualized guidance.
