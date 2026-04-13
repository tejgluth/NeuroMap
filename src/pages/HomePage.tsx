import {
  ArrowRight,
  CheckCircle2,
  Clock,
  MapPin,
  MessageSquarePlus,
  Search,
} from 'lucide-react'

import HeroSection from '../components/home/HeroSection'
import StatCard from '../components/home/StatCard'
import Container from '../components/ui/Container'
import SectionHeading from '../components/ui/SectionHeading'
import { ButtonLink } from '../components/ui/Button'
import { RATING_DIMENSIONS } from '../data/ratings'

export default function HomePage() {
  return (
    <div>
      <HeroSection />

      {/* ── The reality section ── */}
      <section className="border-b border-ink-100/60 py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="The problem"
            title={`\u201cAutism-friendly\u201d labels aren\u2019t enough.`}
            description="Families need specifics, not a sticker. A single label doesn't tell you whether it's loud, how staff respond, or when to avoid the busiest hours."
          />

          <div className="mt-12 grid gap-px divide-y divide-ink-100/60 sm:divide-y-0 sm:grid-cols-3 sm:divide-x rounded-2xl border border-ink-100/60 bg-ink-100/40 overflow-hidden">
            <div className="bg-sand-50 px-8 py-8">
              <StatCard
                value="70%"
                label="of parents feel unwelcome in public"
                supporting="Many families avoid outings entirely after being stared at, questioned, or asked to leave."
              />
            </div>
            <div className="bg-sand-50 px-8 py-8">
              <StatCard
                value="21%"
                label="have been asked to leave a venue"
                supporting="Even careful planning fails when the environment itself isn't prepared or responsive."
              />
            </div>
            <div className="bg-sand-50 px-8 py-8">
              <StatCard
                value="1 in 31"
                label="children in the U.S. are autistic"
                supporting="This is not a niche issue. Every community needs honest, practical sensory information."
              />
            </div>
          </div>
        </Container>
      </section>

      {/* ── Nine dimensions ── */}
      <section className="py-16 sm:py-20">
        <Container>
          <div className="lg:grid lg:grid-cols-12 lg:gap-12 lg:items-start">
            <div className="lg:col-span-4">
              <SectionHeading
                eyebrow="What we rate"
                title="Nine dimensions parents actually use."
                description="NeuroMap focuses on the signals that tell you whether a place is genuinely manageable: noise, predictability, layout, staff, and more."
              />
              <div className="mt-8">
                <ButtonLink to="/map" variant="primary">
                  See places on the map
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </ButtonLink>
              </div>
            </div>

            <div className="mt-10 lg:col-span-8 lg:mt-0">
              <div className="grid gap-3 sm:grid-cols-2">
                {RATING_DIMENSIONS.map((dim) => (
                  <div
                    key={dim.key}
                    className="flex items-start gap-3.5 rounded-2xl border border-ink-100/60 bg-sand-50 px-5 py-4 shadow-card"
                  >
                    <span
                      className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-brand-500"
                      aria-hidden="true"
                    />
                    <div>
                      <div className="text-sm font-semibold text-ink-900">{dim.label}</div>
                      <p className="mt-1 text-xs leading-relaxed text-ink-600">{dim.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ── How it works ── */}
      <section className="border-y border-ink-100/60 bg-sand-50 py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="How it works"
            title="Calmer outings start before you leave."
            description="The goal isn't a perfect place. It's knowing what to expect before you arrive."
            centered
          />

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <div className="relative rounded-2xl border border-ink-100/60 bg-sand-100 p-7">
              <div className="mb-4 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-sand-50">
                <Search className="h-4 w-4" aria-hidden="true" />
              </div>
              <div className="text-sm font-semibold text-ink-900">Search the map</div>
              <p className="mt-2 text-sm leading-relaxed text-ink-600">
                Browse places near La Jolla. Filter by category, noise level, or crowd density to narrow your options.
              </p>
            </div>
            <div className="relative rounded-2xl border border-ink-100/60 bg-sand-100 p-7">
              <div className="mb-4 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-sand-50">
                <Clock className="h-4 w-4" aria-hidden="true" />
              </div>
              <div className="text-sm font-semibold text-ink-900">Read parent reviews</div>
              <p className="mt-2 text-sm leading-relaxed text-ink-600">
                Get specific notes: when it gets noisy, where to sit, what triggers to expect, and the best time to visit.
              </p>
            </div>
            <div className="relative rounded-2xl border border-ink-100/60 bg-sand-100 p-7">
              <div className="mb-4 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-sand-50">
                <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
              </div>
              <div className="text-sm font-semibold text-ink-900">Plan with confidence</div>
              <p className="mt-2 text-sm leading-relaxed text-ink-600">
                Choose the right timing, bring the right supports, and reduce the uncertainty that drains everyone's energy.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* ── What families need ── */}
      <section className="border-y border-ink-100/60 bg-sand-50 py-16 sm:py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
            <div>
              <SectionHeading
                eyebrow="What we heard"
                title="Families need specifics, not scores."
              />
              <ul className="mt-8 space-y-4">
                {[
                  '"I need to know what the wait feels like."',
                  '"We can handle noise — just not surprise noise."',
                  '"If I can plan an exit, we can try."',
                  '"Tell me whether the staff have been there before."',
                ].map((quote) => (
                  <li key={quote} className="flex gap-4">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" aria-hidden="true" />
                    <span className="text-ink-700 leading-relaxed">{quote}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-ink-100/60 bg-sand-100 p-8">
              <div className="text-sm font-semibold text-ink-900">What NeuroMap does differently</div>
              <ul className="mt-5 space-y-4">
                {[
                  'Rates nine specific sensory dimensions, not just an overall score.',
                  'Written by parents who have been in your situation.',
                  'Focuses on practical planning: best times, common triggers, what helps.',
                  'Treats caregivers as the experts in their own experience.',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" aria-hidden="true" />
                    <span className="text-sm leading-relaxed text-ink-700">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-7">
                <ButtonLink to="/map" variant="ghost">
                  Explore the map
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </ButtonLink>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ── Impact section ── */}
      <section className="py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="Why it matters"
            title="More participation. Less recovery."
            description="When families know what to expect, they can prepare instead of dread. That changes what's possible."
          />

          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              'Anticipate triggers and choose calmer timing to prevent meltdowns.',
              'Replace trial-and-error with clear expectations and practical tips.',
              "Skip outings that won\u2019t work. Commit to ones that will.",
              'Participate more fully: parks, restaurants, errands, and events.',
              'Feel genuinely welcomed, not just tolerated, in your community.',
            ].map((item, i) => (
              <div
                key={item}
                className="flex items-start gap-3 rounded-2xl border border-ink-100/60 bg-sand-50 px-5 py-4 shadow-card"
              >
                <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-800">
                  {i + 1}
                </span>
                <p className="text-sm leading-relaxed text-ink-700">{item}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Final CTA ── */}
      <section className="border-t border-ink-100/60 bg-ink-900 py-16 sm:py-20">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-sand-50 sm:text-4xl">
              Ready to plan your next outing?
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-ink-200">
              Explore the map, read parent reviews, and add your own to help the next family.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <ButtonLink to="/map" variant="secondary" size="lg">
                <MapPin className="h-5 w-5" aria-hidden="true" />
                Explore Map
              </ButtonLink>
              <ButtonLink
                to="/add-review"
                size="lg"
                className="bg-sand-50 text-ink-900 ring-sand-200/20 hover:bg-sand-100"
              >
                <MessageSquarePlus className="h-5 w-5" aria-hidden="true" />
                Add a Review
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>
    </div>
  )
}
