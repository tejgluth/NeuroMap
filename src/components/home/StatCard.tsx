import { cn } from '../../lib/cn'
import Card from '../ui/Card'

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
    <Card className={cn('p-6', className)}>
      <div className="text-3xl font-semibold tracking-tight text-ink-900">{value}</div>
      <div className="mt-2 text-sm font-semibold text-ink-900">{label}</div>
      <p className="mt-2 text-sm leading-relaxed text-ink-800">{supporting}</p>
    </Card>
  )
}

