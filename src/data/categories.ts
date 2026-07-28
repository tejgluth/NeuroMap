import type { Category } from '../types'

export const CATEGORIES: Category[] = [
  { id: 'restaurant', label: 'Restaurant', shortHint: 'Restaurants, cafés, and quick bites' },
  { id: 'park', label: 'Park', shortHint: 'Outdoor green spaces' },
  { id: 'grocery', label: 'Grocery Store', shortHint: 'Supermarkets and food shopping' },
  { id: 'beach', label: 'Beach', shortHint: 'Coastline and ocean access' },
  { id: 'entertainment', label: 'Entertainment', shortHint: 'Activities and events' },
  { id: 'retail', label: 'Retail', shortHint: 'Stores and shopping' },
  { id: 'salon', label: 'Salon', shortHint: 'Haircuts and grooming' },
  { id: 'doctor', label: 'Doctor', shortHint: 'Medical clinics (non-emergency)' },
  { id: 'dentist', label: 'Dentist', shortHint: 'Dental offices' },
  { id: 'other', label: 'Other', shortHint: 'Places that do not fit another category' },
]

export const CATEGORY_BY_ID = Object.fromEntries(CATEGORIES.map((c) => [c.id, c])) as Record<Category['id'], Category>
