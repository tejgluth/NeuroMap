import { RotateCcw, Search, SlidersHorizontal } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import PlaceMap, { type MapPlace } from '../components/map/PlaceMap'
import CategoryBadge from '../components/places/CategoryBadge'
import Container from '../components/ui/Container'
import { CATEGORIES } from '../data/categories'
import type { CategoryId } from '../types'
import { cn } from '../lib/cn'
import { usePlaces } from '../hooks/usePlaces'

type CategoryFilter = CategoryId | 'all'

function numberInput(value: string) {
  const n = Number.parseFloat(value)
  return Number.isFinite(n) ? n : 0
}

function PlaceSkeleton() {
  return (
    <div className="grid gap-2.5 p-3">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="animate-pulse rounded-xl bg-sand-200 h-20" />
      ))}
    </div>
  )
}

function RatingPill({ value, label }: { value: number | null | undefined; label: string }) {
  const has = typeof value === 'number' && Number.isFinite(value)
  return (
    <div className="flex items-center gap-1.5 text-xs text-ink-600">
      <span className="font-medium">{label}</span>
      <span className={cn('font-semibold tabular-nums', has ? 'text-ink-900' : 'text-ink-400')}>
        {has ? (value as number).toFixed(1) : '—'}
      </span>
    </div>
  )
}

export default function MapPage() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<CategoryFilter>('all')
  const [minOverall, setMinOverall] = useState(0)
  const [minNoise, setMinNoise] = useState(0)
  const [minCrowds, setMinCrowds] = useState(0)
  const [advanced, setAdvanced] = useState(false)
  const [activePlaceId, setActivePlaceId] = useState<string | undefined>(undefined)

  const { places: placesWithRatings, loading, error } = usePlaces()

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
        if (aRated && bRated && aOverall !== bOverall) return (bOverall as number) - (aOverall as number)
        if (a.reviewCount !== b.reviewCount) return b.reviewCount - a.reviewCount
        return a.name.localeCompare(b.name)
      }) as Array<MapPlace & { reviewCount: number }>
  }, [advanced, category, minCrowds, minNoise, minOverall, placesWithRatings, query])

  const hasFilters = query || category !== 'all' || minOverall > 0 || minNoise > 0 || minCrowds > 0

  function resetFilters() {
    setQuery('')
    setCategory('all')
    setMinOverall(0)
    setMinNoise(0)
    setMinCrowds(0)
    setAdvanced(false)
  }

  return (
    <div className="py-8 sm:py-12">
      <Container>
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight text-ink-900 sm:text-3xl">
            Sensory-friendly places near La Jolla
          </h1>
          <p className="mt-1.5 text-ink-600">
            Browse and filter by category, noise level, or crowd density.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-12">
          {/* ── Sidebar ── */}
          <div className="lg:col-span-4">
            {/* Filters */}
            <div className="rounded-2xl border border-ink-100/60 bg-sand-50 p-5 shadow-card">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-sm font-semibold text-ink-900">
                  <SlidersHorizontal className="h-4 w-4 text-brand-600" aria-hidden="true" />
                  Filters
                </div>
                {hasFilters && (
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="inline-flex items-center gap-1 text-xs font-medium text-ink-500 hover:text-ink-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded"
                  >
                    <RotateCcw className="h-3 w-3" aria-hidden="true" />
                    Reset
                  </button>
                )}
              </div>

              <div className="mt-4 grid gap-4">
                {/* Search */}
                <label className="grid gap-1.5">
                  <span className="text-xs font-semibold text-ink-500 uppercase tracking-wide">Search</span>
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-ink-400" aria-hidden="true" />
                    <input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Place name or address"
                      className="w-full rounded-xl border border-ink-100/60 bg-sand-100 py-2 pl-9 pr-3 text-sm text-ink-900 placeholder:text-ink-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-colors"
                    />
                  </div>
                </label>

                {/* Category */}
                <label className="grid gap-1.5">
                  <span className="text-xs font-semibold text-ink-500 uppercase tracking-wide">Category</span>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as CategoryFilter)}
                    className="w-full rounded-xl border border-ink-100/60 bg-sand-100 py-2 px-3 text-sm text-ink-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-colors"
                  >
                    <option value="all">All categories</option>
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </label>

                {/* Min overall */}
                <label className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-ink-500 uppercase tracking-wide">
                      Min. overall
                    </span>
                    <span className="text-xs font-semibold tabular-nums text-ink-800">
                      {minOverall > 0 ? minOverall.toFixed(1) : 'Any'}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={5}
                    step={0.5}
                    value={minOverall}
                    onChange={(e) => setMinOverall(numberInput(e.target.value))}
                    className="w-full"
                    aria-label="Minimum overall rating"
                  />
                </label>

                {/* Advanced toggle */}
                <button
                  type="button"
                  onClick={() => setAdvanced((v) => !v)}
                  className="flex items-center justify-between rounded-xl border border-ink-100/60 bg-sand-100 px-3 py-2 text-sm font-medium text-ink-700 hover:bg-sand-200 hover:text-ink-900 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                  aria-expanded={advanced}
                >
                  <span>More filters</span>
                  <span className="text-xs text-ink-400">{advanced ? 'Hide' : 'Show'}</span>
                </button>

                {advanced && (
                  <div className="grid gap-4 rounded-xl bg-sand-100 p-4">
                    <label className="grid gap-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-ink-500 uppercase tracking-wide">
                          Min. quietness
                        </span>
                        <span className="text-xs font-semibold tabular-nums text-ink-800">
                          {minNoise > 0 ? minNoise.toFixed(1) : 'Any'}
                        </span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={5}
                        step={0.5}
                        value={minNoise}
                        onChange={(e) => setMinNoise(numberInput(e.target.value))}
                        className="w-full"
                        aria-label="Minimum noise rating"
                      />
                    </label>
                    <label className="grid gap-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-ink-500 uppercase tracking-wide">
                          Min. spaciousness
                        </span>
                        <span className="text-xs font-semibold tabular-nums text-ink-800">
                          {minCrowds > 0 ? minCrowds.toFixed(1) : 'Any'}
                        </span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={5}
                        step={0.5}
                        value={minCrowds}
                        onChange={(e) => setMinCrowds(numberInput(e.target.value))}
                        className="w-full"
                        aria-label="Minimum crowdedness rating"
                      />
                    </label>
                  </div>
                )}
              </div>
            </div>

            {/* Place list */}
            <div className="mt-3 rounded-2xl border border-ink-100/60 bg-sand-50 shadow-card overflow-hidden">
              <div className="flex items-center justify-between border-b border-ink-100/60 px-4 py-3">
                <div className="text-sm font-semibold text-ink-900">Places</div>
                <span className="rounded-full bg-sand-100 px-2.5 py-0.5 text-xs font-medium text-ink-600">
                  {loading ? '…' : `${filtered.length}`}
                </span>
              </div>

              <div className="max-h-[52dvh] overflow-auto lg:max-h-[68dvh]">
                {loading ? (
                  <PlaceSkeleton />
                ) : error ? (
                  <div className="m-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                    Could not load places. Please refresh.
                  </div>
                ) : filtered.length === 0 ? (
                  <div className="p-6 text-center">
                    <p className="text-sm font-medium text-ink-700">No places match your filters.</p>
                    <button
                      type="button"
                      onClick={resetFilters}
                      className="mt-3 text-xs font-semibold text-brand-700 hover:text-brand-800 underline underline-offset-2"
                    >
                      Clear filters
                    </button>
                  </div>
                ) : (
                  <div className="grid gap-0 divide-y divide-ink-100/60">
                    {filtered.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setActivePlaceId(p.id)}
                        className={cn(
                          'w-full p-4 text-left transition-colors hover:bg-sand-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-500 motion-reduce:transition-none',
                          activePlaceId === p.id ? 'bg-brand-50 border-l-2 border-brand-400' : '',
                        )}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="text-sm font-semibold text-ink-900 truncate">{p.name}</div>
                            <div className="mt-1">
                              <CategoryBadge categoryId={p.categoryId} />
                            </div>
                          </div>
                          <div className="shrink-0 text-right">
                            <div className="text-lg font-semibold tabular-nums text-ink-900">
                              {typeof p.computedRatings.overall === 'number'
                                ? p.computedRatings.overall.toFixed(1)
                                : '—'}
                            </div>
                            <div className="text-xs text-ink-400">overall</div>
                          </div>
                        </div>

                        <div className="mt-2.5 flex items-center gap-4">
                          <RatingPill value={p.computedRatings.noise} label="Noise" />
                          <RatingPill value={p.computedRatings.crowdedness} label="Crowds" />
                        </div>

                        <div className="mt-2.5 flex gap-2">
                          <Link
                            to={`/places/${p.slug}`}
                            className="rounded-lg bg-ink-900 px-2.5 py-1 text-xs font-semibold text-sand-50 no-underline hover:bg-ink-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            View details
                          </Link>
                          <Link
                            to={`/add-review?place=${encodeURIComponent(p.slug)}`}
                            className="rounded-lg bg-brand-600 px-2.5 py-1 text-xs font-semibold text-sand-50 no-underline hover:bg-brand-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 transition-colors"
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
            </div>
          </div>

          {/* ── Map ── */}
          <div className="lg:col-span-8">
            <div className="overflow-hidden rounded-2xl border border-ink-100/60 shadow-card">
              <div className="h-[52dvh] w-full lg:h-[76dvh]">
                <PlaceMap places={filtered} activePlaceId={activePlaceId} onActivatePlace={setActivePlaceId} />
              </div>
            </div>
            <p className="mt-3 text-xs text-ink-500">
              Tap a marker to preview a place. Ratings reflect parent-reported experiences and may vary by time of day or season.
            </p>
          </div>
        </div>
      </Container>
    </div>
  )
}
