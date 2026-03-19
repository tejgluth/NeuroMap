import { Compass, MapPin, MessageSquarePlus } from 'lucide-react'

import Container from '../ui/Container'
import Card from '../ui/Card'
import { ButtonLink } from '../ui/Button'

function HeroBackdrop() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.14]"
      viewBox="0 0 1200 600"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="stroke" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#5CB4B4" />
          <stop offset="1" stopColor="#44A4AC" />
        </linearGradient>
      </defs>
      <path
        d="M40 520C160 360 260 420 340 300C420 180 520 180 600 260C680 340 720 260 820 220C920 180 980 260 1160 120"
        fill="none"
        stroke="url(#stroke)"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <g fill="#44A4AC">
        <circle cx="340" cy="300" r="10" />
        <circle cx="600" cy="260" r="10" />
        <circle cx="820" cy="220" r="10" />
      </g>
      <g fill="#1C3444" opacity="0.9">
        <path d="M340 265c18 0 33 15 33 33 0 21-26 55-30 60a4 4 0 0 1-6 0c-4-5-30-39-30-60 0-18 15-33 33-33Z" />
        <path d="M600 225c18 0 33 15 33 33 0 21-26 55-30 60a4 4 0 0 1-6 0c-4-5-30-39-30-60 0-18 15-33 33-33Z" />
        <path d="M820 185c18 0 33 15 33 33 0 21-26 55-30 60a4 4 0 0 1-6 0c-4-5-30-39-30-60 0-18 15-33 33-33Z" />
      </g>
    </svg>
  )
}

export default function HeroSection() {
  return (
    <section className="py-10 sm:py-14">
      <Container>
        <Card className="relative overflow-hidden">
          <HeroBackdrop />
          <div className="relative grid gap-10 p-8 sm:p-10 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full bg-sand-100 px-3 py-1 text-xs font-semibold text-ink-800 ring-1 ring-inset ring-ink-100/60">
                <Compass className="h-4 w-4 text-brand-700" aria-hidden="true" />
                Parent-powered sensory reviews
              </div>
              <h1 className="mt-4 text-balance text-4xl font-semibold tracking-tight text-ink-900 sm:text-5xl">
                Adventure Without Uncertainty
              </h1>
              <p className="mt-4 max-w-2xl text-pretty text-base leading-relaxed text-ink-800 sm:text-lg">
                Find places rated by parents who understand sensory needs: noise levels, crowd patterns, staff support,
                and the best times to go. All before you leave home.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <ButtonLink to="/map" variant="primary" size="lg">
                  <MapPin className="h-5 w-5" aria-hidden="true" />
                  Explore Map
                </ButtonLink>
                <ButtonLink to="/add-review" variant="secondary" size="lg">
                  <MessageSquarePlus className="h-5 w-5" aria-hidden="true" />
                  Add a Review
                </ButtonLink>
              </div>

            </div>

            <div className="lg:col-span-5">
              <div className="grid gap-4">
                <div className="rounded-2xl border border-ink-100/60 bg-sand-100 p-5 shadow-soft">
                  <div className="text-sm font-semibold text-ink-900">What parents look for</div>
                  <ul className="mt-3 space-y-2 text-sm text-ink-800">
                    <li className="flex gap-2">
                      <span className="mt-1 h-2 w-2 rounded-full bg-brand-600" />
                      Noise levels and sudden sound spikes
                    </li>
                    <li className="flex gap-2">
                      <span className="mt-1 h-2 w-2 rounded-full bg-brand-600" />
                      Crowd density and transition zones
                    </li>
                    <li className="flex gap-2">
                      <span className="mt-1 h-2 w-2 rounded-full bg-brand-600" />
                      Staff patience and sensory accommodations
                    </li>
                    <li className="flex gap-2">
                      <span className="mt-1 h-2 w-2 rounded-full bg-brand-600" />
                      Best times to visit, not just vague labels
                    </li>
                  </ul>
                </div>

                <div className="rounded-2xl border border-ink-100/60 bg-sand-50 p-5">
                  <div className="text-sm font-semibold text-ink-900">How it works</div>
                  <ul className="mt-3 space-y-2 text-sm text-ink-800">
                    <li className="flex gap-2">
                      <span className="mt-1 h-2 w-2 rounded-full bg-brand-600" />
                      Search the map for places near La Jolla
                    </li>
                    <li className="flex gap-2">
                      <span className="mt-1 h-2 w-2 rounded-full bg-brand-600" />
                      Read parent reviews and sensory ratings
                    </li>
                    <li className="flex gap-2">
                      <span className="mt-1 h-2 w-2 rounded-full bg-brand-600" />
                      Plan your outing with real specifics
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </Container>
    </section>
  )
}
