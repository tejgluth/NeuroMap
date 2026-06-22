import type { CategoryId } from '../types'

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN as string | undefined

export const SAN_DIEGO_CENTER = { lat: 32.7157, lng: -117.1611 }

type SearchBoxSuggestionResponse = {
  suggestions?: Array<{
    mapbox_id?: string
    name?: string
    feature_type?: string
    address?: string
    full_address?: string
    place_formatted?: string
    poi_category_ids?: string[]
    poi_category?: string[]
  }>
}

type SearchBoxFeature = {
  geometry?: { coordinates?: [number, number] }
  properties?: {
    mapbox_id?: string
    name?: string
    feature_type?: string
    address?: string
    full_address?: string
    place_formatted?: string
    poi_category_ids?: string[]
    poi_category?: string[]
    coordinates?: { longitude?: number; latitude?: number }
  }
}

type SearchBoxFeatureResponse = {
  features?: SearchBoxFeature[]
}

export type MapboxPlaceSuggestion = {
  id: string
  name: string
  address: string
  featureType: string
  categoryId: CategoryId
}

export type MapboxPlace = MapboxPlaceSuggestion & {
  lat: number
  lng: number
}

function mapCategory(values: string[] | undefined): CategoryId {
  const category = (values ?? []).join(' ').toLowerCase()
  if (/coffee|cafe|tea|bakery/.test(category)) return 'cafe'
  if (/restaurant|food|dining/.test(category)) return 'restaurant'
  if (/beach|coast/.test(category)) return 'beach'
  if (/park|garden|playground|trail/.test(category)) return 'park'
  if (/dentist|dental/.test(category)) return 'dentist'
  if (/doctor|medical|clinic|health|hospital/.test(category)) return 'doctor'
  if (/school|education|tutor|library/.test(category)) return 'tutoring'
  if (/salon|barber|hair|spa/.test(category)) return 'salon'
  if (/shop|store|retail|mall|market/.test(category)) return 'retail'
  if (/cinema|museum|theater|entertainment|attraction|zoo|sports/.test(category)) return 'entertainment'
  return 'service'
}

function formatAddress(input: {
  address?: string
  full_address?: string
  place_formatted?: string
}) {
  return input.full_address || [input.address, input.place_formatted].filter(Boolean).join(', ')
}

export function createSearchSessionToken() {
  return crypto.randomUUID()
}

export async function suggestMapboxPlaces(
  query: string,
  sessionToken: string,
  signal?: AbortSignal,
): Promise<MapboxPlaceSuggestion[]> {
  if (!MAPBOX_TOKEN || query.trim().length < 2) return []

  const params = new URLSearchParams({
    q: query.trim(),
    access_token: MAPBOX_TOKEN,
    session_token: sessionToken,
    proximity: `${SAN_DIEGO_CENTER.lng},${SAN_DIEGO_CENTER.lat}`,
    country: 'US',
    language: 'en',
    limit: '8',
  })
  const response = await fetch(`https://api.mapbox.com/search/searchbox/v1/suggest?${params}`, { signal })
  if (!response.ok) throw new Error('Mapbox place search failed')
  const data = (await response.json()) as SearchBoxSuggestionResponse

  return (data.suggestions ?? []).flatMap((item) => {
    if (!item.mapbox_id || !item.name) return []
    const categories = item.poi_category_ids ?? item.poi_category
    return [{
      id: item.mapbox_id,
      name: item.name,
      address: formatAddress(item),
      featureType: item.feature_type ?? 'place',
      categoryId: mapCategory(categories),
    }]
  })
}

export async function retrieveMapboxPlace(
  suggestion: MapboxPlaceSuggestion,
  sessionToken: string,
): Promise<MapboxPlace> {
  if (!MAPBOX_TOKEN) throw new Error('Missing VITE_MAPBOX_TOKEN')
  const params = new URLSearchParams({
    access_token: MAPBOX_TOKEN,
    session_token: sessionToken,
    language: 'en',
  })
  const response = await fetch(
    `https://api.mapbox.com/search/searchbox/v1/retrieve/${encodeURIComponent(suggestion.id)}?${params}`,
  )
  if (!response.ok) throw new Error('Could not load this place from Mapbox')
  const data = (await response.json()) as SearchBoxFeatureResponse
  const feature = data.features?.[0]
  const coordinates = feature?.geometry?.coordinates
  const longitude = coordinates?.[0] ?? feature?.properties?.coordinates?.longitude
  const latitude = coordinates?.[1] ?? feature?.properties?.coordinates?.latitude
  if (typeof longitude !== 'number' || typeof latitude !== 'number') {
    throw new Error('Mapbox did not return coordinates for this place')
  }
  const properties = feature?.properties
  const categories = properties?.poi_category_ids ?? properties?.poi_category
  return {
    id: properties?.mapbox_id ?? suggestion.id,
    name: properties?.name ?? suggestion.name,
    address: properties ? formatAddress(properties) || suggestion.address : suggestion.address,
    featureType: properties?.feature_type ?? suggestion.featureType,
    categoryId: categories ? mapCategory(categories) : suggestion.categoryId,
    lat: latitude,
    lng: longitude,
  }
}

export async function searchMapboxPlaces(query: string, signal?: AbortSignal): Promise<MapboxPlace[]> {
  if (!MAPBOX_TOKEN || query.trim().length < 2) return []
  const params = new URLSearchParams({
    q: query.trim(),
    access_token: MAPBOX_TOKEN,
    proximity: `${SAN_DIEGO_CENTER.lng},${SAN_DIEGO_CENTER.lat}`,
    country: 'US',
    language: 'en',
    limit: '10',
    types: 'poi',
  })
  const response = await fetch(`https://api.mapbox.com/search/searchbox/v1/forward?${params}`, { signal })
  if (!response.ok) throw new Error('Mapbox place search failed')
  const data = (await response.json()) as SearchBoxFeatureResponse
  return (data.features ?? []).flatMap((feature) => {
    const coordinates = feature.geometry?.coordinates
    const properties = feature.properties
    const id = properties?.mapbox_id
    const name = properties?.name
    if (!id || !name || !coordinates) return []
    return [{
      id,
      name,
      address: formatAddress(properties),
      featureType: properties.feature_type ?? 'poi',
      categoryId: mapCategory(properties.poi_category_ids ?? properties.poi_category),
      lat: coordinates[1],
      lng: coordinates[0],
    }]
  })
}

export async function reverseMapboxPlaces(
  lat: number,
  lng: number,
  signal?: AbortSignal,
): Promise<MapboxPlace[]> {
  if (!MAPBOX_TOKEN) return []
  const params = new URLSearchParams({
    longitude: String(lng),
    latitude: String(lat),
    access_token: MAPBOX_TOKEN,
    country: 'US',
    language: 'en',
    limit: '8',
  })
  const response = await fetch(`https://api.mapbox.com/search/searchbox/v1/reverse?${params}`, { signal })
  if (!response.ok) throw new Error('Mapbox place lookup failed')
  const data = (await response.json()) as SearchBoxFeatureResponse

  return (data.features ?? []).flatMap((feature) => {
    const coordinates = feature.geometry?.coordinates
    const properties = feature.properties
    const id = properties?.mapbox_id
    const name = properties?.name
    if (properties?.feature_type !== 'poi' || !id || !name || !coordinates) return []
    return [{
      id,
      name,
      address: formatAddress(properties),
      featureType: 'poi',
      categoryId: mapCategory(properties.poi_category_ids ?? properties.poi_category),
      lat: coordinates[1],
      lng: coordinates[0],
    }]
  })
}
