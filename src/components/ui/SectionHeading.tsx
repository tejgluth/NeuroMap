import { cn } from '../../lib/cn'

export default function SectionHeading({
  eyebrow,
  title,
  description,
  centered,
  className,
}: {
  eyebrow?: string
  title: string
  description?: string
  centered?: boolean
  className?: string
}) {
  return (
    <div className={cn(centered ? 'mx-auto max-w-2xl text-center' : 'max-w-3xl', className)}>
      {eyebrow ? (
        <div className="text-xs font-semibold uppercase tracking-wider text-brand-700">{eyebrow}</div>
      ) : null}
      <h2 className="mt-2 text-2xl font-semibold tracking-tight text-ink-900 sm:text-3xl">{title}</h2>
      {description ? (
        <p className="mt-3 leading-relaxed text-ink-700">{description}</p>
      ) : null}
    </div>
  )
}
