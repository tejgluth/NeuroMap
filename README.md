# NeuroMap

NeuroMap is a calm, accessible **static frontend** for a parent-powered review platform focused on **autism-friendly / sensory-friendly public environments**. The goal is to help families anticipate sensory triggers before visiting a place.

Seed place + review data is bundled from `src/data/neuromap_la_jolla_places.json` (18 places around La Jolla). User-added reviews persist locally in the browser via `localStorage`.

## Tech stack

- Vite
- React + TypeScript
- Tailwind CSS
- React Router
- Leaflet + OpenStreetMap tiles
- `lucide-react` icons

## Run locally

```bash
npm install
npm run dev
```

Other useful commands:

```bash
npm run build
npm run preview
npm run lint
```

## Review persistence (localStorage)

- User-submitted reviews are stored locally in the current browser only.
- Storage key: `neuromap.reviews.v1`
- Clearing site data / localStorage removes user-added reviews.

Seeded reviews (the initial data) are bundled with the app at build time and are not modified at runtime.

## Cloudflare Pages deployment (no backend)

This project is Cloudflare Pages-ready (static output + SPA routing).

**Build settings**
- Build command: `npm run build`
- Build output directory: `dist`

**Wrangler config (optional)**
- `wrangler.jsonc` is included with `pages_build_output_dir` set to `./dist`.

**SPA routing**
- `public/_redirects` is included so routes like `/places/:slug` work on refresh.

**Deploy options**

1) **Dashboard (recommended)**
- Create a Pages project from your Git repo
- Set the build command and output directory above

2) **Wrangler (optional)**
```bash
npx wrangler pages deploy dist --project-name neuromap
```

## Notes / assumptions

- Seed places and reviews are static, bundled content from `src/data/neuromap_la_jolla_places.json`.
- Ratings are on a 1–5 scale where **higher generally means calmer / more accessible** (see in-app descriptions).
- Ratings and reviews reflect parent-reported experiences; they are not official or verified accessibility assessments.

## Project structure (high level)

- `src/data/*` — seeded places, story cards, tags, rating dimension metadata
- `src/pages/*` — Home, Map/Explore, Place detail, Add review, About, 404
- `src/components/*` — layout, map, places, reviews, and UI components
- `public/_redirects` — Cloudflare Pages SPA fallback routing

## Health + safety disclaimer

NeuroMap does not provide medical advice. Always use your best judgment and consult qualified professionals for individualized guidance.
