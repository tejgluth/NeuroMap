import { useEffect, useMemo, useState } from 'react'

import type { Review } from '../types'
import { loadLocalReviews, subscribeToLocalReviews } from '../lib/reviewsStorage'

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

