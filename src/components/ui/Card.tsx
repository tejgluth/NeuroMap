import { cn } from '../../lib/cn'

export default function Card({
  className,
  children,
}: React.PropsWithChildren<{
  className?: string
}>) {
  return (
    <div className={cn('rounded-2xl border border-ink-100/60 bg-sand-50 shadow-card', className)}>{children}</div>
  )
}

