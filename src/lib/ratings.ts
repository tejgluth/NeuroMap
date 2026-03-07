import { RATING_KEYS } from '../data/ratings'
import type { ComputedRatings, Ratings, Review, RatingKey } from '../types'

export const RATING_MIN = 1
export const RATING_MAX = 5

export function clampRating(value: number, min = RATING_MIN, max = RATING_MAX) {
  if (!Number.isFinite(value)) return min
  return Math.max(min, Math.min(max, value))
}

export function average(numbers: number[]) {
  const vals = numbers.filter((n) => typeof n === 'number' && Number.isFinite(n))
  if (vals.length === 0) return null
  return vals.reduce((sum, n) => sum + n, 0) / vals.length
}

export function averageRatings(reviews: Review[]): ComputedRatings {
  const result = {} as ComputedRatings
  for (const key of RATING_KEYS) {
    const values: number[] = []
    for (const r of reviews) {
      const v = r.ratings?.[key]
      if (typeof v === 'number' && Number.isFinite(v)) values.push(v)
    }
    result[key] = average(values)
  }
  return result
}

export function mergeComputedRatings(ratings: ComputedRatings, fallback?: Partial<Ratings>): ComputedRatings {
  const merged = {} as ComputedRatings
  for (const key of RATING_KEYS) {
    const direct = ratings[key]
    if (typeof direct === 'number' && Number.isFinite(direct)) {
      merged[key] = direct
      continue
    }
    const fb = fallback?.[key]
    merged[key] = typeof fb === 'number' && Number.isFinite(fb) ? fb : null
  }
  return merged
}

export function formatRating(value: number | null | undefined) {
  if (typeof value !== 'number' || !Number.isFinite(value)) return '—'
  const safe = clampRating(value, 0, 5)
  return safe.toFixed(1)
}

export function ratingLabel(key: RatingKey) {
  switch (key) {
    case 'noise':
      return 'Noise Level'
    case 'crowdedness':
      return 'Crowdedness'
    case 'staffHospitality':
      return 'Staff Hospitality'
    case 'lighting':
      return 'Lighting / Sensory Stimuli'
    case 'parking':
      return 'Parking Accessibility'
    case 'navigation':
      return 'Navigation'
    case 'elevators':
      return 'Elevators'
    case 'stairs':
      return 'Stairs'
    case 'overall':
      return 'Overall Autism-Friendliness'
  }
}
