import { MapPin, Search } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'

import type { DbPlace } from '../../hooks/usePlaces'
import {
  createSearchSessionToken,
  retrieveMapboxPlace,
  suggestMapboxPlaces,
  type MapboxPlace,
  type MapboxPlaceSuggestion,
} from '../../lib/mapboxSearch'

type Result =
  | { source: 'neuromap'; place: DbPlace }
  | { source: 'mapbox'; place: MapboxPlaceSuggestion }

export default function PlaceAutocomplete({
  places,
  selectedPlace,
  loading,
  onSelectListed,
  onSelectMapbox,
}: {
  places: DbPlace[]
  selectedPlace: DbPlace | null
  loading: boolean
  onSelectListed: (place: DbPlace) => void
  onSelectMapbox: (place: MapboxPlace) => void
}) {
  const [query, setQuery] = useState(selectedPlace?.name ?? '')
  const [mapboxResults, setMapboxResults] = useState<MapboxPlaceSuggestion[]>([])
  const [open, setOpen] = useState(false)
  const [searching, setSearching] = useState(false)
  const [searchError, setSearchError] = useState('')
  const [activeIndex, setActiveIndex] = useState(-1)
  const [sessionToken, setSessionToken] = useState(createSearchSessionToken)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setQuery(selectedPlace?.name ?? '')
  }, [selectedPlace])

  useEffect(() => {
    const controller = new AbortController()
    const timer = window.setTimeout(async () => {
      if (query.trim().length < 2 || selectedPlace?.name === query) {
        setMapboxResults([])
        setSearching(false)
        return
      }
      setSearching(true)
      setSearchError('')
      try {
        setMapboxResults(await suggestMapboxPlaces(query, sessionToken, controller.signal))
      } catch (error) {
        if (!(error instanceof DOMException && error.name === 'AbortError')) {
          setMapboxResults([])
          setSearchError('Nearby place search is temporarily unavailable.')
        }
      } finally {
        if (!controller.signal.aborted) setSearching(false)
      }
    }, 300)
    return () => {
      window.clearTimeout(timer)
      controller.abort()
    }
  }, [query, selectedPlace?.name, sessionToken])

  useEffect(() => {
    function close(event: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])

  const results = useMemo<Result[]>(() => {
    const normalized = query.trim().toLowerCase()
    const local = places
      .filter((place) => !normalized || place.name.toLowerCase().includes(normalized) || place.address.toLowerCase().includes(normalized))
      .slice(0, 8)
      .map((place): Result => ({ source: 'neuromap', place }))
    const localNames = new Set(local.map((result) => result.place.name.toLowerCase()))
    return [
      ...local,
      ...mapboxResults
        .filter((place) => !localNames.has(place.name.toLowerCase()))
        .map((place): Result => ({ source: 'mapbox', place })),
    ]
  }, [mapboxResults, places, query])

  async function select(result: Result) {
    if (result.source === 'neuromap') {
      onSelectListed(result.place)
      setQuery(result.place.name)
    } else {
      setSearching(true)
      try {
        const place = await retrieveMapboxPlace(result.place, sessionToken)
        onSelectMapbox(place)
        setQuery(place.name)
        setSessionToken(createSearchSessionToken())
      } catch {
        setSearchError('Could not load that place. Please try again.')
      } finally {
        setSearching(false)
      }
    }
    setOpen(false)
    setActiveIndex(-1)
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (!open || results.length === 0) return
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActiveIndex((index) => (index + 1) % results.length)
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActiveIndex((index) => (index - 1 + results.length) % results.length)
    } else if (event.key === 'Enter' && activeIndex >= 0) {
      event.preventDefault()
      void select(results[activeIndex])
    } else if (event.key === 'Escape') {
      setOpen(false)
    }
  }

  return (
    <div ref={rootRef} className="relative">
      <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-ink-400" aria-hidden="true" />
      <input
        value={query}
        onChange={(event) => {
          setQuery(event.target.value)
          setOpen(true)
          setActiveIndex(-1)
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder={loading ? 'Loading places…' : 'Search NeuroMaps and nearby places…'}
        autoComplete="off"
        role="combobox"
        aria-expanded={open}
        aria-controls="place-search-results"
        className="w-full rounded-xl border border-ink-100/60 bg-sand-50 py-2.5 pl-9 pr-3 text-sm text-ink-900 placeholder:text-ink-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
      />
      {open && (
        <div id="place-search-results" className="absolute z-30 mt-1 max-h-80 w-full overflow-auto rounded-xl border border-ink-100/60 bg-sand-50 shadow-card">
          {results.length > 0 ? results.map((result, index) => (
            <button
              key={`${result.source}-${result.place.id}`}
              type="button"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => void select(result)}
              className={`flex w-full items-start gap-3 px-3.5 py-3 text-left transition-colors ${index === activeIndex ? 'bg-brand-50' : 'hover:bg-sand-100'}`}
            >
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" aria-hidden="true" />
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold text-ink-900">{result.place.name}</span>
                <span className="block truncate text-xs text-ink-500">{result.place.address || 'Address unavailable'}</span>
                <span className="mt-0.5 block text-[11px] font-medium text-brand-700">
                  {result.source === 'neuromap' ? 'Already on NeuroMaps' : 'From Mapbox · add with your review'}
                </span>
              </span>
            </button>
          )) : (
            <div className="px-4 py-3 text-sm text-ink-500">
              {searching ? 'Searching nearby places…' : searchError || (query.trim().length < 2 ? 'Type at least two characters.' : 'No places found.')}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
