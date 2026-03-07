import { RATING_DIMENSIONS } from '../../data/ratings'
import type { ComputedRatings } from '../../types'
import RatingMeter from '../ui/RatingMeter'

export default function RatingsBreakdown({ ratings }: { ratings: ComputedRatings }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {RATING_DIMENSIONS.map((dim) => (
        <div key={dim.key} className="rounded-2xl border border-ink-100/60 bg-sand-50 p-5">
          <div className="text-sm font-semibold text-ink-900">{dim.label}</div>
          <div className="mt-2">
            <RatingMeter value={ratings[dim.key]} label={dim.label} />
          </div>
          <p className="mt-2 text-sm leading-relaxed text-ink-700">{dim.description}</p>
        </div>
      ))}
    </div>
  )
}
