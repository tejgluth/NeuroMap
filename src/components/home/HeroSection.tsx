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
                Calm, parent-powered planning
              </div>
              <h1 className="mt-4 text-balance text-4xl font-semibold tracking-tight text-ink-900 sm:text-5xl">
                Adventure Without Uncertainty
              </h1>
              <p className="mt-4 max-w-2xl text-pretty text-base leading-relaxed text-ink-800 sm:text-lg">
                NeuroMap is a parent-powered platform that helps families with autistic children find sensory-friendly
                places before they go — so you can anticipate triggers, choose better timing, and step out with
                confidence.
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

              <p className="mt-4 text-xs leading-relaxed text-ink-700">
                Note: Reviews you add are saved locally on this device (using localStorage).
              </p>
            </div>

            <div className="lg:col-span-5">
              <div className="grid gap-4">
                <div className="rounded-2xl border border-ink-100/60 bg-sand-100 p-5 shadow-soft">
                  <div className="text-sm font-semibold text-ink-900">What families actually need</div>
                  <ul className="mt-3 space-y-2 text-sm text-ink-800">
                    <li className="flex gap-2">
                      <span className="mt-1 h-2 w-2 rounded-full bg-brand-600" />
                      Noise and sudden sound spikes
                    </li>
                    <li className="flex gap-2">
                      <span className="mt-1 h-2 w-2 rounded-full bg-brand-600" />
                      Crowds and tight transitions
                    </li>
                    <li className="flex gap-2">
                      <span className="mt-1 h-2 w-2 rounded-full bg-brand-600" />
                      Lighting, layout, and staff support
                    </li>
                    <li className="flex gap-2">
                      <span className="mt-1 h-2 w-2 rounded-full bg-brand-600" />
                      Best times to visit, not vague labels
                    </li>
                  </ul>
                </div>

                <div className="rounded-2xl border border-ink-100/60 bg-sand-50 p-5">
                  <div className="text-sm font-semibold text-ink-900">Designed to feel calm</div>
                  <p className="mt-2 text-sm leading-relaxed text-ink-800">
                    Clear hierarchy, readable spacing, and gentle color — built for caregivers planning under stress.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </Container>
    </section>
  )
}
