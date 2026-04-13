import { ArrowRight, MapPin, MessageSquarePlus } from 'lucide-react'

import Container from '../ui/Container'
import { ButtonLink } from '../ui/Button'

export default function HeroSection() {
  return (
    <section className="border-b border-ink-100/60 bg-sand-50 py-16 sm:py-20">
      <Container>
        <div className="mx-auto max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3.5 py-1.5 text-xs font-semibold text-brand-800">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-brand-500" aria-hidden="true" />
            Parent-powered sensory reviews · La Jolla, CA
          </div>

          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-ink-900 sm:text-5xl lg:text-6xl">
            Plan outings without
            <br className="hidden sm:block" />
            {' '}the guesswork.
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-700 sm:text-xl">
            NeuroMap helps families find sensory-aware places, rated by parents who know what noise, crowds, and sensory triggers actually feel like.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <ButtonLink to="/map" variant="primary" size="lg">
              <MapPin className="h-5 w-5" aria-hidden="true" />
              Explore the Map
            </ButtonLink>
            <ButtonLink to="/add-review" variant="ghost" size="lg">
              <MessageSquarePlus className="h-5 w-5" aria-hidden="true" />
              Add a Review
            </ButtonLink>
            <ButtonLink to="/about" variant="ghost" size="lg" className="text-ink-600 hover:text-ink-900">
              About the project
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </ButtonLink>
          </div>

          <div className="mt-12 border-t border-ink-100/60 pt-8">
            <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-ink-500">
              What parents look for
            </p>
            <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
              {[
                'Noise levels & sudden spikes',
                'Crowd density & transitions',
                'Staff patience & flexibility',
                'Best times to visit',
              ].map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm text-ink-700">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" aria-hidden="true" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
