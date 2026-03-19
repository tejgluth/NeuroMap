import { AlertCircle, Info } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import CategoryBadge from '../components/places/CategoryBadge'
import RatingRadioGroup from '../components/reviews/RatingRadioGroup'
import UnlistedPlaceReviewCard from '../components/reviews/UnlistedPlaceReviewCard'
import Badge from '../components/ui/Badge'
import { Button, ButtonLink } from '../components/ui/Button'
import Card from '../components/ui/Card'
import Container from '../components/ui/Container'
import SectionHeading from '../components/ui/SectionHeading'
import { CATEGORIES } from '../data/categories'
import { PLACES, PLACE_BY_SLUG } from '../data/places'
import { RATING_DIMENSIONS } from '../data/ratings'
import { TAGS } from '../data/tags'
import { useLocalUnlistedPlaceReviews } from '../hooks/useLocalReviews'
import { addLocalReview, addLocalUnlistedPlaceReview } from '../lib/reviewsStorage'
import type { CategoryId, ChildAgeRange, Ratings, Review, TagId, VisitTime } from '../types'

const DEFAULT_RATINGS: Ratings = {
  noise: 3,
  crowdedness: 3,
  staffHospitality: 3,
  lighting: 3,
  parking: 3,
  navigation: 3,
  elevators: 3,
  stairs: 3,
  overall: 3,
}

const VISIT_TIMES: VisitTime[] = ['Morning', 'Midday', 'Afternoon', 'Evening']
const AGE_RANGES: ChildAgeRange[] = ['0–3', '4–7', '8–12', '13–17', '18+']

type ReviewMode = 'listed' | 'unlisted'

function isNonEmpty(text: string) {
  return text.trim().length > 0
}

function validateReview(input: {
  mode: ReviewMode
  placeId: string
  customPlaceName: string
  customCategory: CategoryId | ''
  visitTime: VisitTime | ''
  recommend: Review['recommendForSensorySensitiveFamilies'] | ''
  text: string
}) {
  const errors: Record<string, string> = {}

  if (input.mode === 'listed') {
    if (!PLACE_BY_SLUG[input.placeId]) errors.placeId = 'Please choose a place.'
  } else {
    if (!isNonEmpty(input.customPlaceName)) errors.customPlaceName = 'Please enter the place name.'
    if (!input.customCategory) errors.customCategory = 'Please choose a category.'
  }

  if (!input.visitTime) errors.visitTime = 'Please choose a visit time.'
  if (!input.recommend) errors.recommend = 'Please choose yes or no.'
  if (input.text.trim().length < 20) errors.text = 'Please write at least 20 characters.'
  return errors
}

export default function AddReviewPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const placeId = searchParams.get('place') || ''
  const [reviewMode, setReviewMode] = useState<ReviewMode>('listed')
  const [displayName, setDisplayName] = useState('')
  const [visitTime, setVisitTime] = useState<VisitTime | ''>('')
  const [childAgeRange, setChildAgeRange] = useState<ChildAgeRange | ''>('')
  const [recommend, setRecommend] = useState<Review['recommendForSensorySensitiveFamilies'] | ''>('')
  const [tags, setTags] = useState<TagId[]>([])
  const [text, setText] = useState('')
  const [ratings, setRatings] = useState<Ratings>({ ...DEFAULT_RATINGS })
  const [customPlaceName, setCustomPlaceName] = useState('')
  const [customAddress, setCustomAddress] = useState('')
  const [customCategory, setCustomCategory] = useState<CategoryId | ''>('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [savedMessage, setSavedMessage] = useState<string | null>(null)

  const place = placeId ? PLACE_BY_SLUG[placeId] : undefined
  const unlistedReviews = useLocalUnlistedPlaceReviews()

  const placesForSelect = useMemo(() => [...PLACES].sort((a, b) => a.name.localeCompare(b.name)), [])

  const ratingDescriptions = useMemo(() => new Map(RATING_DIMENSIONS.map((d) => [d.key, d.description])), [])

  const canSubmit =
    reviewMode === 'listed' ? Boolean(placeId) : isNonEmpty(customPlaceName) && Boolean(customCategory)

  function resetSharedReviewFields() {
    setDisplayName('')
    setVisitTime('')
    setChildAgeRange('')
    setRecommend('')
    setTags([])
    setText('')
    setRatings({ ...DEFAULT_RATINGS })
  }

  function switchMode(nextMode: ReviewMode) {
    setReviewMode(nextMode)
    setErrors({})
    setSubmitError(null)
    setSavedMessage(null)
    if (nextMode === 'unlisted') {
      setSearchParams(
        (prev) => {
          const params = new URLSearchParams(prev)
          params.delete('place')
          return params
        },
        { replace: true },
      )
    }
  }

  return (
    <div className="py-10 sm:py-12">
      <Container>
        <SectionHeading
          eyebrow="Add a review"
          title="Share what the environment felt like"
          description="Choose a listed place or save a note for somewhere not on the map yet. Everything stays on this device."
        />

        <div className="mt-8 grid gap-4 lg:grid-cols-12 lg:items-start">
          <Card className="p-6 lg:col-span-7">
            <form
              className="grid gap-5"
              onSubmit={(event) => {
                event.preventDefault()
                setSubmitError(null)
                setSavedMessage(null)

                const nextErrors = validateReview({
                  mode: reviewMode,
                  placeId,
                  customPlaceName,
                  customCategory,
                  visitTime,
                  recommend,
                  text,
                })
                setErrors(nextErrors)
                if (Object.keys(nextErrors).length > 0) return

                try {
                  if (reviewMode === 'listed') {
                    const created = addLocalReview({
                      placeId,
                      displayName: isNonEmpty(displayName) ? displayName.trim() : 'Anonymous',
                      visitTime: visitTime as VisitTime,
                      childAgeRange: childAgeRange ? (childAgeRange as ChildAgeRange) : undefined,
                      ratings,
                      recommendForSensorySensitiveFamilies: recommend as Review['recommendForSensorySensitiveFamilies'],
                      tags,
                      text: text.trim(),
                    })

                    navigate(`/places/${created.placeId}?reviewed=1`, { replace: true })
                    return
                  }

                  const created = addLocalUnlistedPlaceReview({
                    placeName: customPlaceName.trim(),
                    categoryId: customCategory as CategoryId,
                    address: isNonEmpty(customAddress) ? customAddress.trim() : undefined,
                    displayName: isNonEmpty(displayName) ? displayName.trim() : 'Anonymous',
                    visitTime: visitTime as VisitTime,
                    childAgeRange: childAgeRange ? (childAgeRange as ChildAgeRange) : undefined,
                    ratings,
                    recommendForSensorySensitiveFamilies: recommend as Review['recommendForSensorySensitiveFamilies'],
                    tags,
                    text: text.trim(),
                  })

                  resetSharedReviewFields()
                  setCustomPlaceName('')
                  setCustomAddress('')
                  setCustomCategory('')
                  setErrors({})
                  setSavedMessage(`Saved your local review for ${created.placeName}. It now appears in the saved reviews section.`)
                } catch (error) {
                  const message = error instanceof Error ? error.message : 'Unknown error'
                  setSubmitError(`Could not save your review locally. ${message}`)
                }
              }}
            >
              {submitError ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="mt-0.5 h-4 w-4" aria-hidden="true" />
                    <div>{submitError}</div>
                  </div>
                </div>
              ) : null}

              {savedMessage ? (
                <div className="rounded-2xl border border-brand-200/60 bg-brand-50 p-4 text-sm text-ink-800">
                  <div className="font-semibold text-ink-900">Saved locally</div>
                  <div className="mt-1 leading-relaxed">{savedMessage}</div>
                </div>
              ) : null}

              <div className="rounded-2xl bg-sand-100 p-4">
                <div className="text-sm font-semibold text-ink-900">Which place?</div>
                <p className="mt-1 text-sm leading-relaxed text-ink-800">
                  If the place is not on the map yet, you can save a personal note and keep it on this device.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant={reviewMode === 'listed' ? 'secondary' : 'ghost'}
                    onClick={() => switchMode('listed')}
                  >
                    Review a listed place
                  </Button>
                  <Button
                    type="button"
                    variant={reviewMode === 'unlisted' ? 'secondary' : 'ghost'}
                    onClick={() => switchMode('unlisted')}
                  >
                    Place not listed yet
                  </Button>
                </div>
              </div>

              {reviewMode === 'listed' ? (
                <label className="grid gap-1 text-sm">
                  <span className="text-xs font-semibold uppercase tracking-wide text-ink-700">Place</span>
                  <select
                    value={placeId}
                    onChange={(event) => {
                      const next = event.target.value
                      setSearchParams(
                        (prev) => {
                          const params = new URLSearchParams(prev)
                          if (next) params.set('place', next)
                          else params.delete('place')
                          return params
                        },
                        { replace: true },
                      )
                    }}
                    className="w-full rounded-xl border-ink-100/60 bg-sand-50 text-sm text-ink-900 focus:border-brand-500 focus:ring-brand-500"
                  >
                    <option value="">Choose a place...</option>
                    <optgroup label="Places near La Jolla">
                      {placesForSelect.map((listedPlace) => (
                        <option key={listedPlace.id} value={listedPlace.id}>
                          {listedPlace.name}
                        </option>
                      ))}
                    </optgroup>
                  </select>
                  {errors.placeId ? <span className="text-xs font-semibold text-red-800">{errors.placeId}</span> : null}
                </label>
              ) : (
                <div className="grid gap-4 rounded-2xl border border-ink-100/60 bg-sand-50 p-5">
                  <div className="text-sm font-semibold text-ink-900">Place details</div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="grid gap-1 text-sm sm:col-span-2">
                      <span className="text-xs font-semibold uppercase tracking-wide text-ink-700">Place name</span>
                      <input
                        value={customPlaceName}
                        onChange={(event) => setCustomPlaceName(event.target.value)}
                        placeholder="Example: Small Steps Hair Studio"
                        className="w-full rounded-xl border-ink-100/60 bg-white text-sm text-ink-900 placeholder:text-ink-700 focus:border-brand-500 focus:ring-brand-500"
                      />
                      {errors.customPlaceName ? (
                        <span className="text-xs font-semibold text-red-800">{errors.customPlaceName}</span>
                      ) : null}
                    </label>

                    <label className="grid gap-1 text-sm">
                      <span className="text-xs font-semibold uppercase tracking-wide text-ink-700">Category</span>
                      <select
                        value={customCategory}
                        onChange={(event) => setCustomCategory(event.target.value as CategoryId | '')}
                        className="w-full rounded-xl border-ink-100/60 bg-white text-sm text-ink-900 focus:border-brand-500 focus:ring-brand-500"
                      >
                        <option value="">Choose...</option>
                        {CATEGORIES.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.label}
                          </option>
                        ))}
                      </select>
                      {errors.customCategory ? (
                        <span className="text-xs font-semibold text-red-800">{errors.customCategory}</span>
                      ) : null}
                    </label>

                    <label className="grid gap-1 text-sm">
                      <span className="text-xs font-semibold uppercase tracking-wide text-ink-700">Address or area (optional)</span>
                      <input
                        value={customAddress}
                        onChange={(event) => setCustomAddress(event.target.value)}
                        placeholder="Example: Near La Jolla Blvd and Pearl St"
                        className="w-full rounded-xl border-ink-100/60 bg-white text-sm text-ink-900 placeholder:text-ink-700 focus:border-brand-500 focus:ring-brand-500"
                      />
                    </label>
                  </div>
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-1 text-sm">
                  <span className="text-xs font-semibold uppercase tracking-wide text-ink-700">Your name (optional)</span>
                  <input
                    value={displayName}
                    onChange={(event) => setDisplayName(event.target.value)}
                    placeholder="Anonymous"
                    className="w-full rounded-xl border-ink-100/60 bg-sand-50 text-sm text-ink-900 placeholder:text-ink-700 focus:border-brand-500 focus:ring-brand-500"
                  />
                  <span className="text-xs text-ink-700">Leave blank to post as “Anonymous”.</span>
                </label>

                <label className="grid gap-1 text-sm">
                  <span className="text-xs font-semibold uppercase tracking-wide text-ink-700">Visit time</span>
                  <select
                    value={visitTime}
                    onChange={(event) => setVisitTime(event.target.value as VisitTime | '')}
                    className="w-full rounded-xl border-ink-100/60 bg-sand-50 text-sm text-ink-900 focus:border-brand-500 focus:ring-brand-500"
                  >
                    <option value="">Choose...</option>
                    {VISIT_TIMES.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                  {errors.visitTime ? <span className="text-xs font-semibold text-red-800">{errors.visitTime}</span> : null}
                </label>
              </div>

              <label className="grid gap-1 text-sm">
                <span className="text-xs font-semibold uppercase tracking-wide text-ink-700">Child age range (optional)</span>
                <select
                  value={childAgeRange}
                  onChange={(event) => setChildAgeRange(event.target.value as ChildAgeRange | '')}
                  className="w-full rounded-xl border-ink-100/60 bg-sand-50 text-sm text-ink-900 focus:border-brand-500 focus:ring-brand-500"
                >
                  <option value="">Prefer not to say</option>
                  {AGE_RANGES.map((range) => (
                    <option key={range} value={range}>
                      {range}
                    </option>
                  ))}
                </select>
              </label>

              <div className="rounded-2xl bg-sand-100 p-4">
                <div className="text-sm font-semibold text-ink-900">Ratings (1–5)</div>
                <p className="mt-1 text-sm leading-relaxed text-ink-800">
                  Higher is generally calmer or more accessible for sensory-sensitive families.
                </p>
              </div>

              <div className="grid gap-5">
                <RatingRadioGroup
                  name="overall"
                  label="Overall Autism-Friendliness"
                  description={ratingDescriptions.get('overall') ?? 'Overall'}
                  value={ratings.overall}
                  onChange={(value) => setRatings((current) => ({ ...current, overall: value }))}
                />

                <div className="grid gap-5 sm:grid-cols-2">
                  <RatingRadioGroup
                    name="noise"
                    label="Noise Level"
                    description={ratingDescriptions.get('noise') ?? 'Noise'}
                    value={ratings.noise}
                    onChange={(value) => setRatings((current) => ({ ...current, noise: value }))}
                  />
                  <RatingRadioGroup
                    name="crowdedness"
                    label="Crowdedness"
                    description={ratingDescriptions.get('crowdedness') ?? 'Crowdedness'}
                    value={ratings.crowdedness}
                    onChange={(value) => setRatings((current) => ({ ...current, crowdedness: value }))}
                  />
                  <RatingRadioGroup
                    name="lighting"
                    label="Lighting / Sensory Stimuli"
                    description={ratingDescriptions.get('lighting') ?? 'Lighting'}
                    value={ratings.lighting}
                    onChange={(value) => setRatings((current) => ({ ...current, lighting: value }))}
                  />
                  <RatingRadioGroup
                    name="staffHospitality"
                    label="Staff Hospitality"
                    description={ratingDescriptions.get('staffHospitality') ?? 'Staff'}
                    value={ratings.staffHospitality}
                    onChange={(value) => setRatings((current) => ({ ...current, staffHospitality: value }))}
                  />
                  <RatingRadioGroup
                    name="parking"
                    label="Parking Accessibility"
                    description={ratingDescriptions.get('parking') ?? 'Parking'}
                    value={ratings.parking}
                    onChange={(value) => setRatings((current) => ({ ...current, parking: value }))}
                  />
                  <RatingRadioGroup
                    name="navigation"
                    label="Navigation"
                    description={ratingDescriptions.get('navigation') ?? 'Navigation'}
                    value={ratings.navigation}
                    onChange={(value) => setRatings((current) => ({ ...current, navigation: value }))}
                  />
                  <RatingRadioGroup
                    name="elevators"
                    label="Elevators"
                    description={ratingDescriptions.get('elevators') ?? 'Elevators'}
                    value={ratings.elevators}
                    onChange={(value) => setRatings((current) => ({ ...current, elevators: value }))}
                  />
                  <RatingRadioGroup
                    name="stairs"
                    label="Stairs"
                    description={ratingDescriptions.get('stairs') ?? 'Stairs'}
                    value={ratings.stairs}
                    onChange={(value) => setRatings((current) => ({ ...current, stairs: value }))}
                  />
                </div>
              </div>

              <fieldset className="grid gap-2">
                <legend className="text-sm font-semibold text-ink-900">
                  Would you recommend it for sensory-sensitive families?
                </legend>
                <div className="flex flex-wrap gap-2">
                  {(['yes', 'no'] as const).map((value) => (
                    <label
                      key={value}
                      className={`cursor-pointer rounded-xl px-4 py-2 text-sm font-semibold ring-1 ring-inset transition-colors focus-within:ring-2 focus-within:ring-brand-500 motion-reduce:transition-none ${
                        recommend === value
                          ? 'bg-brand-600 text-sand-50 ring-brand-600/20'
                          : 'bg-sand-50 text-ink-900 ring-ink-100/60 hover:bg-sand-100'
                      }`}
                    >
                      <input
                        type="radio"
                        name="recommend"
                        value={value}
                        checked={recommend === value}
                        onChange={() => setRecommend(value)}
                        className="sr-only"
                      />
                      {value === 'yes' ? 'Yes' : 'No'}
                    </label>
                  ))}
                </div>
                {errors.recommend ? <span className="text-xs font-semibold text-red-800">{errors.recommend}</span> : null}
              </fieldset>

              <fieldset className="grid gap-2">
                <legend className="text-sm font-semibold text-ink-900">Tags (optional)</legend>
                <p className="text-xs leading-relaxed text-ink-700">Select any notes that match your experience.</p>
                <div className="flex flex-wrap gap-2">
                  {TAGS.map((tag) => {
                    const checked = tags.includes(tag.id)
                    return (
                      <label
                        key={tag.id}
                        className={`cursor-pointer rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ring-inset transition-colors focus-within:ring-2 focus-within:ring-brand-500 motion-reduce:transition-none ${
                          checked
                            ? 'bg-brand-600 text-sand-50 ring-brand-600/20'
                            : 'bg-sand-50 text-ink-900 ring-ink-100/60 hover:bg-sand-100'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() =>
                            setTags((current) => (checked ? current.filter((id) => id !== tag.id) : [...current, tag.id]))
                          }
                          className="sr-only"
                        />
                        {tag.label}
                      </label>
                    )
                  })}
                </div>
              </fieldset>

              <label className="grid gap-1 text-sm">
                <span className="text-sm font-semibold text-ink-900">Your review</span>
                <span className="text-xs leading-relaxed text-ink-700">
                  What felt manageable? What was hard? Any tips for timing, entry, or accommodations?
                </span>
                <textarea
                  value={text}
                  onChange={(event) => setText(event.target.value)}
                  rows={6}
                  placeholder="Example: We went at opening and it was calm. The music got louder around 10am. Staff were kind when we asked to sit away from speakers..."
                  className="w-full rounded-xl border-ink-100/60 bg-sand-50 text-sm text-ink-900 placeholder:text-ink-700 focus:border-brand-500 focus:ring-brand-500"
                />
                {errors.text ? <span className="text-xs font-semibold text-red-800">{errors.text}</span> : null}
              </label>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Button type="submit" variant="secondary" size="lg" disabled={!canSubmit}>
                  {reviewMode === 'listed' ? 'Save review' : 'Save note'}
                </Button>
                {reviewMode === 'listed' && placeId ? (
                  <ButtonLink to={`/places/${placeId}`} variant="ghost" size="lg">
                    Preview place page
                  </ButtonLink>
                ) : null}
              </div>

              <div className="rounded-2xl bg-sand-100 p-4 text-sm text-ink-800">
                <div className="flex items-start gap-2">
                  <Info className="mt-0.5 h-4 w-4 text-brand-700" aria-hidden="true" />
                  <div>
                    <div className="font-semibold text-ink-900">Saved on this device</div>
                    <div className="mt-1 leading-relaxed">
                      Everything you add is stored only in this browser using localStorage. Clearing site data will
                      remove it.
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </Card>

          <div className="lg:col-span-5">
            <Card className="p-6">
              <div className="text-sm font-semibold text-ink-900">Place preview</div>

              {reviewMode === 'listed' ? (
                place ? (
                  <div className="mt-4 grid gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <CategoryBadge categoryId={place.categoryId} />
                    </div>
                    <div className="text-lg font-semibold text-ink-900">{place.name}</div>
                    <div className="text-sm text-ink-700">{place.address}</div>
                    <p className="text-sm leading-relaxed text-ink-800">{place.shortDescription}</p>
                  </div>
                ) : (
                  <div className="mt-4 rounded-2xl bg-sand-100 p-4 text-sm text-ink-800">
                    Choose a listed place to preview it here.
                  </div>
                )
              ) : isNonEmpty(customPlaceName) || customCategory || isNonEmpty(customAddress) ? (
                <div className="mt-4 grid gap-3">
                  {customCategory ? (
                    <div className="flex flex-wrap items-center gap-2">
                      <CategoryBadge categoryId={customCategory as CategoryId} />
                    </div>
                  ) : null}
                  <div className="text-lg font-semibold text-ink-900">
                    {isNonEmpty(customPlaceName) ? customPlaceName.trim() : 'Your place name'}
                  </div>
                  {isNonEmpty(customAddress) ? <div className="text-sm text-ink-700">{customAddress.trim()}</div> : null}
                  <p className="text-sm leading-relaxed text-ink-800">
                    This local-only review will stay on this device and appear in the saved reviews section below.
                  </p>
                </div>
              ) : (
                <div className="mt-4 rounded-2xl bg-sand-100 p-4 text-sm text-ink-800">
                  Start typing the place name and category, and you’ll see the preview here.
                </div>
              )}
            </Card>

            <Card className="mt-4 p-6">
              <div className="flex items-center justify-between gap-3">
                <div className="text-sm font-semibold text-ink-900">Your saved notes</div>
                <Badge className="bg-sand-100">{unlistedReviews.length}</Badge>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-ink-800">
                These local-only entries stay on this device. They help you keep notes even before a place is added to
                the site.
              </p>

              {unlistedReviews.length > 0 ? (
                <div className="mt-4 grid max-h-[36rem] gap-4 overflow-auto pr-1">
                  {unlistedReviews.map((review) => (
                    <UnlistedPlaceReviewCard key={review.id} review={review} />
                  ))}
                </div>
              ) : (
                <div className="mt-4 rounded-2xl bg-sand-100 p-4 text-sm text-ink-800">
                  Add a note for a place not on the map yet — it'll show up here.
                </div>
              )}
            </Card>

            <Card className="mt-4 p-6">
              <div className="text-sm font-semibold text-ink-900">Categories</div>
              <div className="mt-3 flex flex-wrap gap-2">
                {CATEGORIES.map((category) => (
                  <Badge key={category.id} className="bg-sand-100">
                    {category.label}
                  </Badge>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </Container>
    </div>
  )
}
