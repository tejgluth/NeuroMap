import type { Tag } from '../types'

export const TAGS: Tag[] = [
  { id: 'quiet_morning', label: 'Quiet morning', hint: 'Lower noise + fewer people' },
  { id: 'staff_supportive', label: 'Staff supportive', hint: 'Kind, flexible, patient' },
  { id: 'crowded_after_school', label: 'Crowded after school', hint: 'Busy 3–6pm' },
  { id: 'bright_lights', label: 'Bright lights', hint: 'Harsh or flickering lighting' },
  { id: 'easy_parking', label: 'Easy parking', hint: 'Close spots or low stress' },
  { id: 'predictable_layout', label: 'Predictable layout', hint: 'Clear paths, easy wayfinding' },
  { id: 'sensory_tools_helped', label: 'Sensory tools helped', hint: 'Headphones, fidgets, etc.' },
  { id: 'long_wait_time', label: 'Long wait time', hint: 'Waiting increased stress' },
  { id: 'music_overhead', label: 'Music overhead', hint: 'Speakers, announcements' },
  { id: 'strong_smells', label: 'Strong smells', hint: 'Perfume, cleaning products, food' },
]

export const TAG_BY_ID = Object.fromEntries(TAGS.map((t) => [t.id, t])) as Record<Tag['id'], Tag>

