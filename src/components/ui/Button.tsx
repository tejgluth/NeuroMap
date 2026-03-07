import { Link, type LinkProps } from 'react-router-dom'

import { cn } from '../../lib/cn'

type Variant = 'primary' | 'secondary' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

const base =
  'inline-flex items-center justify-center gap-2 rounded-xl font-semibold no-underline shadow-sm ring-1 ring-inset transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 motion-reduce:transition-none disabled:pointer-events-none disabled:opacity-50'

const variantStyles: Record<Variant, string> = {
  primary: 'bg-ink-900 text-sand-50 ring-ink-900/10 hover:bg-ink-800',
  secondary: 'bg-brand-600 text-sand-50 ring-brand-600/10 hover:bg-brand-700',
  ghost: 'bg-sand-50 text-ink-900 ring-ink-100/60 hover:bg-sand-100',
}

const sizeStyles: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-3 text-base',
}

function buttonClassName({
  variant = 'primary',
  size = 'md',
  className,
}: {
  variant?: Variant
  size?: Size
  className?: string
}) {
  return cn(base, variantStyles[variant], sizeStyles[size], className)
}

export function ButtonLink({
  variant = 'primary',
  size = 'md',
  className,
  ...props
}: LinkProps & { variant?: Variant; size?: Size }) {
  return <Link {...props} className={buttonClassName({ variant, size, className })} />
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size }) {
  return <button {...props} className={buttonClassName({ variant, size, className })} />
}
