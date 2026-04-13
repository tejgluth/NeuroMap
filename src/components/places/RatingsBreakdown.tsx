import { RATING_DIMENSIONS } from '../../data/ratings'
import type { ComputedRatings } from '../../types'
import RatingMeter from '../ui/RatingMeter'

export default function RatingsBreakdown({ ratings }: { ratings: ComputedRatings }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {RATING_DIMENSIONS.map((dim) => {
        const value = ratings[dim.key]
        const hasValue = typeof value === 'number' && Number.isFinite(value)
        return (
          <div
            key={dim.key}
            className="rounded-2xl border border-ink-100/60 bg-sand-50 p-5 shadow-card"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="text-sm font-semibold text-ink-900">{dim.shortLabel}</div>
              <span className={`text-sm font-semibold tabular-nums ${hasValue ? 'text-ink-900' : 'text-ink-400'}`}>
                {hasValue ? (value as number).toFixed(1) : '—'}
              </span>
            </div>
            <div className="mt-3">
              <RatingMeter value={value} label={dim.label} />
            </div>
            <p className="mt-3 text-xs leading-relaxed text-ink-500">{dim.description}</p>
          </div>
        )
      })}
    </div>
  )
}
