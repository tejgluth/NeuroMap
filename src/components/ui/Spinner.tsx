import { cn } from '../../lib/cn'

export default function Spinner({ className }: { className?: string }) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn(
        'animate-spin rounded-full border-4 border-brand-200 border-t-brand-600 h-8 w-8',
        className,
      )}
    />
  )
}
