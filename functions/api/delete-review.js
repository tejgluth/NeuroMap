const json = (body, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
  },
})

const MAX_BODY_BYTES = 2_000

function isAllowedOrigin(request, env) {
  const origin = request.headers.get('Origin')
  if (!origin) return true

  const requestUrl = new URL(request.url)
  const allowed = new Set([requestUrl.origin])
  const siteUrl = String(env.VITE_SITE_URL || '').trim()
  if (siteUrl) {
    try {
      allowed.add(new URL(siteUrl).origin)
    } catch {
      // Ignore an invalid optional site URL instead of turning a request into a 500.
    }
  }

  return allowed.has(origin)
}

function getBearerToken(request) {
  const header = request.headers.get('Authorization') || ''
  const match = header.match(/^Bearer\s+(.+)$/i)
  return match?.[1]?.trim() || ''
}

function isUnseededPlace(place) {
  return [
    place.seed_noise,
    place.seed_crowdedness,
    place.seed_staff_hospitality,
    place.seed_lighting,
    place.seed_parking,
    place.seed_navigation,
    place.seed_elevators,
    place.seed_stairs,
    place.seed_overall,
  ].every((value) => value == null)
}

async function supabaseRest(env, path, init = {}) {
  const supabaseUrl = String(env.VITE_SUPABASE_URL || '').replace(/\/+$/, '')
  const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY

  const response = await fetch(`${supabaseUrl}/rest/v1${path}`, {
    ...init,
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      ...(init.headers || {}),
    },
  })

  const text = await response.text()
  if (!response.ok) {
    throw new Error(`${init.method || 'GET'} ${path} failed: ${response.status} ${text}`)
  }

  return text ? JSON.parse(text) : null
}

async function getAuthedUser(env, token) {
  const supabaseUrl = String(env.VITE_SUPABASE_URL || '').replace(/\/+$/, '')
  const publishableKey = env.VITE_SUPABASE_PUBLISHABLE_KEY

  const response = await fetch(`${supabaseUrl}/auth/v1/user`, {
    headers: {
      apikey: publishableKey,
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) return null
  return response.json()
}

async function readJsonPayload(request) {
  const contentLength = Number(request.headers.get('Content-Length') || 0)
  if (contentLength > MAX_BODY_BYTES) return { error: json({ error: 'Invalid request.' }, 413) }

  const text = await request.text()
  if (new TextEncoder().encode(text).byteLength > MAX_BODY_BYTES) {
    return { error: json({ error: 'Invalid request.' }, 413) }
  }

  try {
    return { payload: JSON.parse(text) }
  } catch {
    return { error: json({ error: 'Invalid request.' }, 400) }
  }
}

export async function onRequest({ request, env }) {
  if (request.method !== 'POST') return json({ error: 'Method not allowed.' }, 405)
  if (!isAllowedOrigin(request, env)) return json({ error: 'Request origin is not allowed.' }, 403)
  if (!request.headers.get('Content-Type')?.toLowerCase().includes('application/json')) {
    return json({ error: 'Invalid request.' }, 415)
  }

  if (!env.VITE_SUPABASE_URL || !env.VITE_SUPABASE_PUBLISHABLE_KEY || !env.SUPABASE_SERVICE_ROLE_KEY) {
    return json({ error: 'Review deletion is not configured.' }, 503)
  }

  const token = getBearerToken(request)
  if (!token) return json({ error: 'Please sign in to delete your review.' }, 401)

  const user = await getAuthedUser(env, token)
  if (!user?.id) return json({ error: 'Please sign in to delete your review.' }, 401)

  const { payload, error } = await readJsonPayload(request)
  if (error) return error

  const reviewId = String(payload.reviewId || '').trim()
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(reviewId)) {
    return json({ error: 'Invalid review.' }, 400)
  }

  try {
    const reviews = await supabaseRest(
      env,
      `/reviews?select=id,user_id,place_id,is_seed&id=eq.${encodeURIComponent(reviewId)}&limit=1`,
    )
    const review = reviews?.[0]

    if (!review || review.user_id !== user.id || review.is_seed) {
      return json({ error: 'Review not found or you do not have permission to delete it.' }, 404)
    }

    const placeId = review.place_id

    await supabaseRest(env, `/review_reports?review_id=eq.${encodeURIComponent(reviewId)}`, {
      method: 'DELETE',
      headers: { Prefer: 'return=minimal' },
    })

    const deletedReviews = await supabaseRest(env, `/reviews?id=eq.${encodeURIComponent(reviewId)}`, {
      method: 'DELETE',
      headers: { Prefer: 'return=representation' },
    })

    if (!deletedReviews?.length) {
      return json({ error: 'Could not delete that review.' }, 500)
    }

    let deletedPlace = false

    if (placeId) {
      const [place] = await supabaseRest(
        env,
        `/places?select=id,seed_noise,seed_crowdedness,seed_staff_hospitality,seed_lighting,seed_parking,seed_navigation,seed_elevators,seed_stairs,seed_overall&id=eq.${encodeURIComponent(placeId)}&limit=1`,
      )
      const remainingReviews = await supabaseRest(
        env,
        `/reviews?select=id&place_id=eq.${encodeURIComponent(placeId)}&limit=1`,
      )

      if (place && isUnseededPlace(place) && remainingReviews.length === 0) {
        await supabaseRest(env, `/favorites?place_id=eq.${encodeURIComponent(placeId)}`, {
          method: 'DELETE',
          headers: { Prefer: 'return=minimal' },
        })
        const deletedPlaces = await supabaseRest(env, `/places?id=eq.${encodeURIComponent(placeId)}`, {
          method: 'DELETE',
          headers: { Prefer: 'return=representation' },
        })
        deletedPlace = Boolean(deletedPlaces?.length)
      }
    }

    return json({ ok: true, deletedPlace })
  } catch (error) {
    console.error('Review delete failed', error)
    return json({ error: 'Could not delete your review. Please try again.' }, 500)
  }
}
