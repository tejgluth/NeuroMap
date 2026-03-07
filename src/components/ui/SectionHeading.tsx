import { cn } from '../../lib/cn'

export default function SectionHeading({
  eyebrow,
  title,
  description,
  className,
}: {
  eyebrow?: string
  title: string
  description?: string
  className?: string
}) {
  return (
    <div className={cn('max-w-3xl', className)}>
      {eyebrow ? (
        <div className="text-xs font-semibold uppercase tracking-wider text-ink-700">{eyebrow}</div>
      ) : null}
      <h2 className="mt-2 text-balance text-2xl font-semibold tracking-tight text-ink-900 sm:text-3xl">{title}</h2>
      {description ? <p className="mt-3 text-pretty leading-relaxed text-ink-800">{description}</p> : null}
    </div>
  )
}

