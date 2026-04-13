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
    <fieldset className="grid gap-2.5">
      <div>
        <legend className="text-sm font-semibold text-ink-900">{label}</legend>
        <p className="mt-0.5 text-xs leading-relaxed text-ink-500">{description}</p>
      </div>
      <div className="grid grid-cols-5 gap-1.5" role="radiogroup" aria-labelledby={groupId}>
        <span id={groupId} className="sr-only">{label}</span>
        {options.map((n) => (
          <label
            key={n}
            className={cn(
              'cursor-pointer rounded-lg py-2 text-center text-sm font-semibold ring-1 ring-inset transition-colors focus-within:ring-2 focus-within:ring-brand-500 motion-reduce:transition-none select-none',
              value === n
                ? 'bg-brand-600 text-sand-50 ring-brand-700/20'
                : 'bg-sand-100 text-ink-700 ring-ink-100/60 hover:bg-sand-200 hover:text-ink-900',
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
      <div className="flex items-center justify-between text-[10px] font-medium text-ink-400">
        <span>1 = challenging</span>
        <span>5 = calm / supportive</span>
      </div>
    </fieldset>
  )
}
