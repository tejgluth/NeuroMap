import { useId } from 'react'

import { cn } from '../../lib/cn'

export default function RatingRadioGroup({
  name,
  label,
  description,
  value,
  onChange,
}: {
  name: string
  label: string
  description: string
  value: number
  onChange: (value: number) => void
}) {
  const groupId = useId()
  const options = [1, 2, 3, 4, 5] as const

  return (
    <fieldset className="grid gap-2">
      <legend className="text-sm font-semibold text-ink-900">{label}</legend>
      <p className="text-xs leading-relaxed text-ink-700">{description}</p>
      <div className="grid grid-cols-5 gap-2" role="radiogroup" aria-labelledby={groupId}>
        <span id={groupId} className="sr-only">
          {label}
        </span>
        {options.map((n) => (
          <label
            key={n}
            className={cn(
              'cursor-pointer rounded-xl px-3 py-2 text-center text-sm font-semibold ring-1 ring-inset transition-colors focus-within:ring-2 focus-within:ring-brand-500 motion-reduce:transition-none',
              value === n ? 'bg-brand-600 text-sand-50 ring-brand-600/20' : 'bg-sand-50 text-ink-900 ring-ink-100/60 hover:bg-sand-100',
            )}
          >
            <input
              type="radio"
              name={name}
              value={n}
              checked={value === n}
              onChange={() => onChange(n)}
              className="sr-only"
            />
            {n}
          </label>
        ))}
      </div>
      <div className="flex items-center justify-between text-[11px] text-ink-700">
        <span>1 = challenging</span>
        <span>5 = calm/supportive</span>
      </div>
    </fieldset>
  )
}

