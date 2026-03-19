import { useEffect, useMemo, useState } from 'react'

import type { Review, UnlistedPlaceReview } from '../types'
import { loadLocalReviews, loadLocalUnlistedPlaceReviews, subscribeToLocalReviews } from '../lib/reviewsStorage'

export function useLocalReviews() {
  const [reviews, setReviews] = useState<Review[]>(() => loadLocalReviews())

  useEffect(() => {
    return subscribeToLocalReviews(() => setReviews(loadLocalReviews()))
  }, [])

  return reviews
}

export function useLocalReviewsForPlace(placeId: string | undefined) {
  const reviews = useLocalReviews()
  return useMemo(() => (placeId ? reviews.filter((r) => r.placeId === placeId) : []), [placeId, reviews])
}

export function useLocalUnlistedPlaceReviews() {
  const [reviews, setReviews] = useState<UnlistedPlaceReview[]>(() => loadLocalUnlistedPlaceReviews())

  useEffect(() => {
    return subscribeToLocalReviews(() => setReviews(loadLocalUnlistedPlaceReviews()))
  }, [])

  return reviews
}
