import { cn } from '../../lib/cn'

export default function Badge({
  children,
  className,
}: React.PropsWithChildren<{
  className?: string
}>) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full bg-sand-50 px-2.5 py-1 text-xs font-semibold text-ink-800 ring-1 ring-inset ring-ink-100/60',
        className,
      )}
    >
      {children}
    </span>
  )
}

