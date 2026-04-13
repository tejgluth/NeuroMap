import { cn } from '../../lib/cn'

export default function StatCard({
  value,
  label,
  supporting,
  className,
}: {
  value: string
  label: string
  supporting: string
  className?: string
}) {
  return (
    <div className={cn('', className)}>
      <div className="text-5xl font-semibold tracking-tight text-ink-900 sm:text-6xl">{value}</div>
      <div className="mt-3 text-sm font-semibold text-ink-800">{label}</div>
      <p className="mt-2 text-sm leading-relaxed text-ink-600">{supporting}</p>
    </div>
  )
}
