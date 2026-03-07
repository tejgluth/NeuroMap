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
  const ariaLabel = hasValue ? `${label}: ${safe.toFixed(1)} out of ${max}` : `${label}: Not rated yet`

  return (
    <div className={cn('flex items-center gap-2', className)} aria-label={ariaLabel}>
      <div className="flex items-center gap-1" role="img">
        {Array.from({ length: max }).map((_, idx) => {
          const active = idx < filled
          return (
            <span
              key={idx}
              className={cn(
                'h-2.5 w-4 rounded-full ring-1 ring-inset ring-ink-100/70',
                active ? 'bg-brand-600' : 'bg-sand-100',
              )}
            />
          )
        })}
      </div>
      <span className="tabular-nums text-xs font-semibold text-ink-800">{display}</span>
    </div>
  )
}
