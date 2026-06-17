import { useEffect, useRef, useState } from 'react'

import { suggestAddresses, type AddressSuggestion } from '../../lib/geocoding'

export default function AddressAutocomplete({
  value,
  onChange,
  onSelect,
  placeholder,
  className,
}: {
  value: string
  onChange: (value: string) => void
  onSelect: (suggestion: AddressSuggestion) => void
  placeholder?: string
  className?: string
}) {
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([])
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const containerRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function handleInputChange(next: string) {
    onChange(next)
    setActiveIndex(-1)

    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      const results = await suggestAddresses(next)
      setSuggestions(results)
      setOpen(results.length > 0)
    }, 250)
  }

  function selectSuggestion(suggestion: AddressSuggestion) {
    onChange(suggestion.placeName)
    onSelect(suggestion)
    setSuggestions([])
    setOpen(false)
    setActiveIndex(-1)
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (!open || suggestions.length === 0) return
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActiveIndex((i) => (i + 1) % suggestions.length)
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActiveIndex((i) => (i - 1 + suggestions.length) % suggestions.length)
    } else if (event.key === 'Enter') {
      if (activeIndex >= 0) {
        event.preventDefault()
        selectSuggestion(suggestions[activeIndex])
      }
    } else if (event.key === 'Escape') {
      setOpen(false)
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <input
        value={value}
        onChange={(e) => handleInputChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => setOpen(suggestions.length > 0)}
        placeholder={placeholder}
        autoComplete="off"
        className={className}
      />
      {open && (
        <ul className="absolute z-20 mt-1 w-full overflow-hidden rounded-xl border border-ink-100/60 bg-sand-50 shadow-card">
          {suggestions.map((suggestion, index) => (
            <li key={suggestion.id}>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => selectSuggestion(suggestion)}
                className={`block w-full px-3.5 py-2 text-left text-sm transition-colors ${
                  index === activeIndex
                    ? 'bg-brand-50 text-ink-900'
                    : 'text-ink-700 hover:bg-sand-100'
                }`}
              >
                {suggestion.placeName}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
