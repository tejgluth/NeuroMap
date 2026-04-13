import { cn } from '../../lib/cn'

export default function RatingMeter({
  value,
  max = 5,
  label,
  className,
}: {
  value: number | null
  max?: number
  label: string
  className?: string
}) {
  const hasValue = typeof value === 'number' && Number.isFinite(value)
  const safe = hasValue ? Math.max(0, Math.min(max, value)) : 0
  const filled = Math.round(safe)
  const display = hasValue ? safe.toFixed(1) : '—'
  const ariaLabel = hasValue
    ? `${label}: ${safe.toFixed(1)} out of ${max}`
    : `${label}: not rated yet`

  return (
    <div className={cn('flex items-center gap-2.5', className)} aria-label={ariaLabel}>
      <span className="w-14 text-xs font-medium text-ink-600 shrink-0">{label}</span>
      <div className="flex items-center gap-1" role="img" aria-hidden="true">
        {Array.from({ length: max }).map((_, idx) => {
          const active = idx < filled
          return (
            <span
              key={idx}
              className={cn(
                'h-2 w-5 rounded-sm',
                active ? 'bg-brand-500' : 'bg-sand-200',
              )}
            />
          )
        })}
      </div>
      <span className="tabular-nums text-xs font-semibold text-ink-700">{display}</span>
    </div>
  )
}
