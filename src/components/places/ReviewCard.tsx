import { ThumbsDown, ThumbsUp } from 'lucide-react'

import type { Review } from '../../types'
import { TAG_BY_ID } from '../../data/tags'
import Badge from '../ui/Badge'
import Card from '../ui/Card'
import RatingMeter from '../ui/RatingMeter'
import { formatDate } from '../../lib/time'

export default function ReviewCard({ review }: { review: Review }) {
  const recommend =
    review.recommendForSensorySensitiveFamilies === 'yes'
      ? 'yes'
      : review.recommendForSensorySensitiveFamilies === 'no'
        ? 'no'
        : null

  const meta: string[] = []
  if (review.createdAt) {
    const formatted = formatDate(review.createdAt)
    if (formatted) meta.push(formatted)
  }
  if (review.visitTime) meta.push(review.visitTime)
  if (review.childAgeRange) meta.push(`Child age ${review.childAgeRange}`)
  if (review.source === 'local') meta.push('Saved on this device')

  const overall = typeof review.ratings?.overall === 'number' ? review.ratings.overall : null
  const noise = typeof review.ratings?.noise === 'number' ? review.ratings.noise : null
  const showRatings = overall !== null || noise !== null

  return (
    <Card className="p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-ink-900">{review.displayName || 'Anonymous'}</div>
          {meta.length > 0 ? <div className="mt-1 text-xs text-ink-700">{meta.join(' • ')}</div> : null}
        </div>

        {recommend ? (
          <Badge className={recommend === 'yes' ? 'bg-brand-100 text-brand-900 ring-brand-200/70' : 'bg-sand-100 text-ink-900'}>
            {recommend === 'yes' ? <ThumbsUp className="h-3.5 w-3.5" aria-hidden="true" /> : null}
            {recommend === 'no' ? <ThumbsDown className="h-3.5 w-3.5" aria-hidden="true" /> : null}
            {recommend === 'yes' ? 'Recommended' : 'Not recommended'}
          </Badge>
        ) : null}
      </div>

      {showRatings ? (
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          <RatingMeter value={overall} label="Overall" />
          <RatingMeter value={noise} label="Noise" />
        </div>
      ) : null}

      <p className="mt-4 text-sm leading-relaxed text-ink-800">{review.text}</p>

      {review.tags && review.tags.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {review.tags.map((t) => (
            <Badge key={t} className="bg-sand-100">
              {TAG_BY_ID[t]?.label ?? t}
            </Badge>
          ))}
        </div>
      ) : null}
    </Card>
  )
}
