import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

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
      await supabase.from('favorites').insert({ user_id: user.id, place_id: placeId })
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
    created_at: string
    place_slug: string
    place_name: string
  }>>([])
  const [loading, setLoading] = useState(false)

  const fetch = useCallback(async () => {
    if (!user) { setReviews([]); return }
    setLoading(true)
    const { data } = await supabase
      .from('reviews')
      .select('id, place_id, review_text, rating_overall, created_at, places(name, slug)')
      .eq('user_id', user.id)
      .eq('is_seed', false)
      .order('created_at', { ascending: false })
    const mapped = (data ?? []).map((row) => {
      const place = row.places as unknown as { name: string; slug: string }
      return {
        id: row.id,
        place_id: row.place_id,
        review_text: row.review_text,
        rating_overall: row.rating_overall,
        created_at: row.created_at,
        place_name: place?.name ?? '',
        place_slug: place?.slug ?? '',
      }
    })
    setReviews(mapped)
    setLoading(false)
  }, [user])

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { fetch() }, [fetch])

  return { reviews, loading, refetch: fetch }
}
