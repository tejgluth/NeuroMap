import type { CategoryId, Place, RatingKey, Review, VisitTime, YesNo, TagId } from '../types'

import rawPlaces from './neuromap_la_jolla_places.json'

type JsonCategory =
  | 'restaurant'
  | 'cafe'
  | 'dessert'
  | 'bookstore'
  | 'pharmacy'
  | 'library'
  | 'museum'
  | 'sports'
  | 'park'

type JsonReview = {
  reviewer?: string
  text: string
  visitTime?: VisitTime
  createdAt?: string
  recommendForSensorySensitiveFamilies?: YesNo
  tags?: TagId[]
  ratings?: Partial<Record<RatingKey, number>>
}

type JsonPlace = {
  id: string
  name: string
  category: JsonCategory
  address: string
  latitude: number
  longitude: number
  shortDescription?: string
  reviews: JsonReview[]
  ratings?: {
    overallAutismFriendliness?: number | null
    noiseLevel?: number | null
    crowdedness?: number | null
    staffHospitality?: number | null
    lightingSensoryStimuli?: number | null
    parkingAccessibility?: number | null
    navigation?: number | null
    elevators?: number | null
    stairs?: number | null
  }
}

const CATEGORY_MAP: Record<JsonCategory, CategoryId> = {
  restaurant: 'restaurant',
  cafe: 'cafe',
  dessert: 'cafe',
  bookstore: 'retail',
  pharmacy: 'service',
  library: 'service',
  museum: 'entertainment',
  sports: 'entertainment',
  park: 'park',
}

function defaultShortDescription(categoryId: CategoryId) {
  switch (categoryId) {
    case 'restaurant':
      return 'Restaurant in La Jolla.'
    case 'cafe':
      return 'Café in La Jolla.'
    case 'park':
      return 'Outdoor space in La Jolla.'
    case 'entertainment':
      return 'Local outing in La Jolla.'
    case 'retail':
      return 'Shop in La Jolla.'
    case 'service':
      return 'Everyday service in La Jolla.'
    case 'beach':
      return 'Beach access in La Jolla.'
    case 'salon':
      return 'Salon in La Jolla.'
    case 'doctor':
      return 'Clinic in La Jolla.'
    case 'dentist':
      return 'Dental office in La Jolla.'
    case 'tutoring':
      return 'Learning support in La Jolla.'
  }
}

function seedReviewId(placeId: string, idx: number) {
  return `seed_${placeId}_${idx}`
}

function invertScale(value: number) {
  const clamped = Math.max(1, Math.min(5, value))
  return 6 - clamped
}

function seededRatingsFromPlace(place: JsonPlace): Place['seededRatings'] {
  if (!place.ratings) return undefined
  const r = place.ratings
  const seeded: NonNullable<Place['seededRatings']> = {}
  if (typeof r.overallAutismFriendliness === 'number') seeded.overall = r.overallAutismFriendliness
  if (typeof r.noiseLevel === 'number') seeded.noise = invertScale(r.noiseLevel)
  if (typeof r.crowdedness === 'number') seeded.crowdedness = invertScale(r.crowdedness)
  if (typeof r.staffHospitality === 'number') seeded.staffHospitality = r.staffHospitality
  if (typeof r.lightingSensoryStimuli === 'number') seeded.lighting = invertScale(r.lightingSensoryStimuli)
  if (typeof r.parkingAccessibility === 'number') seeded.parking = r.parkingAccessibility
  if (typeof r.navigation === 'number') seeded.navigation = r.navigation
  if (typeof r.elevators === 'number') seeded.elevators = r.elevators
  if (typeof r.stairs === 'number') seeded.stairs = r.stairs
  return Object.keys(seeded).length > 0 ? seeded : undefined
}

function toSeedReview(placeId: string, review: JsonReview, idx: number): Review {
  const displayName = typeof review.reviewer === 'string' && review.reviewer.trim() ? review.reviewer.trim() : 'Anonymous'
  return {
    id: seedReviewId(placeId, idx),
    placeId,
    source: 'seed',
    createdAt: review.createdAt,
    displayName,
    visitTime: review.visitTime,
    ratings: review.ratings,
    recommendForSensorySensitiveFamilies: review.recommendForSensorySensitiveFamilies,
    tags: review.tags,
    text: review.text,
  }
}

function toPlace(place: JsonPlace): Place {
  const categoryId = CATEGORY_MAP[place.category] ?? 'service'
  const shortDescription =
    typeof place.shortDescription === 'string' && place.shortDescription.trim()
      ? place.shortDescription.trim()
      : defaultShortDescription(categoryId)

  return {
    id: place.id,
    slug: place.id,
    name: place.name,
    categoryId,
    address: place.address,
    coordinates: { lat: place.latitude, lng: place.longitude },
    shortDescription,
    seededRatings: seededRatingsFromPlace(place),
    seededReviews: (place.reviews ?? []).map((r, idx) => toSeedReview(place.id, r, idx)),
  }
}

export const PLACES: Place[] = (rawPlaces as unknown as JsonPlace[]).map(toPlace)

export const PLACE_BY_SLUG = Object.fromEntries(PLACES.map((p) => [p.slug, p])) as Record<string, Place>
