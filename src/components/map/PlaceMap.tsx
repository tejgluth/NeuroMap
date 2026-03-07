import L from 'leaflet'
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import { useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { MapPin, MessageSquarePlus } from 'lucide-react'

import type { ComputedRatings, Place } from '../../types'
import CategoryBadge from '../places/CategoryBadge'
import RatingMeter from '../ui/RatingMeter'

const BISHOPS_SCHOOL_CENTER = { lat: 32.8439, lng: -117.2746 }

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

function MapController({ activePlace }: { activePlace?: Place }) {
  const map = useMap()

  useEffect(() => {
    if (!activePlace) return
    const prefersReducedMotion =
      typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches
    const target: [number, number] = [activePlace.coordinates.lat, activePlace.coordinates.lng]
    const zoom = Math.max(map.getZoom(), 14)
    if (prefersReducedMotion) {
      map.setView(target, zoom, { animate: false })
    } else {
      map.flyTo(target, zoom, { duration: 0.45 })
    }
  }, [activePlace, map])

  return null
}

export type MapPlace = Place & { computedRatings: ComputedRatings }

export default function PlaceMap({
  places,
  activePlaceId,
  onActivatePlace,
}: {
  places: MapPlace[]
  activePlaceId?: string
  onActivatePlace?: (placeId: string) => void
}) {
  const active = activePlaceId ? places.find((p) => p.id === activePlaceId) : undefined
  const iconById = useMemo(() => new Map(places.map((p) => [p.id, createMarkerIcon(p.computedRatings.overall)])), [places])

  return (
    <MapContainer
      center={[BISHOPS_SCHOOL_CENTER.lat, BISHOPS_SCHOOL_CENTER.lng]}
      zoom={13}
      scrollWheelZoom={false}
      className="h-full w-full rounded-2xl"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <MapController activePlace={active} />

      {places.map((p) => (
        <Marker
          key={p.id}
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
    </MapContainer>
  )
}
