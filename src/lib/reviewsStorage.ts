import type { Review } from '../types'

const STORAGE_KEY = 'neuromap.reviews.v1'
const EVENT_NAME = 'neuromap:reviews-updated'

function safeParse(json: string | null): unknown {
  if (!json) return null
  try {
    return JSON.parse(json)
  } catch {
    return null
  }
}

function isReview(value: unknown): value is Review {
  if (!value || typeof value !== 'object') return false
  const v = value as Partial<Review>
  return (
    typeof v.id === 'string' &&
    typeof v.placeId === 'string' &&
    (v.source === 'seed' || v.source === 'local') &&
    typeof v.createdAt === 'string' &&
    typeof v.displayName === 'string' &&
    (v.visitTime === 'Morning' || v.visitTime === 'Midday' || v.visitTime === 'Afternoon' || v.visitTime === 'Evening') &&
    typeof v.text === 'string'
  )
}

export function loadLocalReviews(): Review[] {
  if (typeof window === 'undefined') return []
  let raw: string | null = null
  try {
    raw = window.localStorage.getItem(STORAGE_KEY)
  } catch {
    return []
  }
  const parsed = safeParse(raw)
  if (!parsed || typeof parsed !== 'object') return []

  const record = parsed as { reviews?: unknown }
  const reviews = Array.isArray(record.reviews) ? record.reviews.filter(isReview) : []
  return reviews.filter((r) => r.source === 'local')
}

export function saveLocalReviews(reviews: Review[]) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ reviews }))
    window.dispatchEvent(new Event(EVENT_NAME))
  } catch {
    throw new Error('Local storage is unavailable in this browser/session.')
  }
}

export function addLocalReview(review: Omit<Review, 'id' | 'source' | 'createdAt'>) {
  const uuid =
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function' ? crypto.randomUUID() : Math.random().toString(16).slice(2)
  const created: Review = {
    ...review,
    id: `local_${uuid}`,
    source: 'local',
    createdAt: new Date().toISOString(),
  }

  const all = loadLocalReviews()
  all.push(created)
  saveLocalReviews(all)
  return created
}

export function getLocalReviewsForPlace(placeId: string) {
  return loadLocalReviews().filter((r) => r.placeId === placeId)
}

export function subscribeToLocalReviews(callback: () => void) {
  if (typeof window === 'undefined') return () => {}

  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) callback()
  }
  const onEvent = () => callback()

  window.addEventListener('storage', onStorage)
  window.addEventListener(EVENT_NAME, onEvent)
  return () => {
    window.removeEventListener('storage', onStorage)
    window.removeEventListener(EVENT_NAME, onEvent)
  }
}
