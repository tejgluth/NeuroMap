import L from 'leaflet'
import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents } from 'react-leaflet'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { MapPin, MessageSquarePlus } from 'lucide-react'

import type { ComputedRatings, Place } from '../../types'
import CategoryBadge from '../places/CategoryBadge'
import RatingMeter from '../ui/RatingMeter'
import { reverseMapboxPlaces, SAN_DIEGO_CENTER, type MapboxPlace } from '../../lib/mapboxSearch'

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN as string | undefined

function markerColor(overall: number | null) {
  if (typeof overall !== 'number' || !Number.isFinite(overall)) {
    return { bg: '#E7EEF0', fg: '#1C3444', ring: 'rgba(28,52,68,0.18)' }
  }
  if (overall >= 4) return { bg: '#44A4AC', fg: '#0C1E27', ring: 'rgba(244,244,236,0.95)' }
  if (overall >= 3) return { bg: '#5CB4B4', fg: '#0C1E27', ring: 'rgba(244,244,236,0.95)' }
  return { bg: '#243E52', fg: '#F4F4EC', ring: 'rgba(244,244,236,0.95)' }
}

function createMarkerIcon(overall: number | null) {
  const { bg, fg, ring } = markerColor(overall)
  const label = typeof overall === 'number' && Number.isFinite(overall) ? overall.toFixed(1) : '—'
  const html = `
    <div style="
      width: 38px;
      height: 38px;
      border-radius: 9999px;
      background: ${bg};
      border: 3px solid ${ring};
      box-shadow: 0 10px 22px rgba(28,52,68,0.25);
      display: flex;
      align-items: center;
      justify-content: center;
      color: ${fg};
      font-weight: 800;
      font-size: 12px;
      line-height: 1;
      letter-spacing: 0.01em;
    ">
      ${label}
    </div>
  `
  return L.divIcon({
    html,
    className: '',
    iconSize: [38, 38],
    iconAnchor: [19, 38],
    popupAnchor: [0, -34],
  })
}

const discoveredMarkerIcon = L.divIcon({
  html: '<div style="width:32px;height:32px;border-radius:9999px;background:#F4F4EC;border:3px solid #44A4AC;box-shadow:0 8px 18px rgba(28,52,68,.22);display:flex;align-items:center;justify-content:center;color:#1C3444;font-weight:800;font-size:16px">+</div>',
  className: '',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -28],
})

function MapController({
  activePlace,
  markerById,
}: {
  activePlace?: Place
  markerById: Map<string, L.Marker>
}) {
  const map = useMap()

  useEffect(() => {
    if (!activePlace) return
    const prefersReducedMotion =
      typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches
    const target: [number, number] = [activePlace.coordinates.lat, activePlace.coordinates.lng]
    const zoom = Math.max(map.getZoom(), 14)
    const openPopup = () => markerById.get(activePlace.id)?.openPopup()

    if (prefersReducedMotion) {
      map.setView(target, zoom, { animate: false })
      openPopup()
    } else {
      map.once('moveend', openPopup)
      map.flyTo(target, zoom, { duration: 0.45 })
      const fallbackTimer = window.setTimeout(openPopup, 600)
      return () => {
        map.off('moveend', openPopup)
        window.clearTimeout(fallbackTimer)
      }
    }
  }, [activePlace, map, markerById])

  return null
}

function MapClickHandler({ onClick }: { onClick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(event) {
      onClick(event.latlng.lat, event.latlng.lng)
    },
  })
  return null
}

type ClickDiscovery = {
  lat: number
  lng: number
  loading: boolean
  places: MapboxPlace[]
  error: string
}

export type MapPlace = Place & { computedRatings: ComputedRatings }

export default function PlaceMap({
  places,
  discoveredPlaces = [],
  activePlaceId,
  onActivatePlace,
}: {
  places: MapPlace[]
  discoveredPlaces?: MapboxPlace[]
  activePlaceId?: string
  onActivatePlace?: (placeId: string) => void
}) {
  const active = activePlaceId ? places.find((p) => p.id === activePlaceId) : undefined
  const iconById = useMemo(() => new Map(places.map((p) => [p.id, createMarkerIcon(p.computedRatings.overall)])), [places])
  const reviewedByName = useMemo(
    () => new Map(places.map((place) => [place.name.trim().toLowerCase(), place])),
    [places],
  )
  const markerById = useMemo(() => new Map<string, L.Marker>(), [])
  const discoveryController = useRef<AbortController | null>(null)
  const [clickDiscovery, setClickDiscovery] = useState<ClickDiscovery | null>(null)

  useEffect(() => () => discoveryController.current?.abort(), [])

  const discoverPlacesAt = useCallback(async (lat: number, lng: number) => {
    discoveryController.current?.abort()
    const controller = new AbortController()
    discoveryController.current = controller
    setClickDiscovery({ lat, lng, loading: true, places: [], error: '' })

    try {
      const nearbyPlaces = await reverseMapboxPlaces(lat, lng, controller.signal)
      if (!controller.signal.aborted) {
        setClickDiscovery({
          lat,
          lng,
          loading: false,
          places: nearbyPlaces,
          error: nearbyPlaces.length === 0 ? 'No nearby places were found. Try clicking closer to a place label.' : '',
        })
      }
    } catch (error) {
      if (!controller.signal.aborted) {
        setClickDiscovery({
          lat,
          lng,
          loading: false,
          places: [],
          error: error instanceof Error ? error.message : 'Could not look up this location.',
        })
      }
    }
  }, [])

  return (
    <MapContainer
      center={[SAN_DIEGO_CENTER.lat, SAN_DIEGO_CENTER.lng]}
      zoom={11}
      scrollWheelZoom={false}
      className="h-full w-full rounded-2xl"
    >
      {MAPBOX_TOKEN ? (
        <TileLayer
          attribution='&copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url={`https://api.mapbox.com/styles/v1/mapbox/streets-v12/tiles/256/{z}/{x}/{y}@2x?access_token=${MAPBOX_TOKEN}`}
        />
      ) : (
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      )}

      <MapController activePlace={active} markerById={markerById} />
      <MapClickHandler onClick={discoverPlacesAt} />

      {clickDiscovery && (
        <Popup
          key={`${clickDiscovery.lat}-${clickDiscovery.lng}`}
          position={[clickDiscovery.lat, clickDiscovery.lng]}
          maxWidth={320}
        >
          <div className="w-64">
            <div className="text-sm font-semibold text-ink-900">Places near this point</div>
            {clickDiscovery.loading ? (
              <p className="mt-2 text-xs text-ink-600">Finding nearby places…</p>
            ) : clickDiscovery.error ? (
              <p className="mt-2 text-xs leading-relaxed text-ink-600">{clickDiscovery.error}</p>
            ) : (
              <div className="mt-2 grid max-h-64 gap-2 overflow-y-auto pr-1">
                {clickDiscovery.places.map((place) => {
                  const reviewedPlace = reviewedByName.get(place.name.trim().toLowerCase())
                  const params = new URLSearchParams({
                    source: 'mapbox',
                    name: place.name,
                    address: place.address,
                    lat: String(place.lat),
                    lng: String(place.lng),
                    category: place.categoryId,
                  })
                  const reviewUrl = reviewedPlace
                    ? `/add-review?place=${encodeURIComponent(reviewedPlace.slug)}`
                    : `/add-review?${params.toString()}`

                  return (
                    <div key={place.id} className="rounded-xl border border-ink-100/60 bg-sand-100 p-2.5">
                      <div className="truncate text-xs font-semibold text-ink-900">{place.name}</div>
                      <div className="mt-0.5 truncate text-[11px] text-ink-500">{place.address}</div>
                      <Link
                        to={reviewUrl}
                        className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-2.5 py-1.5 text-xs font-semibold text-sand-50 no-underline hover:bg-brand-700"
                      >
                        <MessageSquarePlus className="h-3.5 w-3.5" aria-hidden="true" />
                        {reviewedPlace ? 'Add review' : 'Add first review'}
                      </Link>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </Popup>
      )}

      {places.map((p) => (
        <Marker
          key={p.id}
          ref={(marker) => {
            if (marker) markerById.set(p.id, marker)
            else markerById.delete(p.id)
          }}
          position={[p.coordinates.lat, p.coordinates.lng]}
          icon={iconById.get(p.id)}
          eventHandlers={{
            click: () => onActivatePlace?.(p.id),
          }}
        >
          <Popup>
            <div className="w-64">
              <div className="flex flex-wrap items-center gap-2">
                <CategoryBadge categoryId={p.categoryId} />
              </div>
              <div className="mt-2 text-sm font-semibold text-ink-900">{p.name}</div>
              <div className="mt-1 text-xs text-ink-700">{p.address}</div>

              <div className="mt-3 grid gap-2">
                <RatingMeter value={p.computedRatings.overall} label="Overall" />
                <div className="grid gap-2 sm:grid-cols-2">
                  <RatingMeter value={p.computedRatings.noise} label="Noise" />
                  <RatingMeter value={p.computedRatings.crowdedness} label="Crowds" />
                </div>
              </div>

              <p className="mt-3 text-xs leading-relaxed text-ink-800">{p.shortDescription}</p>

              <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  to={`/places/${p.slug}`}
                  className="inline-flex items-center gap-2 rounded-xl bg-ink-900 px-3 py-2 text-xs font-semibold text-sand-50 no-underline shadow-sm ring-1 ring-inset ring-ink-900/10 hover:bg-ink-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                >
                  <MapPin className="h-4 w-4" aria-hidden="true" />
                  View Full Rating
                </Link>
                <Link
                  to={`/add-review?place=${encodeURIComponent(p.slug)}`}
                  className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-3 py-2 text-xs font-semibold text-sand-50 no-underline shadow-sm ring-1 ring-inset ring-brand-600/10 hover:bg-brand-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                >
                  <MessageSquarePlus className="h-4 w-4" aria-hidden="true" />
                  Add Review
                </Link>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}

      {discoveredPlaces.map((place) => {
        const params = new URLSearchParams({
          source: 'mapbox',
          name: place.name,
          address: place.address,
          lat: String(place.lat),
          lng: String(place.lng),
          category: place.categoryId,
        })
        return (
          <Marker key={`mapbox-${place.id}`} position={[place.lat, place.lng]} icon={discoveredMarkerIcon}>
            <Popup>
              <div className="w-60">
                <div className="text-sm font-semibold text-ink-900">{place.name}</div>
                <div className="mt-1 text-xs text-ink-600">{place.address}</div>
                <p className="mt-2 text-xs leading-relaxed text-ink-600">
                  Found with Mapbox. No sensory reviews yet.
                </p>
                <Link
                  to={`/add-review?${params.toString()}`}
                  className="mt-3 inline-flex items-center gap-2 rounded-xl bg-brand-600 px-3 py-2 text-xs font-semibold text-sand-50 no-underline hover:bg-brand-700"
                >
                  <MessageSquarePlus className="h-4 w-4" aria-hidden="true" />
                  Add the first review
                </Link>
              </div>
            </Popup>
          </Marker>
        )
      })}
    </MapContainer>
  )
}
