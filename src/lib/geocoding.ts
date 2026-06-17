const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN as string | undefined

// Biases results toward the La Jolla / San Diego area where NeuroMaps currently focuses.
const LA_JOLLA_PROXIMITY = '-117.2713,32.8328'

export async function geocodeAddress(address: string): Promise<{ lat: number; lng: number }> {
  if (!MAPBOX_TOKEN) {
    throw new Error('Address lookup is not configured. Set VITE_MAPBOX_TOKEN.')
  }

  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${MAPBOX_TOKEN}&proximity=${LA_JOLLA_PROXIMITY}&limit=1`

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error('Could not look up that address. Please try again.')
  }

  const data = await response.json()
  const feature = data.features?.[0]
  if (!feature || !Array.isArray(feature.center)) {
    throw new Error("We couldn't find that address. Please double-check it and try again.")
  }

  const [lng, lat] = feature.center
  return { lat, lng }
}

export type AddressSuggestion = {
  id: string
  placeName: string
  lat: number
  lng: number
}

export async function suggestAddresses(query: string): Promise<AddressSuggestion[]> {
  if (!MAPBOX_TOKEN || query.trim().length < 3) return []

  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${MAPBOX_TOKEN}&autocomplete=true&proximity=${LA_JOLLA_PROXIMITY}&limit=5`

  const response = await fetch(url)
  if (!response.ok) return []

  const data = await response.json()
  const features = Array.isArray(data.features) ? data.features : []
  return features
    .filter((f: { center?: unknown }) => Array.isArray(f.center))
    .map((f: { id: string; place_name: string; center: [number, number] }) => ({
      id: f.id,
      placeName: f.place_name,
      lng: f.center[0],
      lat: f.center[1],
    }))
}

export function slugify(name: string): string {
  const base = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  const suffix = Math.random().toString(36).slice(2, 8)
  return `${base || 'place'}-${suffix}`
}
