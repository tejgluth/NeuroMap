import {
  AlertCircle,
  ArrowLeft,
  Clock,
  Heart,
  Lightbulb,
  MapPin,
  MessageSquarePlus,
  Zap,
} from 'lucide-react'
import { Link, useSearchParams, useParams } from 'react-router-dom'

import CategoryBadge from '../components/places/CategoryBadge'
import RatingsBreakdown from '../components/places/RatingsBreakdown'
import ReviewCard from '../components/places/ReviewCard'
import Container from '../components/ui/Container'
import Card from '../components/ui/Card'
import Spinner from '../components/ui/Spinner'
import { ButtonLink } from '../components/ui/Button'
import { usePlace } from '../hooks/usePlaces'
import { useReviews, useDeleteReview, useReportReview, dbReviewToLegacy } from '../hooks/useReviews'
import { useFavorites } from '../hooks/useFavorites'
import { useAuth } from '../contexts/AuthContext'
import { cn } from '../lib/cn'

function PlanningCard({
  icon: Icon,
  title,
  items,
}: {
  icon: React.ElementType
  title: string
  items: string[]
}) {
  return (
    <div className="rounded-2xl border border-ink-100/60 bg-sand-50 p-6 shadow-card">
      <div className="flex items-center gap-2.5 text-sm font-semibold text-ink-900">
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-brand-100 text-brand-700">
          <Icon className="h-3.5 w-3.5" aria-hidden="true" />
        </span>
        {title}
      </div>
      <ul className="mt-4 space-y-2.5">
        {items.map((item) => (
          <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-ink-700">
            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-brand-500" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function PlacePage() {
  const { slug } = useParams()
  const [searchParams] = useSearchParams()
  const { place, loading: placeLoading } = usePlace(slug)
  const { rows, loading: reviewsLoading, refetch } = useReviews(place?.id)
  const { user } = useAuth()
  const { favoriteIds, toggling, toggle } = useFavorites()
  const { deleteReview } = useDeleteReview()
  const { report } = useReportReview()

  const isFavorite = place ? favoriteIds.has(place.id) : false
  const isToggling = place ? toggling === place.id : false

  if (placeLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Spinner />
      </div>
    )
  }

  if (!place) {
    return (
      <div className="py-16">
        <Container>
          <Card className="p-10 text-center">
            <h1 className="text-xl font-semibold text-ink-900">Place not found</h1>
            <p className="mt-2 text-ink-600">We couldn't find that place. Try exploring the map instead.</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
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

  const ratings = place.computedRatings
  const reviewed = searchParams.get('reviewed') === '1'
  const hasStructuredRatings = Object.values(ratings).some((v) => typeof v === 'number' && Number.isFinite(v))

  const showPlanningInfo =
    Boolean(place.sensoryOverview) ||
    Boolean(place.bestTimesToVisit?.length) ||
    Boolean(place.commonTriggers?.length) ||
    Boolean(place.helpfulAccommodations?.length) ||
    Boolean(place.parentTips?.length)

  async function handleDelete(reviewId: string) {
    await deleteReview(reviewId)
    refetch()
  }

  async function handleReport(reviewId: string, reason: string) {
    if (!user) return
    await report(reviewId, user.id, reason)
  }

  return (
    <div className="py-8 sm:py-12">
      <Container>
        {/* ── Review submitted banner ── */}
        {reviewed && (
          <div className="mb-6 rounded-2xl border border-brand-200 bg-brand-50 px-5 py-4">
            <div className="text-sm font-semibold text-brand-900">Review submitted. Thank you.</div>
            <p className="mt-1 text-sm text-brand-800">Your review is now visible below.</p>
          </div>
        )}

        {/* ── Back link ── */}
        <Link
          to="/map"
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-ink-600 no-underline hover:text-ink-900 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
          Back to map
        </Link>

        {/* ── Place header ── */}
        <div className="grid gap-8 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-7">
            <div className="flex flex-wrap items-center gap-2">
              <CategoryBadge categoryId={place.categoryId} />
            </div>

            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl">
              {place.name}
            </h1>
            <p className="mt-2 flex items-start gap-2 text-sm text-ink-600">
              <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-600" aria-hidden="true" />
              {place.address}
            </p>
            <p className="mt-4 text-base leading-relaxed text-ink-700">{place.shortDescription}</p>

            <div className="mt-6 flex flex-wrap gap-2.5">
              <ButtonLink to={`/add-review?place=${encodeURIComponent(place.slug)}`} variant="secondary">
                <MessageSquarePlus className="h-4 w-4" aria-hidden="true" />
                Add a Review
              </ButtonLink>

              {user ? (
                <button
                  type="button"
                  onClick={() => toggle(place.id)}
                  disabled={isToggling}
                  aria-label={isFavorite ? 'Remove from saved places' : 'Save this place'}
                  className={cn(
                    'inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold ring-1 ring-inset transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 motion-reduce:transition-none disabled:opacity-50 shadow-sm',
                    isFavorite
                      ? 'bg-brand-50 text-brand-900 ring-brand-200/70 hover:bg-brand-100'
                      : 'bg-sand-50 text-ink-800 ring-ink-100/60 hover:bg-sand-100',
                  )}
                >
                  <Heart
                    className={cn('h-4 w-4', isFavorite ? 'fill-brand-600 text-brand-600' : 'text-ink-400')}
                    aria-hidden="true"
                  />
                  {isFavorite ? 'Saved' : 'Save place'}
                </button>
              ) : (
                <Link
                  to={`/sign-in?returnTo=/places/${place.slug}`}
                  className="inline-flex items-center gap-2 rounded-xl bg-sand-50 px-4 py-2 text-sm font-semibold text-ink-800 no-underline ring-1 ring-inset ring-ink-100/60 transition-colors hover:bg-sand-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 shadow-sm"
                >
                  <Heart className="h-4 w-4 text-ink-400" aria-hidden="true" />
                  Save place
                </Link>
              )}
            </div>
          </div>

          {/* ── Ratings summary ── */}
          <div className="lg:col-span-5">
            <Card className="p-6">
              <div className="text-sm font-semibold text-ink-900">Community ratings</div>
              <p className="mt-1.5 text-xs leading-relaxed text-ink-500">
                Based on parent-reported visits. May vary by time of day, staffing, or season.
              </p>

              {hasStructuredRatings ? (
                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-sand-100 p-4 text-center">
                    <div className="text-3xl font-semibold tracking-tight text-ink-900">
                      {typeof ratings.overall === 'number' ? ratings.overall.toFixed(1) : '—'}
                    </div>
                    <div className="mt-1 text-xs font-medium text-ink-500">
                      {typeof ratings.overall === 'number' ? 'Overall · out of 5' : 'Overall'}
                    </div>
                  </div>
                  <div className="rounded-xl bg-sand-100 p-4 text-center">
                    <div className="text-3xl font-semibold tracking-tight text-ink-900">
                      {typeof ratings.noise === 'number' ? ratings.noise.toFixed(1) : '—'}
                    </div>
                    <div className="mt-1 text-xs font-medium text-ink-500">
                      {typeof ratings.noise === 'number' ? 'Noise · out of 5' : 'Noise'}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-5 rounded-xl bg-sand-100 p-5">
                  <div className="text-sm font-semibold text-ink-800">No ratings yet</div>
                  <p className="mt-1.5 text-sm text-ink-600">
                    Be the first to share what this place felt like. Your ratings help other families plan with confidence.
                  </p>
                  <div className="mt-4">
                    <ButtonLink to={`/add-review?place=${encodeURIComponent(place.slug)}`} variant="secondary">
                      Add the first rating
                    </ButtonLink>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>

        {/* ── Sensory breakdown ── */}
        <div className="mt-12">
          <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-brand-700">Breakdown</div>
          <h2 className="text-xl font-semibold text-ink-900 sm:text-2xl">Sensory breakdown</h2>
          <p className="mt-1.5 text-sm text-ink-600">
            Scores are 1–5. Higher means calmer or more accessible.
          </p>

          {hasStructuredRatings ? (
            <div className="mt-6">
              <RatingsBreakdown ratings={ratings} />
            </div>
          ) : (
            <Card className="mt-6 p-7">
              <p className="text-sm text-ink-600">
                No structured ratings yet. Add a review to help other families plan.
              </p>
              <div className="mt-4">
                <ButtonLink to={`/add-review?place=${encodeURIComponent(place.slug)}`} variant="secondary">
                  Add a Review
                </ButtonLink>
              </div>
            </Card>
          )}
        </div>

        {/* ── Planning info ── */}
        {showPlanningInfo ? (
          <div className="mt-12">
            <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-brand-700">Planning notes</div>
            <h2 className="text-xl font-semibold text-ink-900 sm:text-2xl">What to expect</h2>
            <p className="mt-1.5 text-sm text-ink-600">
              Practical details compiled from parent reviews and community knowledge.
            </p>

            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              {place.sensoryOverview && (
                <div className="rounded-2xl border border-ink-100/60 bg-sand-50 p-6 shadow-card lg:col-span-2">
                  <div className="flex items-center gap-2.5 text-sm font-semibold text-ink-900">
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-brand-100 text-brand-700">
                      <Zap className="h-3.5 w-3.5" aria-hidden="true" />
                    </span>
                    Sensory overview
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-ink-700">{place.sensoryOverview}</p>
                </div>
              )}

              {place.bestTimesToVisit && place.bestTimesToVisit.length > 0 && (
                <PlanningCard
                  icon={Clock}
                  title="Best times to visit"
                  items={place.bestTimesToVisit}
                />
              )}

              {place.commonTriggers && place.commonTriggers.length > 0 && (
                <PlanningCard
                  icon={AlertCircle}
                  title="Common triggers"
                  items={place.commonTriggers}
                />
              )}

              {place.helpfulAccommodations && place.helpfulAccommodations.length > 0 && (
                <PlanningCard
                  icon={Heart}
                  title="Helpful accommodations"
                  items={place.helpfulAccommodations}
                />
              )}

              {place.parentTips && place.parentTips.length > 0 && (
                <div className="rounded-2xl border border-ink-100/60 bg-sand-50 p-6 shadow-card lg:col-span-2">
                  <div className="flex items-center gap-2.5 text-sm font-semibold text-ink-900">
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-brand-100 text-brand-700">
                      <Lightbulb className="h-3.5 w-3.5" aria-hidden="true" />
                    </span>
                    Parent tips
                  </div>
                  <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
                    {place.parentTips.map((t) => (
                      <li key={t} className="flex gap-2.5 text-sm leading-relaxed text-ink-700">
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-brand-500" />
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ) : (
          <Card className="mt-12 p-7">
            <div className="text-sm font-semibold text-ink-800">Planning notes</div>
            <p className="mt-1.5 text-sm text-ink-600">
              This section fills in as families add reviews. Add one to help others plan.
            </p>
          </Card>
        )}

        {/* ── Reviews ── */}
        <div className="mt-12">
          <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-brand-700">Reviews</div>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-ink-900 sm:text-2xl">Parent reviews</h2>
              <p className="mt-1 text-sm text-ink-600">Shared by parents and caregivers.</p>
            </div>
            <ButtonLink to={`/add-review?place=${encodeURIComponent(place.slug)}`} variant="secondary">
              <MessageSquarePlus className="h-4 w-4" aria-hidden="true" />
              Write a Review
            </ButtonLink>
          </div>

          <div className="mt-6 grid gap-4">
            {reviewsLoading ? (
              <div className="flex justify-center py-8">
                <Spinner />
              </div>
            ) : rows.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-sm font-medium text-ink-700">No reviews yet for {place.name}.</p>
                <p className="mt-1 text-sm text-ink-500">Be the first to share your experience.</p>
                <div className="mt-5">
                  <ButtonLink to={`/add-review?place=${encodeURIComponent(place.slug)}`} variant="secondary">
                    Add the first review
                  </ButtonLink>
                </div>
              </Card>
            ) : (
              rows.map((row) => (
                <ReviewCard
                  key={row.id}
                  review={dbReviewToLegacy(row)}
                  currentUserId={user?.id}
                  reviewUserId={row.user_id}
                  onDelete={handleDelete}
                  onReport={handleReport}
                />
              ))
            )}
          </div>
        </div>
      </Container>
    </div>
  )
}
