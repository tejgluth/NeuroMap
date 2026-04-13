import { AlertCircle, CheckCircle2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import CategoryBadge from '../components/places/CategoryBadge'
import RatingRadioGroup from '../components/reviews/RatingRadioGroup'
import UnlistedPlaceReviewCard from '../components/reviews/UnlistedPlaceReviewCard'
import Badge from '../components/ui/Badge'
import { Button, ButtonLink } from '../components/ui/Button'
import Card from '../components/ui/Card'
import Container from '../components/ui/Container'
import { CATEGORIES } from '../data/categories'
import { RATING_DIMENSIONS } from '../data/ratings'
import { TAGS } from '../data/tags'
import { useLocalUnlistedPlaceReviews } from '../hooks/useLocalReviews'
import { addLocalUnlistedPlaceReview } from '../lib/reviewsStorage'
import { usePlaces } from '../hooks/usePlaces'
import { useSubmitReview } from '../hooks/useReviews'
import { useAuth } from '../contexts/AuthContext'
import type { CategoryId, ChildAgeRange, Ratings, Review, TagId, VisitTime } from '../types'
import type { ReviewInsert } from '../lib/database.types'

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
  placeSlug: string
  placeExists: boolean
  customPlaceName: string
  customCategory: CategoryId | ''
  visitTime: VisitTime | ''
  recommend: Review['recommendForSensorySensitiveFamilies'] | ''
  text: string
}) {
  const errors: Record<string, string> = {}

  if (input.mode === 'listed') {
    if (!input.placeSlug || !input.placeExists) errors.placeId = 'Please choose a place.'
  } else {
    if (!isNonEmpty(input.customPlaceName)) errors.customPlaceName = 'Please enter the place name.'
    if (!input.customCategory) errors.customCategory = 'Please choose a category.'
  }

  if (!input.visitTime) errors.visitTime = 'Please choose a visit time.'
  if (!input.recommend) errors.recommend = 'Please choose yes or no.'
  if (input.text.trim().length < 20) errors.text = 'Please write at least 20 characters.'
  return errors
}

function FormSection({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-sm font-semibold text-ink-900">{title}</div>
      {hint && <p className="mt-1 text-xs leading-relaxed text-ink-500">{hint}</p>}
      <div className="mt-3">{children}</div>
    </div>
  )
}

const inputClass =
  'w-full rounded-xl border border-ink-100/60 bg-sand-50 px-3.5 py-2.5 text-sm text-ink-900 placeholder:text-ink-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-colors'

const selectClass =
  'w-full rounded-xl border border-ink-100/60 bg-sand-50 px-3.5 py-2.5 text-sm text-ink-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-colors'

export default function AddReviewPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const placeSlug = searchParams.get('place') || ''

  const { places: dbPlaces, loading: placesLoading } = usePlaces()
  const { submit, loading: submitting } = useSubmitReview()
  const { user, profile } = useAuth()

  const [reviewMode, setReviewMode] = useState<ReviewMode>('listed')
  const [displayName, setDisplayName] = useState(profile?.display_name ?? '')
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

  const unlistedReviews = useLocalUnlistedPlaceReviews()

  const selectedPlace = useMemo(
    () => dbPlaces.find((p) => p.slug === placeSlug) ?? null,
    [dbPlaces, placeSlug],
  )

  const placesForSelect = useMemo(
    () => [...dbPlaces].sort((a, b) => a.name.localeCompare(b.name)),
    [dbPlaces],
  )

  const ratingDescriptions = useMemo(
    () => new Map(RATING_DIMENSIONS.map((d) => [d.key, d.description])),
    [],
  )

  const canSubmit =
    reviewMode === 'listed' ? Boolean(placeSlug) : isNonEmpty(customPlaceName) && Boolean(customCategory)

  function resetSharedReviewFields() {
    setDisplayName(profile?.display_name ?? '')
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

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setSubmitError(null)
    setSavedMessage(null)

    const nextErrors = validateReview({
      mode: reviewMode,
      placeSlug,
      placeExists: Boolean(selectedPlace),
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
        if (!selectedPlace) { setSubmitError('Place not found. Please try again.'); return }

        const resolvedName = isNonEmpty(displayName)
          ? displayName.trim()
          : (profile?.display_name ?? 'Anonymous')

        const payload: ReviewInsert = {
          place_id: selectedPlace.id,
          display_name: resolvedName,
          review_text: text.trim(),
          visit_time: visitTime as VisitTime,
          child_age_range: childAgeRange ? (childAgeRange as ChildAgeRange) : null,
          recommend: recommend ? (recommend as Review['recommendForSensorySensitiveFamilies']) : null,
          tags: tags.length > 0 ? tags : null,
          user_id: user?.id ?? null,
          rating_overall: ratings.overall,
          rating_noise: ratings.noise,
          rating_crowdedness: ratings.crowdedness,
          rating_staff_hospitality: ratings.staffHospitality,
          rating_lighting: ratings.lighting,
          rating_parking: ratings.parking,
          rating_navigation: ratings.navigation,
          rating_elevators: ratings.elevators,
          rating_stairs: ratings.stairs,
        }

        const { error } = await submit(payload)
        if (error) { setSubmitError(`Could not save your review. ${error}`); return }

        navigate(`/places/${selectedPlace.slug}?reviewed=1`, { replace: true })
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
      setSavedMessage(`Review saved for ${created.placeName}. It now appears below.`)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      setSubmitError(`Could not save your review. ${message}`)
    }
  }

  return (
    <div className="py-8 sm:py-12">
      <Container>
        <div className="mb-8">
          <div className="text-xs font-semibold uppercase tracking-wider text-brand-700">Share your experience</div>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-ink-900 sm:text-3xl">
            Add a sensory review
          </h1>
          <p className="mt-2 text-ink-600">
            Describe what the environment felt like. Specific details help other families plan.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-7">
            <Card className="divide-y divide-ink-100/60">
              <form className="divide-y divide-ink-100/60" onSubmit={handleSubmit}>
                {/* Submit error */}
                {submitError && (
                  <div className="p-5">
                    <div className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3.5 text-sm text-red-800">
                      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                      {submitError}
                    </div>
                  </div>
                )}

                {/* Saved message */}
                {savedMessage && (
                  <div className="p-5">
                    <div className="flex items-start gap-2.5 rounded-xl border border-brand-200 bg-brand-50 px-4 py-3.5 text-sm text-brand-800">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                      {savedMessage}
                    </div>
                  </div>
                )}

                {/* Place selection */}
                <div className="p-6">
                  <FormSection
                    title="Which place?"
                    hint="If the place isn't on the map yet, you can still add a note for it."
                  >
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => switchMode('listed')}
                        className={`rounded-lg px-3.5 py-2 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
                          reviewMode === 'listed'
                            ? 'bg-ink-900 text-sand-50'
                            : 'bg-sand-100 text-ink-700 hover:bg-sand-200'
                        }`}
                      >
                        Listed place
                      </button>
                      <button
                        type="button"
                        onClick={() => switchMode('unlisted')}
                        className={`rounded-lg px-3.5 py-2 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
                          reviewMode === 'unlisted'
                            ? 'bg-ink-900 text-sand-50'
                            : 'bg-sand-100 text-ink-700 hover:bg-sand-200'
                        }`}
                      >
                        Not listed yet
                      </button>
                    </div>

                    {reviewMode === 'listed' ? (
                      <div className="mt-3">
                        <select
                          value={placeSlug}
                          disabled={placesLoading}
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
                          className={selectClass + ' disabled:opacity-60'}
                        >
                          <option value="">{placesLoading ? 'Loading places…' : 'Choose a place…'}</option>
                          {!placesLoading && (
                            <optgroup label="Places near La Jolla">
                              {placesForSelect.map((p) => (
                                <option key={p.id} value={p.slug}>
                                  {p.name}
                                </option>
                              ))}
                            </optgroup>
                          )}
                        </select>
                        {errors.placeId && (
                          <p className="mt-1.5 text-xs font-semibold text-red-700">{errors.placeId}</p>
                        )}
                      </div>
                    ) : (
                      <div className="mt-4 grid gap-4 rounded-xl border border-ink-100/60 bg-sand-100 p-4 sm:grid-cols-2">
                        <label className="grid gap-1.5 sm:col-span-2">
                          <span className="text-xs font-semibold text-ink-600">Place name</span>
                          <input
                            value={customPlaceName}
                            onChange={(e) => setCustomPlaceName(e.target.value)}
                            placeholder="e.g. Small Steps Hair Studio"
                            className={inputClass}
                          />
                          {errors.customPlaceName && (
                            <p className="text-xs font-semibold text-red-700">{errors.customPlaceName}</p>
                          )}
                        </label>
                        <label className="grid gap-1.5">
                          <span className="text-xs font-semibold text-ink-600">Category</span>
                          <select
                            value={customCategory}
                            onChange={(e) => setCustomCategory(e.target.value as CategoryId | '')}
                            className={selectClass}
                          >
                            <option value="">Choose…</option>
                            {CATEGORIES.map((c) => (
                              <option key={c.id} value={c.id}>{c.label}</option>
                            ))}
                          </select>
                          {errors.customCategory && (
                            <p className="text-xs font-semibold text-red-700">{errors.customCategory}</p>
                          )}
                        </label>
                        <label className="grid gap-1.5">
                          <span className="text-xs font-semibold text-ink-600">Address or area (optional)</span>
                          <input
                            value={customAddress}
                            onChange={(e) => setCustomAddress(e.target.value)}
                            placeholder="e.g. Near La Jolla Blvd"
                            className={inputClass}
                          />
                        </label>
                      </div>
                    )}
                  </FormSection>
                </div>

                {/* Visitor info */}
                <div className="grid gap-5 p-6 sm:grid-cols-2">
                  <label className="grid gap-1.5">
                    <span className="text-xs font-semibold text-ink-600">Your name (optional)</span>
                    <input
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder={profile?.display_name ?? 'Anonymous'}
                      maxLength={80}
                      className={inputClass}
                    />
                    <span className="text-xs text-ink-400">
                      {user ? 'Defaults to your display name.' : 'Leave blank to post as "Anonymous".'}
                    </span>
                  </label>

                  <div className="grid gap-4">
                    <label className="grid gap-1.5">
                      <span className="text-xs font-semibold text-ink-600">When did you visit?</span>
                      <select
                        value={visitTime}
                        onChange={(e) => setVisitTime(e.target.value as VisitTime | '')}
                        className={selectClass}
                      >
                        <option value="">Choose…</option>
                        {VISIT_TIMES.map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                      {errors.visitTime && (
                        <p className="text-xs font-semibold text-red-700">{errors.visitTime}</p>
                      )}
                    </label>

                    <label className="grid gap-1.5">
                      <span className="text-xs font-semibold text-ink-600">Child age range (optional)</span>
                      <select
                        value={childAgeRange}
                        onChange={(e) => setChildAgeRange(e.target.value as ChildAgeRange | '')}
                        className={selectClass}
                      >
                        <option value="">Prefer not to say</option>
                        {AGE_RANGES.map((r) => (
                          <option key={r} value={r}>{r}</option>
                        ))}
                      </select>
                    </label>
                  </div>
                </div>

                {/* Ratings */}
                <div className="p-6">
                  <div className="text-sm font-semibold text-ink-900">Sensory ratings (1–5)</div>
                  <p className="mt-1 text-xs leading-relaxed text-ink-500">
                    Higher means calmer or more accessible. Rate each dimension based on your visit.
                  </p>

                  <div className="mt-5 grid gap-5">
                    <RatingRadioGroup
                      name="overall"
                      label="Overall autism-friendliness"
                      description={ratingDescriptions.get('overall') ?? ''}
                      value={ratings.overall}
                      onChange={(v) => setRatings((r) => ({ ...r, overall: v }))}
                    />

                    <div className="grid gap-5 sm:grid-cols-2">
                      <RatingRadioGroup
                        name="noise"
                        label="Noise level"
                        description={ratingDescriptions.get('noise') ?? ''}
                        value={ratings.noise}
                        onChange={(v) => setRatings((r) => ({ ...r, noise: v }))}
                      />
                      <RatingRadioGroup
                        name="crowdedness"
                        label="Crowdedness"
                        description={ratingDescriptions.get('crowdedness') ?? ''}
                        value={ratings.crowdedness}
                        onChange={(v) => setRatings((r) => ({ ...r, crowdedness: v }))}
                      />
                      <RatingRadioGroup
                        name="lighting"
                        label="Lighting & visual stimuli"
                        description={ratingDescriptions.get('lighting') ?? ''}
                        value={ratings.lighting}
                        onChange={(v) => setRatings((r) => ({ ...r, lighting: v }))}
                      />
                      <RatingRadioGroup
                        name="staffHospitality"
                        label="Staff hospitality"
                        description={ratingDescriptions.get('staffHospitality') ?? ''}
                        value={ratings.staffHospitality}
                        onChange={(v) => setRatings((r) => ({ ...r, staffHospitality: v }))}
                      />
                      <RatingRadioGroup
                        name="parking"
                        label="Parking & arrival"
                        description={ratingDescriptions.get('parking') ?? ''}
                        value={ratings.parking}
                        onChange={(v) => setRatings((r) => ({ ...r, parking: v }))}
                      />
                      <RatingRadioGroup
                        name="navigation"
                        label="Navigation & layout"
                        description={ratingDescriptions.get('navigation') ?? ''}
                        value={ratings.navigation}
                        onChange={(v) => setRatings((r) => ({ ...r, navigation: v }))}
                      />
                      <RatingRadioGroup
                        name="elevators"
                        label="Elevator access"
                        description={ratingDescriptions.get('elevators') ?? ''}
                        value={ratings.elevators}
                        onChange={(v) => setRatings((r) => ({ ...r, elevators: v }))}
                      />
                      <RatingRadioGroup
                        name="stairs"
                        label="Stairs & step-free options"
                        description={ratingDescriptions.get('stairs') ?? ''}
                        value={ratings.stairs}
                        onChange={(v) => setRatings((r) => ({ ...r, stairs: v }))}
                      />
                    </div>
                  </div>
                </div>

                {/* Recommendation */}
                <div className="p-6">
                  <fieldset>
                    <legend className="text-sm font-semibold text-ink-900">
                      Would you recommend it for sensory-sensitive families?
                    </legend>
                    <div className="mt-3 flex gap-2.5">
                      {(['yes', 'no'] as const).map((val) => (
                        <label
                          key={val}
                          className={`cursor-pointer rounded-xl px-5 py-2.5 text-sm font-semibold ring-1 ring-inset transition-colors focus-within:ring-2 focus-within:ring-brand-500 motion-reduce:transition-none ${
                            recommend === val
                              ? 'bg-brand-600 text-sand-50 ring-brand-600/20'
                              : 'bg-sand-100 text-ink-800 ring-ink-100/60 hover:bg-sand-200'
                          }`}
                        >
                          <input
                            type="radio"
                            name="recommend"
                            value={val}
                            checked={recommend === val}
                            onChange={() => setRecommend(val)}
                            className="sr-only"
                          />
                          {val === 'yes' ? "Yes, I'd recommend it" : 'Not for us'}
                        </label>
                      ))}
                    </div>
                    {errors.recommend && (
                      <p className="mt-1.5 text-xs font-semibold text-red-700">{errors.recommend}</p>
                    )}
                  </fieldset>
                </div>

                {/* Tags */}
                <div className="p-6">
                  <fieldset>
                    <legend className="text-sm font-semibold text-ink-900">Tags <span className="font-normal text-ink-400">(optional)</span></legend>
                    <p className="mt-1 text-xs text-ink-500">Select any that match your experience.</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {TAGS.map((tag) => {
                        const checked = tags.includes(tag.id)
                        return (
                          <label
                            key={tag.id}
                            className={`cursor-pointer rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ring-inset transition-colors focus-within:ring-2 focus-within:ring-brand-500 motion-reduce:transition-none ${
                              checked
                                ? 'bg-brand-600 text-sand-50 ring-brand-600/20'
                                : 'bg-sand-100 text-ink-700 ring-ink-100/60 hover:bg-sand-200'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() =>
                                setTags((curr) =>
                                  checked ? curr.filter((id) => id !== tag.id) : [...curr, tag.id],
                                )
                              }
                              className="sr-only"
                            />
                            {tag.label}
                          </label>
                        )
                      })}
                    </div>
                  </fieldset>
                </div>

                {/* Review text */}
                <div className="p-6">
                  <label className="grid gap-1.5">
                    <span className="text-sm font-semibold text-ink-900">Your review</span>
                    <span className="text-xs text-ink-500">
                      What felt manageable? What was hard? Any tips for timing, entry, or accommodations?
                    </span>
                    <textarea
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      rows={6}
                      maxLength={4000}
                      placeholder="e.g. We went at opening and it was calm. Music got louder around 10am. Staff were kind when we asked to sit away from speakers…"
                      className={inputClass + ' resize-none'}
                    />
                    <div className="flex items-center justify-between">
                      {errors.text && (
                        <p className="text-xs font-semibold text-red-700">{errors.text}</p>
                      )}
                      <p className="ml-auto text-xs text-ink-400 tabular-nums">
                        {text.length}/4000
                      </p>
                    </div>
                  </label>
                </div>

                {/* Submit */}
                <div className="flex flex-wrap items-center gap-3 p-6">
                  {reviewMode === 'listed' && !user ? (
                    <>
                      <ButtonLink
                        to={`/sign-in?returnTo=${encodeURIComponent('/add-review' + (placeSlug ? `?place=${placeSlug}` : ''))}`}
                        variant="secondary"
                        size="lg"
                      >
                        Sign in to post review
                      </ButtonLink>
                      <span className="text-sm text-ink-500">
                        An account is required to post reviews.
                      </span>
                    </>
                  ) : (
                    <>
                      <Button
                        type="submit"
                        variant="secondary"
                        size="lg"
                        disabled={!canSubmit || submitting}
                      >
                        {submitting ? 'Saving…' : reviewMode === 'listed' ? 'Save review' : 'Save note'}
                      </Button>
                      {reviewMode === 'listed' && placeSlug && (
                        <ButtonLink to={`/places/${placeSlug}`} variant="ghost" size="lg">
                          View place page
                        </ButtonLink>
                      )}
                    </>
                  )}
                </div>
              </form>
            </Card>
          </div>

          {/* ── Sidebar ── */}
          <div className="lg:col-span-5">
            {/* Place preview */}
            <Card className="p-5">
              <div className="text-sm font-semibold text-ink-900">Place preview</div>

              {reviewMode === 'listed' ? (
                selectedPlace ? (
                  <div className="mt-4 grid gap-2.5">
                    <CategoryBadge categoryId={selectedPlace.categoryId} />
                    <div className="text-base font-semibold text-ink-900">{selectedPlace.name}</div>
                    <div className="text-sm text-ink-500">{selectedPlace.address}</div>
                    <p className="text-sm leading-relaxed text-ink-600">{selectedPlace.shortDescription}</p>
                  </div>
                ) : (
                  <p className="mt-3 text-sm text-ink-500">
                    {placesLoading ? 'Loading places…' : 'Choose a place above to see a preview.'}
                  </p>
                )
              ) : isNonEmpty(customPlaceName) || customCategory ? (
                <div className="mt-4 grid gap-2.5">
                  {customCategory && <CategoryBadge categoryId={customCategory as CategoryId} />}
                  <div className="text-base font-semibold text-ink-900">
                    {isNonEmpty(customPlaceName) ? customPlaceName : 'Your place name'}
                  </div>
                  {isNonEmpty(customAddress) && (
                    <div className="text-sm text-ink-500">{customAddress}</div>
                  )}
                  <p className="text-sm text-ink-500">This note will be saved locally.</p>
                </div>
              ) : (
                <p className="mt-3 text-sm text-ink-500">
                  Fill in the place name and category above to see a preview.
                </p>
              )}
            </Card>

            {/* Saved notes */}
            <Card className="mt-3 p-5">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold text-ink-900">Your saved notes</div>
                <Badge className="bg-sand-100 text-ink-600">{unlistedReviews.length}</Badge>
              </div>
              <p className="mt-1.5 text-xs leading-relaxed text-ink-500">
                Notes for places not yet on the map. Stored in your browser.
              </p>

              {unlistedReviews.length > 0 ? (
                <div className="mt-4 grid max-h-96 gap-3 overflow-auto">
                  {unlistedReviews.map((review) => (
                    <UnlistedPlaceReviewCard key={review.id} review={review} />
                  ))}
                </div>
              ) : (
                <p className="mt-3 text-xs text-ink-400">None yet.</p>
              )}
            </Card>

            {/* Guidelines */}
            <div className="mt-3 rounded-2xl border border-ink-100/60 bg-sand-100 p-5">
              <div className="text-xs font-semibold text-ink-700 mb-2">What makes a helpful review</div>
              <ul className="space-y-1.5">
                {[
                  'Describe specific sensory details, not just a score.',
                  'Note the time and day if it changed the experience.',
                  'Mention what helped: a staff accommodation, a quieter spot.',
                  'Be honest. Families rely on honest information.',
                ].map((item) => (
                  <li key={item} className="flex gap-2 text-xs leading-relaxed text-ink-600">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-brand-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}
