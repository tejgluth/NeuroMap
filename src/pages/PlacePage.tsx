import { MapPin, MessageSquarePlus } from 'lucide-react'
import { Link, useSearchParams, useParams } from 'react-router-dom'

import CategoryBadge from '../components/places/CategoryBadge'
import RatingsBreakdown from '../components/places/RatingsBreakdown'
import ReviewCard from '../components/places/ReviewCard'
import Container from '../components/ui/Container'
import SectionHeading from '../components/ui/SectionHeading'
import Card from '../components/ui/Card'
import { ButtonLink } from '../components/ui/Button'
import { PLACE_BY_SLUG } from '../data/places'
import { useLocalReviewsForPlace } from '../hooks/useLocalReviews'
import { averageRatings, mergeComputedRatings } from '../lib/ratings'

export default function PlacePage() {
  const { slug } = useParams()
  const [searchParams] = useSearchParams()
  const place = slug ? PLACE_BY_SLUG[slug] : undefined
  const localReviews = useLocalReviewsForPlace(place?.id)

  if (!place) {
    return (
      <div className="py-16">
        <Container>
          <Card className="p-8">
            <h1 className="text-2xl font-semibold text-ink-900">Place not found</h1>
            <p className="mt-2 text-ink-700">We couldn’t find that place. Try exploring the map instead.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <ButtonLink to="/map" variant="primary">
                Explore Map
              </ButtonLink>
              <ButtonLink to="/" variant="ghost">
                Back to Home
              </ButtonLink>
            </div>
          </Card>
        </Container>
      </div>
    )
  }

  const reviews = [...place.seededReviews, ...localReviews]
  const ratings = mergeComputedRatings(averageRatings(reviews), place.seededRatings)
  const reviewed = searchParams.get('reviewed') === '1'
  const hasStructuredRatings = Object.values(ratings).some((v) => typeof v === 'number' && Number.isFinite(v))

  const showPlanningInfo =
    Boolean(place.sensoryOverview) ||
    Boolean(place.bestTimesToVisit?.length) ||
    Boolean(place.commonTriggers?.length) ||
    Boolean(place.helpfulAccommodations?.length) ||
    Boolean(place.parentTips?.length)

  return (
    <div className="py-10 sm:py-12">
      <Container>
        {reviewed ? (
          <Card className="mb-6 border-brand-200/60 bg-brand-50 p-5 shadow-soft">
            <div className="text-sm font-semibold text-ink-900">Review saved locally</div>
            <p className="mt-1 text-sm leading-relaxed text-ink-800">
              Thanks for contributing. Your review is stored in this browser only and is now visible below.
            </p>
          </Card>
        ) : null}
        <div className="grid gap-6 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-7">
            <div className="flex flex-wrap items-center gap-2">
              <CategoryBadge categoryId={place.categoryId} />
            </div>

            <h1 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl">
              {place.name}
            </h1>
            <p className="mt-3 flex items-start gap-2 text-sm leading-relaxed text-ink-800">
              <MapPin className="mt-0.5 h-4 w-4 text-brand-700" aria-hidden="true" />
              {place.address}
            </p>

            <p className="mt-4 text-pretty leading-relaxed text-ink-800">{place.shortDescription}</p>

            <div className="mt-6 flex flex-wrap gap-3">
              <ButtonLink to={`/add-review?place=${encodeURIComponent(place.slug)}`} variant="secondary">
                <MessageSquarePlus className="h-4 w-4" aria-hidden="true" />
                Add a Review
              </ButtonLink>
              <Link
                to="/map"
                className="rounded-xl bg-sand-50 px-4 py-2 text-sm font-semibold text-ink-900 no-underline ring-1 ring-inset ring-ink-100/60 transition-colors hover:bg-sand-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 motion-reduce:transition-none"
              >
                Back to map
              </Link>
            </div>
          </div>

          <Card className="p-6 lg:col-span-5">
            <div className="text-sm font-semibold text-ink-900">Ratings summary</div>
            <p className="mt-2 text-sm leading-relaxed text-ink-700">
              Ratings are community-reported and may change by time of day, season, staffing, or events. NeuroMap does
              not provide medical advice.
            </p>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              <div className="rounded-2xl bg-sand-100 p-4">
                <div className="text-xs font-semibold uppercase tracking-wide text-ink-700">Overall</div>
                <div className="mt-1 text-3xl font-semibold tracking-tight text-ink-900">
                  {typeof ratings.overall === 'number' ? ratings.overall.toFixed(1) : '—'}
                </div>
                <div className="mt-1 text-xs text-ink-700">{typeof ratings.overall === 'number' ? 'out of 5' : 'Not rated yet'}</div>
              </div>
              <div className="rounded-2xl bg-sand-100 p-4">
                <div className="text-xs font-semibold uppercase tracking-wide text-ink-700">Noise</div>
                <div className="mt-1 text-3xl font-semibold tracking-tight text-ink-900">
                  {typeof ratings.noise === 'number' ? ratings.noise.toFixed(1) : '—'}
                </div>
                <div className="mt-1 text-xs text-ink-700">{typeof ratings.noise === 'number' ? 'out of 5' : 'Not rated yet'}</div>
              </div>
            </div>
            {!hasStructuredRatings ? (
              <div className="mt-4 rounded-2xl border border-ink-100/60 bg-sand-50 p-4 text-sm text-ink-800">
                <div className="font-semibold text-ink-900">No structured ratings yet</div>
                <p className="mt-1 leading-relaxed text-ink-700">
                  Reviews are available below. Adding a review with ratings helps other families plan with clearer
                  expectations.
                </p>
                <div className="mt-3">
                  <ButtonLink to={`/add-review?place=${encodeURIComponent(place.slug)}`} variant="secondary">
                    Add a review with ratings
                  </ButtonLink>
                </div>
              </div>
            ) : null}
          </Card>
        </div>

        <div className="mt-10">
          <SectionHeading
            eyebrow="Breakdown"
            title="Sensory environment ratings"
            description="Scores are 1–5 (higher is generally calmer / more accessible)."
          />
          {hasStructuredRatings ? (
            <div className="mt-6">
              <RatingsBreakdown ratings={ratings} />
            </div>
          ) : (
            <Card className="mt-6 p-6">
              <div className="text-sm font-semibold text-ink-900">No structured ratings yet</div>
              <p className="mt-2 text-sm leading-relaxed text-ink-800">
                This place has reviews, but structured ratings haven’t been added yet. Share your experience to help
                other families plan.
              </p>
              <div className="mt-4">
                <ButtonLink to={`/add-review?place=${encodeURIComponent(place.slug)}`} variant="secondary">
                  Add a Review
                </ButtonLink>
              </div>
            </Card>
          )}
        </div>

        {showPlanningInfo ? (
          <div className="mt-10 grid gap-4 lg:grid-cols-12">
            {place.sensoryOverview ? (
              <Card className="p-6 lg:col-span-6">
                <div className="text-sm font-semibold text-ink-900">Sensory overview</div>
                <p className="mt-2 text-sm leading-relaxed text-ink-800">{place.sensoryOverview}</p>
              </Card>
            ) : null}

            {place.bestTimesToVisit && place.bestTimesToVisit.length > 0 ? (
              <Card className="p-6 lg:col-span-6">
                <div className="text-sm font-semibold text-ink-900">Best times to visit</div>
                <ul className="mt-2 space-y-2 text-sm leading-relaxed text-ink-800">
                  {place.bestTimesToVisit.map((t) => (
                    <li key={t} className="flex gap-2">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-brand-700" />
                      {t}
                    </li>
                  ))}
                </ul>
              </Card>
            ) : null}

            {place.commonTriggers && place.commonTriggers.length > 0 ? (
              <Card className="p-6 lg:col-span-6">
                <div className="text-sm font-semibold text-ink-900">Common triggers</div>
                <ul className="mt-2 space-y-2 text-sm leading-relaxed text-ink-800">
                  {place.commonTriggers.map((t) => (
                    <li key={t} className="flex gap-2">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-brand-700" />
                      {t}
                    </li>
                  ))}
                </ul>
              </Card>
            ) : null}

            {place.helpfulAccommodations && place.helpfulAccommodations.length > 0 ? (
              <Card className="p-6 lg:col-span-6">
                <div className="text-sm font-semibold text-ink-900">Helpful accommodations</div>
                <ul className="mt-2 space-y-2 text-sm leading-relaxed text-ink-800">
                  {place.helpfulAccommodations.map((t) => (
                    <li key={t} className="flex gap-2">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-brand-700" />
                      {t}
                    </li>
                  ))}
                </ul>
              </Card>
            ) : null}

            {place.parentTips && place.parentTips.length > 0 ? (
              <Card className="p-6 lg:col-span-12">
                <div className="text-sm font-semibold text-ink-900">Parent tips</div>
                <ul className="mt-2 grid gap-2 text-sm leading-relaxed text-ink-800 sm:grid-cols-2">
                  {place.parentTips.map((t) => (
                    <li key={t} className="flex gap-2">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-brand-700" />
                      {t}
                    </li>
                  ))}
                </ul>
              </Card>
            ) : null}
          </div>
        ) : (
          <Card className="mt-10 p-6">
            <div className="text-sm font-semibold text-ink-900">Planning notes</div>
            <p className="mt-2 text-sm leading-relaxed text-ink-800">
              Planning details like best times, common triggers, and helpful accommodations grow as more families
              contribute. For now, start with the reviews below — and consider adding a structured review to help the
              next caregiver.
            </p>
          </Card>
        )}

        <div className="mt-10">
          <SectionHeading
            eyebrow="Reviews"
            title="Parent reviews"
            description="Community reviews appear first. Any reviews you add are saved locally on this device and shown here."
          />

          <div className="mt-6 grid gap-4">
            {place.seededReviews.map((r) => (
              <ReviewCard key={r.id} review={r} />
            ))}
            {localReviews.map((r) => (
              <ReviewCard key={r.id} review={r} />
            ))}
          </div>

          <div className="mt-8">
            <ButtonLink to={`/add-review?place=${encodeURIComponent(place.slug)}`} variant="secondary" size="lg">
              <MessageSquarePlus className="h-5 w-5" aria-hidden="true" />
              Add a Review for {place.name}
            </ButtonLink>
          </div>
        </div>
      </Container>
    </div>
  )
}
