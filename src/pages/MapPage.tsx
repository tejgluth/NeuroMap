import { Filter, Search, SlidersHorizontal } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import PlaceMap, { type MapPlace } from '../components/map/PlaceMap'
import CategoryBadge from '../components/places/CategoryBadge'
import Container from '../components/ui/Container'
import SectionHeading from '../components/ui/SectionHeading'
import Card from '../components/ui/Card'
import RatingMeter from '../components/ui/RatingMeter'
import Badge from '../components/ui/Badge'
import { PLACES } from '../data/places'
import { CATEGORIES } from '../data/categories'
import type { CategoryId, Review } from '../types'
import { averageRatings, mergeComputedRatings } from '../lib/ratings'
import { cn } from '../lib/cn'
import { useLocalReviews } from '../hooks/useLocalReviews'

type CategoryFilter = CategoryId | 'all'

function numberInput(value: string) {
  const n = Number.parseFloat(value)
  return Number.isFinite(n) ? n : 0
}

export default function MapPage() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<CategoryFilter>('all')
  const [minOverall, setMinOverall] = useState(0)
  const [minNoise, setMinNoise] = useState(0)
  const [minCrowds, setMinCrowds] = useState(0)
  const [advanced, setAdvanced] = useState(false)
  const [activePlaceId, setActivePlaceId] = useState<string | undefined>(undefined)

  const localReviews = useLocalReviews()

  const placesWithRatings: Array<MapPlace & { reviewCount: number }> = useMemo(() => {
    const byPlace = new Map<string, Review[]>()
    for (const r of localReviews) {
      const arr = byPlace.get(r.placeId) ?? []
      arr.push(r)
      byPlace.set(r.placeId, arr)
    }

    return PLACES.map((p) => {
      const extra = byPlace.get(p.id) ?? []
      const allReviews = [...p.seededReviews, ...extra]
      return {
        ...p,
        computedRatings: mergeComputedRatings(averageRatings(allReviews), p.seededRatings),
        reviewCount: allReviews.length,
      }
    })
  }, [localReviews])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return placesWithRatings
      .filter((p) => {
        if (category !== 'all' && p.categoryId !== category) return false
        if (minOverall > 0) {
          if (typeof p.computedRatings.overall !== 'number') return false
          if (p.computedRatings.overall < minOverall) return false
        }
        if (advanced && minNoise > 0) {
          if (typeof p.computedRatings.noise !== 'number') return false
          if (p.computedRatings.noise < minNoise) return false
        }
        if (advanced && minCrowds > 0) {
          if (typeof p.computedRatings.crowdedness !== 'number') return false
          if (p.computedRatings.crowdedness < minCrowds) return false
        }
        if (!q) return true
        return (
          p.name.toLowerCase().includes(q) ||
          p.address.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q)
        )
      })
      .sort((a, b) => {
        const aOverall = a.computedRatings.overall
        const bOverall = b.computedRatings.overall
        const aRated = typeof aOverall === 'number' && Number.isFinite(aOverall)
        const bRated = typeof bOverall === 'number' && Number.isFinite(bOverall)
        if (aRated !== bRated) return aRated ? -1 : 1
        if (aRated && bRated && aOverall !== bOverall) return bOverall - aOverall
        if (a.reviewCount !== b.reviewCount) return b.reviewCount - a.reviewCount
        return a.name.localeCompare(b.name)
      })
  }, [advanced, category, minCrowds, minNoise, minOverall, placesWithRatings, query])

  return (
    <div className="py-10 sm:py-12">
      <Container>
        <SectionHeading
          eyebrow="Explore"
          title="Find sensory-friendly places near La Jolla"
          description="Browse places around the La Jolla area. Filter by category and ratings, then open a place for a full breakdown."
        />

        <div className="mt-8 grid gap-4 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Card className="p-6">
              <div className="flex items-center gap-2 text-sm font-semibold text-ink-900">
                <Filter className="h-4 w-4 text-brand-700" aria-hidden="true" />
                Filters
              </div>

              <div className="mt-4 grid gap-3">
                <label className="grid gap-1 text-sm">
                  <span className="text-xs font-semibold uppercase tracking-wide text-ink-700">Search</span>
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-ink-700" aria-hidden="true" />
                    <input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Place name or address"
                      className="w-full rounded-xl border-ink-100/60 bg-sand-50 pl-9 text-sm text-ink-900 placeholder:text-ink-700 focus:border-brand-500 focus:ring-brand-500"
                    />
                  </div>
                </label>

                <label className="grid gap-1 text-sm">
                  <span className="text-xs font-semibold uppercase tracking-wide text-ink-700">Category</span>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as CategoryFilter)}
                    className="w-full rounded-xl border-ink-100/60 bg-sand-50 text-sm text-ink-900 focus:border-brand-500 focus:ring-brand-500"
                  >
                    <option value="all">All categories</option>
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="grid gap-2 text-sm">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-semibold uppercase tracking-wide text-ink-700">
                      Min overall rating
                    </span>
                    <span className="text-xs font-semibold text-ink-800 tabular-nums">{minOverall.toFixed(1)}</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={5}
                    step={0.5}
                    value={minOverall}
                    onChange={(e) => setMinOverall(numberInput(e.target.value))}
                    className="w-full accent-brand-700"
                    aria-label="Minimum overall rating"
                  />
                </label>

                <button
                  type="button"
                  className="mt-1 inline-flex items-center justify-between rounded-xl bg-sand-50 px-3 py-2 text-sm font-semibold text-ink-900 ring-1 ring-inset ring-ink-100/60 hover:bg-sand-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                  onClick={() => setAdvanced((v) => !v)}
                  aria-expanded={advanced}
                >
                  <span className="inline-flex items-center gap-2">
                    <SlidersHorizontal className="h-4 w-4 text-brand-700" aria-hidden="true" />
                    More filters
                  </span>
                  <span className="text-xs text-ink-700">{advanced ? 'Hide' : 'Show'}</span>
                </button>

                {advanced ? (
                  <div className="grid gap-3 rounded-2xl bg-sand-100 p-4">
                    <label className="grid gap-2 text-sm">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-xs font-semibold uppercase tracking-wide text-ink-700">
                          Min quietness (noise)
                        </span>
                        <span className="text-xs font-semibold text-ink-800 tabular-nums">{minNoise.toFixed(1)}</span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={5}
                        step={0.5}
                        value={minNoise}
                        onChange={(e) => setMinNoise(numberInput(e.target.value))}
                        className="w-full accent-brand-700"
                        aria-label="Minimum noise rating"
                      />
                    </label>

                    <label className="grid gap-2 text-sm">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-xs font-semibold uppercase tracking-wide text-ink-700">
                          Min spaciousness (crowds)
                        </span>
                        <span className="text-xs font-semibold text-ink-800 tabular-nums">{minCrowds.toFixed(1)}</span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={5}
                        step={0.5}
                        value={minCrowds}
                        onChange={(e) => setMinCrowds(numberInput(e.target.value))}
                        className="w-full accent-brand-700"
                        aria-label="Minimum crowdedness rating"
                      />
                    </label>
                  </div>
                ) : null}

                <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
                  <Badge className="bg-sand-100">{filtered.length} shown</Badge>
                  <button
                    type="button"
                    className="text-xs font-semibold text-ink-800 underline decoration-brand-300 underline-offset-4 hover:decoration-brand-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                    onClick={() => {
                      setQuery('')
                      setCategory('all')
                      setMinOverall(0)
                      setMinNoise(0)
                      setMinCrowds(0)
                      setAdvanced(false)
                    }}
                  >
                    Reset
                  </button>
                </div>
              </div>
            </Card>

            <div className="mt-4">
              <Card className="p-4">
                <div className="text-xs font-semibold uppercase tracking-wide text-ink-700">Tip</div>
                <p className="mt-2 text-sm leading-relaxed text-ink-800">
                  Prefer not to use the map? Browse the list below and open a place page for full details.
                </p>
              </Card>
            </div>

            <div className="mt-4">
              <Card className="overflow-hidden">
                <div className="border-b border-ink-100/60 bg-sand-100 px-4 py-3">
                  <div className="text-sm font-semibold text-ink-900">Places</div>
                  <div className="mt-1 text-xs text-ink-700">Sorted by rating (if available), then review count.</div>
                </div>

                <div className="max-h-[55dvh] overflow-auto p-3 lg:max-h-[70dvh]">
                  {filtered.length === 0 ? (
                    <div className="rounded-2xl bg-sand-100 p-4 text-sm text-ink-800">
                      No places match these filters.
                    </div>
                  ) : (
                    <div className="grid gap-3">
                      {filtered.map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => setActivePlaceId(p.id)}
                          className={cn(
                            'rounded-2xl border bg-sand-50 p-4 text-left shadow-sm transition-colors hover:bg-sand-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 motion-reduce:transition-none',
                            activePlaceId === p.id ? 'border-brand-300 ring-1 ring-brand-300/60' : 'border-ink-100/60',
                          )}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <div className="text-sm font-semibold text-ink-900">{p.name}</div>
                              <div className="mt-1 flex flex-wrap items-center gap-2">
                                <CategoryBadge categoryId={p.categoryId} />
                                <span className="text-xs text-ink-700">{p.address}</span>
                              </div>
                            </div>
                            <div className="shrink-0 rounded-2xl bg-sand-100 px-3 py-2 text-center">
                              <div className="text-xs font-semibold uppercase tracking-wide text-ink-700">Overall</div>
                              <div className="mt-1 text-lg font-semibold text-ink-900 tabular-nums">
                                {typeof p.computedRatings.overall === 'number' ? p.computedRatings.overall.toFixed(1) : '—'}
                              </div>
                            </div>
                          </div>

                          <div className="mt-3 grid gap-2 sm:grid-cols-2">
                            <RatingMeter value={p.computedRatings.noise} label="Noise" />
                            <RatingMeter value={p.computedRatings.crowdedness} label="Crowds" />
                          </div>

                          <div className="mt-3 flex flex-wrap gap-2">
                            <Link
                              to={`/places/${p.slug}`}
                              className="rounded-xl bg-ink-900 px-3 py-2 text-xs font-semibold text-sand-50 no-underline ring-1 ring-inset ring-ink-900/10 hover:bg-ink-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                              onClick={(e) => e.stopPropagation()}
                            >
                              View
                            </Link>
                            <Link
                              to={`/add-review?place=${encodeURIComponent(p.slug)}`}
                              className="rounded-xl bg-brand-600 px-3 py-2 text-xs font-semibold text-sand-50 no-underline ring-1 ring-inset ring-brand-600/10 hover:bg-brand-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                              onClick={(e) => e.stopPropagation()}
                            >
                              Add review
                            </Link>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </div>

          <div className="lg:col-span-8">
            <Card className="overflow-hidden">
              <div className="border-b border-ink-100/60 bg-sand-100 px-4 py-3">
                <div className="text-sm font-semibold text-ink-900">Map</div>
                <div className="mt-1 text-xs text-ink-700">Tap a marker for a quick summary and actions.</div>
              </div>
              <div className="h-[55dvh] w-full lg:h-[74dvh]">
                <PlaceMap places={filtered} activePlaceId={activePlaceId} onActivatePlace={setActivePlaceId} />
              </div>
            </Card>

            <Card className="mt-4 p-6">
              <div className="text-sm font-semibold text-ink-900">A note on ratings</div>
              <p className="mt-2 text-sm leading-relaxed text-ink-800">
                Ratings reflect parent-reported experiences and can change day to day. NeuroMap does not provide medical
                advice. Reviews you add are saved locally on this device.
              </p>
            </Card>
          </div>
        </div>
      </Container>
    </div>
  )
}
