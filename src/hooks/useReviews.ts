import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { notifyReviewsChanged, subscribeToReviewChanges } from '../lib/reviewEvents'
import type { ReviewInsert, ReviewRow, ReviewUpdate } from '../lib/database.types'
import type { ComputedRatings, Review, TagId } from '../types'

/** Convert a DB ReviewRow to the legacy Review shape used by ReviewCard */
export function dbReviewToLegacy(row: ReviewRow): Review {
  const ratings: Partial<Record<keyof ComputedRatings, number>> = {}
  if (row.rating_noise != null) ratings.noise = row.rating_noise
  if (row.rating_crowdedness != null) ratings.crowdedness = row.rating_crowdedness
  if (row.rating_staff_hospitality != null) ratings.staffHospitality = row.rating_staff_hospitality
  if (row.rating_lighting != null) ratings.lighting = row.rating_lighting
  if (row.rating_parking != null) ratings.parking = row.rating_parking
  if (row.rating_navigation != null) ratings.navigation = row.rating_navigation
  if (row.rating_elevators != null) ratings.elevators = row.rating_elevators
  if (row.rating_stairs != null) ratings.stairs = row.rating_stairs
  if (row.rating_overall != null) ratings.overall = row.rating_overall

  return {
    id: row.id,
    placeId: row.place_id,
    source: row.is_seed ? 'seed' : 'local',
    createdAt: row.created_at,
    displayName: row.display_name,
    visitTime: row.visit_time ?? undefined,
    childAgeRange: row.child_age_range ?? undefined,
    ratings,
    recommendForSensorySensitiveFamilies: row.recommend ?? undefined,
    tags: (row.tags as TagId[] | null) ?? undefined,
    text: row.review_text,
  }
}

export function useReviews(placeId: string | undefined) {
  const [rows, setRows] = useState<ReviewRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetch = useCallback(async () => {
    if (!placeId) {
      setRows([])
      setLoading(false)
      return
    }
    setLoading(true)
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('place_id', placeId)
      .eq('is_hidden', false)
      .order('created_at', { ascending: false })
    if (error) {
      setError(error.message)
    } else {
      setRows(data ?? [])
      setError(null)
    }
    setLoading(false)
  }, [placeId])

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { fetch() }, [fetch])
  useEffect(() => subscribeToReviewChanges(fetch), [fetch])

  const reviews: Review[] = rows.map(dbReviewToLegacy)

  return { rows, reviews, loading, error, refetch: fetch }
}

export function useSubmitReview() {
  const [loading, setLoading] = useState(false)

  async function submit(payload: Omit<ReviewInsert, 'user_id'>): Promise<{ error: string | null }> {
    setLoading(true)
    const { error } = await supabase.from('reviews').insert(payload)
    setLoading(false)
    if (!error) notifyReviewsChanged()
    return { error: error?.message ?? null }
  }

  return { submit, loading }
}

export function useDeleteReview() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)

  async function deleteReviewDirectly(reviewId: string, userId: string): Promise<{ error: string | null }> {
    const { data, error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', reviewId)
      .eq('user_id', userId)
      .eq('is_seed', false)
      .select('id')

    if (error) return { error: error.message }
    if (!data || data.length === 0) {
      return { error: 'Could not delete that review. It may have already been removed, or you may not have permission.' }
    }

    return { error: null }
  }

  async function deleteReview(reviewId: string): Promise<{ error: string | null }> {
    if (!user) return { error: 'Please sign in to delete your review.' }

    setLoading(true)
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
    if (sessionError || !sessionData.session?.access_token) {
      setLoading(false)
      return { error: 'Please sign in again before deleting your review.' }
    }

    let response: Response
    try {
      response = await fetch('/api/delete-review', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${sessionData.session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reviewId }),
      })
    } catch {
      setLoading(false)
      return { error: 'Could not delete that review. Please check your connection and try again.' }
    }

    let payload: { error?: string } | null = null
    try {
      payload = await response.json()
    } catch {
      payload = null
    }
    setLoading(false)

    if (!response.ok) {
      if (response.status === 503) {
        const fallback = await deleteReviewDirectly(reviewId, user.id)
        if (fallback.error) return fallback
      } else {
        return { error: payload?.error ?? 'Could not delete that review.' }
      }
    }

    notifyReviewsChanged()
    return { error: null }
  }

  return { deleteReview, loading }
}

export function useUpdateReview() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)

  async function updateReview(
    reviewId: string,
    payload: ReviewUpdate,
  ): Promise<{ error: string | null }> {
    if (!user) return { error: 'Please sign in to edit your review.' }

    setLoading(true)
    const { error } = await supabase
      .from('reviews')
      .update({
        ...payload,
        updated_at: new Date().toISOString(),
      })
      .eq('id', reviewId)
      .eq('user_id', user.id)
      .eq('is_seed', false)
    setLoading(false)
    if (!error) notifyReviewsChanged()
    return { error: error?.message ?? null }
  }

  return { updateReview, loading }
}

export function useRenameReviewPlace() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)

  async function renameReviewPlace(
    reviewId: string,
    placeName: string,
  ): Promise<{ error: string | null }> {
    if (!user) return { error: 'Please sign in to rename this place.' }

    setLoading(true)
    const { error } = await supabase.rpc('rename_review_place', {
      target_review_id: reviewId,
      new_name: placeName,
    })
    setLoading(false)

    if (!error) notifyReviewsChanged()
    return { error: error?.message ?? null }
  }

  return { renameReviewPlace, loading }
}

export function useReportReview() {
  const [loading, setLoading] = useState(false)

  async function report(
    reviewId: string,
    reason: string,
  ): Promise<{ error: string | null }> {
    setLoading(true)
    const { error } = await supabase
      .from('review_reports')
      .insert({ review_id: reviewId, reason })
    setLoading(false)
    return { error: error?.message ?? null }
  }

  return { report, loading }
}
