# NeuroMap — Design Notes

This site’s visual language is derived from `public/logo.png`:

- **Primary brand teal**: sampled from the logo mark (`#44A4AC` and a softer companion `#5CB4B4`)
- **Ink/navy text**: sampled from the wordmark (`#1C3444`)
- **Warm sand background**: sampled from the logo background (`#F4F4EC`)

## What we optimized for

- **Calm + clarity**: generous spacing, rounded cards, and restrained visual density
- **Caregiver-friendly**: readable hierarchy, clear CTAs, and predictable layouts
- **Accessibility-first**: semantic structure, keyboard-friendly navigation, visible focus states, reduced-motion friendly behavior
- **“Health-adjacent nonprofit-tech” feel**: warm, mission-driven copy and a clean, trustworthy UI without startup hype

## UI decisions tied to the logo

- Soft gradients and subtle shadows echo the logo’s gentle tone without creating visual noise.
- Brand teal is used for **focus rings, highlights, and supportive actions** (not everywhere), keeping the page restful.
- Dark ink is reserved for headlines and primary text for strong readability.

## Motion and sensory considerations

- No flashing effects or chaotic patterns.
- Map “fly to” interactions respect `prefers-reduced-motion` (reduced motion disables animated panning).
