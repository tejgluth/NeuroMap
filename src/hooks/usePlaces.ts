import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { mergeComputedRatings } from '../lib/ratings'
import type { PlacesWithRatingsRow } from '../lib/database.types'
import type { CategoryId, ComputedRatings, Place, Ratings } from '../types'

export type DbPlace = Place & {
  computedRatings: ComputedRatings
  reviewCount: number
  communityReviewCount: number
}

function toSeedRatings(row: PlacesWithRatingsRow): Partial<Ratings> {
  const r: Partial<Ratings> = {}
  if (row.seed_noise != null) r.noise = row.seed_noise
  if (row.seed_crowdedness != null) r.crowdedness = row.seed_crowdedness
  if (row.seed_staff_hospitality != null) r.staffHospitality = row.seed_staff_hospitality
  if (row.seed_lighting != null) r.lighting = row.seed_lighting
  if (row.seed_parking != null) r.parking = row.seed_parking
  if (row.seed_navigation != null) r.navigation = row.seed_navigation
  if (row.seed_elevators != null) r.elevators = row.seed_elevators
  if (row.seed_stairs != null) r.stairs = row.seed_stairs
  if (row.seed_overall != null) r.overall = row.seed_overall
  return r
}

function toAvgRatings(row: PlacesWithRatingsRow): ComputedRatings {
  return {
    noise: row.avg_noise ?? null,
    crowdedness: row.avg_crowdedness ?? null,
    staffHospitality: row.avg_staff_hospitality ?? null,
    lighting: row.avg_lighting ?? null,
    parking: row.avg_parking ?? null,
    navigation: row.avg_navigation ?? null,
    elevators: row.avg_elevators ?? null,
    stairs: row.avg_stairs ?? null,
    overall: row.avg_overall ?? null,
  }
}

export function toDbPlace(row: PlacesWithRatingsRow): DbPlace {
  const seedRatings = toSeedRatings(row)
  const avgRatings = toAvgRatings(row)
  const computedRatings = mergeComputedRatings(avgRatings, seedRatings)

  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    categoryId: row.category_id as CategoryId,
    address: row.address,
    coordinates: { lat: row.lat, lng: row.lng },
    shortDescription: row.short_description,
    sensoryOverview: row.sensory_overview ?? undefined,
    bestTimesToVisit: row.best_times_to_visit ?? undefined,
    commonTriggers: row.common_triggers ?? undefined,
    helpfulAccommodations: row.helpful_accommodations ?? undefined,
    parentTips: row.parent_tips ?? undefined,
    seededRatings: seedRatings,
    seededReviews: [],
    computedRatings,
    reviewCount: Number(row.review_count ?? 0),
    communityReviewCount: Number(row.community_review_count ?? 0),
  }
}

export function usePlaces() {
  const [places, setPlaces] = useState<DbPlace[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    supabase
      .rpc('get_places_with_ratings')
      .then(({ data, error }) => {
        if (cancelled) return
        if (error) {
          setError(error.message)
        } else {
          setPlaces((data ?? []).map(toDbPlace))
          setError(null)
        }
        setLoading(false)
      })
    return () => { cancelled = true }
  }, [])

  return { places, loading, error }
}

export function usePlace(slug: string | undefined) {
  const { places, loading, error } = usePlaces()
  const place = slug ? places.find((p) => p.slug === slug) ?? null : null
  return { place, loading, error }
}
