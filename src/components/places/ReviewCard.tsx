import { Flag, ThumbsDown, ThumbsUp, Trash2 } from 'lucide-react'
import { useState } from 'react'

import type { Review } from '../../types'
import { TAG_BY_ID } from '../../data/tags'
import Badge from '../ui/Badge'
import Card from '../ui/Card'
import RatingMeter from '../ui/RatingMeter'
import { formatDate } from '../../lib/time'

const REPORT_REASONS = [
  'Inaccurate information',
  'Spam',
  'Offensive language',
  'Other',
] as const

type ReviewCardProps = {
  review: Review
  currentUserId?: string | null
  reviewUserId?: string | null
  onDelete?: (reviewId: string) => Promise<void>
  onReport?: (reviewId: string, reason: string) => Promise<void>
}

export default function ReviewCard({
  review,
  currentUserId,
  reviewUserId,
  onDelete,
  onReport,
}: ReviewCardProps) {
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [isReporting, setIsReporting] = useState(false)
  const [reportReason, setReportReason] = useState<string>(REPORT_REASONS[0])
  const [reporting, setReporting] = useState(false)
  const [reportDone, setReportDone] = useState(false)

  const isOwn = Boolean(currentUserId && reviewUserId && currentUserId === reviewUserId)
  const canReport = Boolean(currentUserId && !isOwn && onReport)

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

  const overall = typeof review.ratings?.overall === 'number' ? review.ratings.overall : null
  const noise = typeof review.ratings?.noise === 'number' ? review.ratings.noise : null
  const showRatings = overall !== null || noise !== null

  async function handleDelete() {
    if (!onDelete) return
    setDeleting(true)
    await onDelete(review.id)
    setDeleting(false)
    setIsConfirmingDelete(false)
  }

  async function handleReport(e: React.FormEvent) {
    e.preventDefault()
    if (!onReport) return
    setReporting(true)
    await onReport(review.id, reportReason)
    setReporting(false)
    setReportDone(true)
    setIsReporting(false)
  }

  return (
    <Card className="p-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-ink-900">{review.displayName || 'Anonymous'}</div>
          {meta.length > 0 && (
            <div className="mt-1 text-xs text-ink-500">{meta.join(' · ')}</div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {recommend && (
            <Badge
              className={recommend === 'yes'
                ? 'bg-brand-50 text-brand-800 ring-brand-200/60'
                : 'bg-sand-100 text-ink-700 ring-ink-100/60'}
            >
              {recommend === 'yes'
                ? <ThumbsUp className="h-3 w-3" aria-hidden="true" />
                : <ThumbsDown className="h-3 w-3" aria-hidden="true" />}
              {recommend === 'yes' ? 'Recommended' : 'Not recommended'}
            </Badge>
          )}

          {isOwn && onDelete && (
            isConfirmingDelete ? (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleting}
                  className="rounded-lg bg-red-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-50 transition-colors"
                >
                  {deleting ? 'Deleting…' : 'Delete'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsConfirmingDelete(false)}
                  className="rounded-lg bg-sand-100 px-2.5 py-1 text-xs font-semibold text-ink-700 hover:bg-sand-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsConfirmingDelete(true)}
                className="rounded-lg p-1.5 text-ink-300 hover:text-red-500 hover:bg-red-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                aria-label="Delete review"
              >
                <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            )
          )}

          {canReport && (
            reportDone ? (
              <span className="text-xs text-ink-400">Reported</span>
            ) : (
              <button
                type="button"
                onClick={() => setIsReporting((v) => !v)}
                className="rounded-lg p-1.5 text-ink-300 hover:text-ink-600 hover:bg-sand-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                aria-label="Report review"
                aria-expanded={isReporting}
              >
                <Flag className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            )
          )}
        </div>
      </div>

      {/* Ratings */}
      {showRatings && (
        <div className="mt-4 flex flex-wrap gap-4">
          <RatingMeter value={overall} label="Overall" />
          <RatingMeter value={noise} label="Noise" />
        </div>
      )}

      {/* Review text */}
      <p className="mt-4 text-sm leading-relaxed text-ink-700">{review.text}</p>

      {/* Tags */}
      {review.tags && review.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {review.tags.map((t) => (
            <Badge key={t} className="bg-sand-100 text-ink-600">
              {TAG_BY_ID[t]?.label ?? t}
            </Badge>
          ))}
        </div>
      )}

      {/* Report form */}
      {isReporting && !reportDone && (
        <form onSubmit={handleReport} className="mt-4 rounded-xl border border-ink-100/60 bg-sand-100 p-4">
          <label className="block text-xs font-semibold text-ink-700 mb-1.5">
            Reason for report
          </label>
          <select
            value={reportReason}
            onChange={(e) => setReportReason(e.target.value)}
            className="mb-3 w-full rounded-lg border border-ink-100/60 bg-white py-1.5 px-2.5 text-sm text-ink-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          >
            {REPORT_REASONS.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={reporting}
              className="rounded-lg bg-ink-900 px-3 py-1.5 text-xs font-semibold text-sand-50 hover:bg-ink-800 disabled:opacity-50 transition-colors"
            >
              {reporting ? 'Submitting…' : 'Submit'}
            </button>
            <button
              type="button"
              onClick={() => setIsReporting(false)}
              className="rounded-lg bg-sand-200 px-3 py-1.5 text-xs font-semibold text-ink-700 hover:bg-sand-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </Card>
  )
}
