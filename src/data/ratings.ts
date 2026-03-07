import type { RatingKey } from '../types'

export const RATING_DIMENSIONS: Array<{
  key: RatingKey
  label: string
  shortLabel: string
  description: string
}> = [
  {
    key: 'overall',
    label: 'Overall Autism-Friendliness',
    shortLabel: 'Overall',
    description: 'A practical, parent-informed summary of how manageable the environment felt.',
  },
  {
    key: 'noise',
    label: 'Noise Level',
    shortLabel: 'Noise',
    description: 'How quiet and predictable sound levels felt (1 = loud/variable, 5 = calm/steady).',
  },
  {
    key: 'crowdedness',
    label: 'Crowdedness',
    shortLabel: 'Crowds',
    description: 'How spacious and calm the foot traffic felt (1 = packed, 5 = roomy).',
  },
  {
    key: 'lighting',
    label: 'Lighting / Sensory Stimuli',
    shortLabel: 'Lighting',
    description: 'How comfortable lighting and visual stimulation felt (1 = harsh/flashy, 5 = soft/steady).',
  },
  {
    key: 'staffHospitality',
    label: 'Staff Hospitality',
    shortLabel: 'Staff',
    description: 'How patient, kind, and flexible staff were (1 = difficult, 5 = supportive).',
  },
  {
    key: 'parking',
    label: 'Parking Accessibility',
    shortLabel: 'Parking',
    description: 'How manageable arrival and parking felt (1 = stressful, 5 = easy).',
  },
  {
    key: 'navigation',
    label: 'Navigation',
    shortLabel: 'Navigation',
    description: 'How predictable layout and wayfinding felt (1 = confusing, 5 = clear).',
  },
  {
    key: 'elevators',
    label: 'Elevators',
    shortLabel: 'Elevators',
    description: 'How available elevator access is when needed (1 = none/unclear, 5 = accessible).',
  },
  {
    key: 'stairs',
    label: 'Stairs',
    shortLabel: 'Stairs',
    description: 'How manageable stairs and step-free options felt (1 = lots of stairs, 5 = minimal).',
  },
]

export const RATING_KEYS: RatingKey[] = RATING_DIMENSIONS.map((d) => d.key)

