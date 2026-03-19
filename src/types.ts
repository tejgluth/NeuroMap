export type CategoryId =
  | 'restaurant'
  | 'cafe'
  | 'park'
  | 'beach'
  | 'entertainment'
  | 'retail'
  | 'salon'
  | 'doctor'
  | 'dentist'
  | 'tutoring'
  | 'service'

export type RatingKey =
  | 'noise'
  | 'crowdedness'
  | 'staffHospitality'
  | 'lighting'
  | 'parking'
  | 'navigation'
  | 'elevators'
  | 'stairs'
  | 'overall'

export type Ratings = Record<RatingKey, number>

export type ComputedRatings = Record<RatingKey, number | null>

export type VisitTime = 'Morning' | 'Midday' | 'Afternoon' | 'Evening'

export type ChildAgeRange = '0–3' | '4–7' | '8–12' | '13–17' | '18+'

export type TagId =
  | 'quiet_morning'
  | 'staff_supportive'
  | 'crowded_after_school'
  | 'bright_lights'
  | 'easy_parking'
  | 'predictable_layout'
  | 'sensory_tools_helped'
  | 'long_wait_time'
  | 'music_overhead'
  | 'strong_smells'

export type ReviewSource = 'seed' | 'local'

export type YesNo = 'yes' | 'no'

export type Coordinates = {
  lat: number
  lng: number
}

export type Review = {
  id: string
  placeId: string
  source: ReviewSource
  createdAt?: string
  displayName: string
  visitTime?: VisitTime
  childAgeRange?: ChildAgeRange
  ratings?: Partial<Ratings>
  recommendForSensorySensitiveFamilies?: YesNo
  tags?: TagId[]
  text: string
}

export type UnlistedPlaceReview = {
  id: string
  source: 'local'
  createdAt: string
  displayName: string
  placeName: string
  categoryId: CategoryId
  address?: string
  visitTime?: VisitTime
  childAgeRange?: ChildAgeRange
  ratings?: Partial<Ratings>
  recommendForSensorySensitiveFamilies?: YesNo
  tags?: TagId[]
  text: string
}

export type Place = {
  id: string
  slug: string
  name: string
  categoryId: CategoryId
  address: string
  coordinates: Coordinates
  shortDescription: string
  seededRatings?: Partial<Ratings>
  sensoryOverview?: string
  bestTimesToVisit?: string[]
  commonTriggers?: string[]
  helpfulAccommodations?: string[]
  parentTips?: string[]
  seededReviews: Review[]
}

export type Category = {
  id: CategoryId
  label: string
  shortHint: string
}

export type Tag = {
  id: TagId
  label: string
  hint: string
}

export type StoryCard = {
  id: string
  title: string
  scenario: string
  whyItMatters: string
}
