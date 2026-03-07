import { AlertCircle, Info } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import CategoryBadge from '../components/places/CategoryBadge'
import RatingRadioGroup from '../components/reviews/RatingRadioGroup'
import Badge from '../components/ui/Badge'
import { Button, ButtonLink } from '../components/ui/Button'
import Card from '../components/ui/Card'
import Container from '../components/ui/Container'
import SectionHeading from '../components/ui/SectionHeading'
import { CATEGORIES } from '../data/categories'
import { PLACES, PLACE_BY_SLUG } from '../data/places'
import { RATING_DIMENSIONS } from '../data/ratings'
import { TAGS } from '../data/tags'
import { addLocalReview } from '../lib/reviewsStorage'
import type { Ratings, Review, TagId, VisitTime, ChildAgeRange } from '../types'

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

function isNonEmpty(text: string) {
  return text.trim().length > 0
}

function validateReview(input: {
  placeId: string
  visitTime: VisitTime | ''
  recommend: Review['recommendForSensorySensitiveFamilies'] | ''
  text: string
}) {
  const errors: Record<string, string> = {}
  if (!PLACE_BY_SLUG[input.placeId]) errors.placeId = 'Please choose a place.'
  if (!input.visitTime) errors.visitTime = 'Please choose a visit time.'
  if (!input.recommend) errors.recommend = 'Please choose yes or no.'
  if (input.text.trim().length < 20) errors.text = 'Please write at least 20 characters.'
  return errors
}

export default function AddReviewPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const placeId = searchParams.get('place') || ''
  const [displayName, setDisplayName] = useState('')
  const [visitTime, setVisitTime] = useState<VisitTime | ''>('')
  const [childAgeRange, setChildAgeRange] = useState<ChildAgeRange | ''>('')
  const [recommend, setRecommend] = useState<Review['recommendForSensorySensitiveFamilies'] | ''>('')
  const [tags, setTags] = useState<TagId[]>([])
  const [text, setText] = useState('')
  const [ratings, setRatings] = useState<Ratings>(DEFAULT_RATINGS)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitError, setSubmitError] = useState<string | null>(null)

  const place = placeId ? PLACE_BY_SLUG[placeId] : undefined

  const placesForSelect = useMemo(
    () => [...PLACES].sort((a, b) => a.name.localeCompare(b.name)),
    [],
  )

  const ratingDescriptions = useMemo(() => {
    const map = new Map(RATING_DIMENSIONS.map((d) => [d.key, d.description]))
    return map
  }, [])

  return (
    <div className="py-10 sm:py-12">
      <Container>
        <SectionHeading
          eyebrow="Add a review"
          title="Share what the environment felt like"
          description="Your review is saved locally on this device (localStorage) and will appear on the place page right away."
        />

        <div className="mt-8 grid gap-4 lg:grid-cols-12 lg:items-start">
          <Card className="p-6 lg:col-span-7">
            <form
              className="grid gap-5"
              onSubmit={(e) => {
                e.preventDefault()
                setSubmitError(null)

                const nextErrors = validateReview({ placeId, visitTime, recommend, text })
                setErrors(nextErrors)
                if (Object.keys(nextErrors).length > 0) {
                  return
                }

                try {
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
                } catch (err) {
                  const message = err instanceof Error ? err.message : 'Unknown error'
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

              <label className="grid gap-1 text-sm">
                <span className="text-xs font-semibold uppercase tracking-wide text-ink-700">Place</span>
                <select
                  value={placeId}
                  onChange={(e) => {
                    const next = e.target.value
                    setSearchParams(
                      (prev) => {
                        const sp = new URLSearchParams(prev)
                        if (next) sp.set('place', next)
                        else sp.delete('place')
                        return sp
                      },
                      { replace: true },
                    )
                  }}
                  className="w-full rounded-xl border-ink-100/60 bg-sand-50 text-sm text-ink-900 focus:border-brand-500 focus:ring-brand-500"
                >
                  <option value="">Choose a place…</option>
                  <optgroup label="Places near La Jolla">
                    {placesForSelect.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </optgroup>
                </select>
                {errors.placeId ? <span className="text-xs font-semibold text-red-800">{errors.placeId}</span> : null}
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-1 text-sm">
                  <span className="text-xs font-semibold uppercase tracking-wide text-ink-700">Your name (optional)</span>
                  <input
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Anonymous"
                    className="w-full rounded-xl border-ink-100/60 bg-sand-50 text-sm text-ink-900 placeholder:text-ink-700 focus:border-brand-500 focus:ring-brand-500"
                  />
                  <span className="text-xs text-ink-700">Leave blank to post as “Anonymous”.</span>
                </label>

                <label className="grid gap-1 text-sm">
                  <span className="text-xs font-semibold uppercase tracking-wide text-ink-700">Visit time</span>
                  <select
                    value={visitTime}
                    onChange={(e) => setVisitTime(e.target.value as VisitTime | '')}
                    className="w-full rounded-xl border-ink-100/60 bg-sand-50 text-sm text-ink-900 focus:border-brand-500 focus:ring-brand-500"
                  >
                    <option value="">Choose…</option>
                    {VISIT_TIMES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                  {errors.visitTime ? (
                    <span className="text-xs font-semibold text-red-800">{errors.visitTime}</span>
                  ) : null}
                </label>
              </div>

              <label className="grid gap-1 text-sm">
                <span className="text-xs font-semibold uppercase tracking-wide text-ink-700">Child age range (optional)</span>
                <select
                  value={childAgeRange}
                  onChange={(e) => setChildAgeRange(e.target.value as ChildAgeRange | '')}
                  className="w-full rounded-xl border-ink-100/60 bg-sand-50 text-sm text-ink-900 focus:border-brand-500 focus:ring-brand-500"
                >
                  <option value="">Prefer not to say</option>
                  {AGE_RANGES.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </label>

              <div className="rounded-2xl bg-sand-100 p-4">
                <div className="text-sm font-semibold text-ink-900">Ratings (1–5)</div>
                <p className="mt-1 text-sm leading-relaxed text-ink-800">
                  Higher is generally calmer / more accessible for sensory-sensitive families.
                </p>
              </div>

              <div className="grid gap-5">
                <RatingRadioGroup
                  name="overall"
                  label="Overall Autism-Friendliness"
                  description={ratingDescriptions.get('overall') ?? 'Overall'}
                  value={ratings.overall}
                  onChange={(v) => setRatings((r) => ({ ...r, overall: v }))}
                />

                <div className="grid gap-5 sm:grid-cols-2">
                  <RatingRadioGroup
                    name="noise"
                    label="Noise Level"
                    description={ratingDescriptions.get('noise') ?? 'Noise'}
                    value={ratings.noise}
                    onChange={(v) => setRatings((r) => ({ ...r, noise: v }))}
                  />
                  <RatingRadioGroup
                    name="crowdedness"
                    label="Crowdedness"
                    description={ratingDescriptions.get('crowdedness') ?? 'Crowdedness'}
                    value={ratings.crowdedness}
                    onChange={(v) => setRatings((r) => ({ ...r, crowdedness: v }))}
                  />
                  <RatingRadioGroup
                    name="lighting"
                    label="Lighting / Sensory Stimuli"
                    description={ratingDescriptions.get('lighting') ?? 'Lighting'}
                    value={ratings.lighting}
                    onChange={(v) => setRatings((r) => ({ ...r, lighting: v }))}
                  />
                  <RatingRadioGroup
                    name="staffHospitality"
                    label="Staff Hospitality"
                    description={ratingDescriptions.get('staffHospitality') ?? 'Staff'}
                    value={ratings.staffHospitality}
                    onChange={(v) => setRatings((r) => ({ ...r, staffHospitality: v }))}
                  />
                  <RatingRadioGroup
                    name="parking"
                    label="Parking Accessibility"
                    description={ratingDescriptions.get('parking') ?? 'Parking'}
                    value={ratings.parking}
                    onChange={(v) => setRatings((r) => ({ ...r, parking: v }))}
                  />
                  <RatingRadioGroup
                    name="navigation"
                    label="Navigation"
                    description={ratingDescriptions.get('navigation') ?? 'Navigation'}
                    value={ratings.navigation}
                    onChange={(v) => setRatings((r) => ({ ...r, navigation: v }))}
                  />
                  <RatingRadioGroup
                    name="elevators"
                    label="Elevators"
                    description={ratingDescriptions.get('elevators') ?? 'Elevators'}
                    value={ratings.elevators}
                    onChange={(v) => setRatings((r) => ({ ...r, elevators: v }))}
                  />
                  <RatingRadioGroup
                    name="stairs"
                    label="Stairs"
                    description={ratingDescriptions.get('stairs') ?? 'Stairs'}
                    value={ratings.stairs}
                    onChange={(v) => setRatings((r) => ({ ...r, stairs: v }))}
                  />
                </div>
              </div>

              <fieldset className="grid gap-2">
                <legend className="text-sm font-semibold text-ink-900">
                  Would you recommend for sensory-sensitive families?
                </legend>
                <div className="flex flex-wrap gap-2">
                  {(['yes', 'no'] as const).map((v) => (
                    <label
                      key={v}
                      className={`cursor-pointer rounded-xl px-4 py-2 text-sm font-semibold ring-1 ring-inset transition-colors focus-within:ring-2 focus-within:ring-brand-500 motion-reduce:transition-none ${
                        recommend === v
                          ? 'bg-brand-600 text-sand-50 ring-brand-600/20'
                          : 'bg-sand-50 text-ink-900 ring-ink-100/60 hover:bg-sand-100'
                      }`}
                    >
                      <input
                        type="radio"
                        name="recommend"
                        value={v}
                        checked={recommend === v}
                        onChange={() => setRecommend(v)}
                        className="sr-only"
                      />
                      {v === 'yes' ? 'Yes' : 'No'}
                    </label>
                  ))}
                </div>
                {errors.recommend ? (
                  <span className="text-xs font-semibold text-red-800">{errors.recommend}</span>
                ) : null}
              </fieldset>

              <fieldset className="grid gap-2">
                <legend className="text-sm font-semibold text-ink-900">Tags (optional)</legend>
                <p className="text-xs leading-relaxed text-ink-700">Select any notes that match your experience.</p>
                <div className="flex flex-wrap gap-2">
                  {TAGS.map((t) => {
                    const checked = tags.includes(t.id)
                    return (
                      <label
                        key={t.id}
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
                            setTags((prev) => (checked ? prev.filter((x) => x !== t.id) : [...prev, t.id]))
                          }
                          className="sr-only"
                        />
                        {t.label}
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
                  onChange={(e) => setText(e.target.value)}
                  rows={6}
                  placeholder="Example: We went at opening and it was calm. The music got louder around 10am. Staff were kind when we asked to sit away from speakers…"
                  className="w-full rounded-xl border-ink-100/60 bg-sand-50 text-sm text-ink-900 placeholder:text-ink-700 focus:border-brand-500 focus:ring-brand-500"
                />
                {errors.text ? <span className="text-xs font-semibold text-red-800">{errors.text}</span> : null}
              </label>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Button type="submit" variant="secondary" size="lg" disabled={!placeId}>
                  Save review locally
                </Button>
                {placeId ? (
                  <ButtonLink to={`/places/${placeId}`} variant="ghost" size="lg">
                    Preview place page
                  </ButtonLink>
                ) : null}
              </div>

              <div className="rounded-2xl bg-sand-100 p-4 text-sm text-ink-800">
                <div className="flex items-start gap-2">
                  <Info className="mt-0.5 h-4 w-4 text-brand-700" aria-hidden="true" />
                  <div>
                    <div className="font-semibold text-ink-900">Saved locally</div>
                    <div className="mt-1 leading-relaxed">
                      Reviews you add are stored only in this browser using localStorage. Clearing site data will remove
                      them.
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </Card>

          <div className="lg:col-span-5">
            <Card className="p-6">
              <div className="text-sm font-semibold text-ink-900">Selected place</div>

              {place ? (
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
                  Choose a place to see a quick preview here.
                </div>
              )}
            </Card>

            <Card className="mt-4 p-6">
              <div className="text-sm font-semibold text-ink-900">Categories</div>
              <div className="mt-3 flex flex-wrap gap-2">
                {CATEGORIES.map((c) => (
                  <Badge key={c.id} className="bg-sand-100">
                    {c.label}
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
