import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { subscribeToReviewChanges } from '../lib/reviewEvents'
import type { TagId, VisitTime, YesNo } from '../types'

export function useFavorites() {
  const { user } = useAuth()
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(false)
  const [toggling, setToggling] = useState<string | null>(null)

  const fetch = useCallback(async () => {
    if (!user) { setFavoriteIds(new Set()); return }
    setLoading(true)
    const { data } = await supabase
      .from('favorites')
      .select('place_id')
      .eq('user_id', user.id)
    setFavoriteIds(new Set((data ?? []).map((r) => r.place_id)))
    setLoading(false)
  }, [user])

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { fetch() }, [fetch])

  async function toggle(placeId: string) {
    if (!user) return
    setToggling(placeId)
    if (favoriteIds.has(placeId)) {
      await supabase.from('favorites').delete().eq('user_id', user.id).eq('place_id', placeId)
      setFavoriteIds((prev) => { const next = new Set(prev); next.delete(placeId); return next })
    } else {
      await supabase.from('favorites').insert({ place_id: placeId })
      setFavoriteIds((prev) => new Set([...prev, placeId]))
    }
    setToggling(null)
  }

  return { favoriteIds, loading, toggling, toggle, refetch: fetch }
}

export function useMyFavoritePlaces() {
  const { user } = useAuth()
  const [placesData, setPlacesData] = useState<Array<{ place_id: string; name: string; slug: string; address: string; created_at: string }>>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!user) return
    const doFetch = () => {
      setLoading(true)
      supabase
        .from('favorites')
        .select('place_id, created_at, places(name, slug, address)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .then(({ data }) => {
          const mapped = (data ?? []).map((row) => {
            const place = row.places as unknown as { name: string; slug: string; address: string }
            return {
              place_id: row.place_id,
              created_at: row.created_at,
              name: place?.name ?? '',
              slug: place?.slug ?? '',
              address: place?.address ?? '',
            }
          })
          setPlacesData(mapped)
          setLoading(false)
        })
    }
    doFetch()
  }, [user])

  const places = user ? placesData : []
  return { places, loading }
}

export function useMyReviews() {
  const { user } = useAuth()
  const [reviews, setReviews] = useState<Array<{
    id: string
    place_id: string
    review_text: string
    rating_overall: number | null
    visit_time: VisitTime | null
    recommend: YesNo | null
    tags: TagId[]
    created_at: string
    updated_at: string
    place_can_edit_name: boolean
    place_slug: string
    place_name: string
  }>>([])
  const [loading, setLoading] = useState(false)

  const fetch = useCallback(async () => {
    if (!user) { setReviews([]); return }
    setLoading(true)
    const { data } = await supabase
      .from('reviews')
      .select('id, place_id, review_text, rating_overall, visit_time, recommend, tags, created_at, updated_at, places(name, slug)')
      .eq('user_id', user.id)
      .eq('is_seed', false)
      .order('created_at', { ascending: false })
    const mapped = (data ?? []).map((row) => {
      const place = row.places as unknown as { name: string; slug: string } | null
      return {
        id: row.id,
        place_id: row.place_id,
        review_text: row.review_text,
        rating_overall: row.rating_overall,
        visit_time: row.visit_time as VisitTime | null,
        recommend: row.recommend as YesNo | null,
        tags: (row.tags as TagId[] | null) ?? [],
        created_at: row.created_at,
        updated_at: row.updated_at,
        // Keep this disabled until the guarded rename_review_place RPC is applied in Supabase.
        // Without that database function, exposing a rename field would create a broken save path.
        place_can_edit_name: false,
        place_name: place?.name ?? '',
        place_slug: place?.slug ?? '',
      }
    })
    setReviews(mapped)
    setLoading(false)
  }, [user])

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { fetch() }, [fetch])
  useEffect(() => subscribeToReviewChanges(fetch), [fetch])

  return { reviews, loading, refetch: fetch }
}
