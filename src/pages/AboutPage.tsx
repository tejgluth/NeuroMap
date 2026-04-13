import { ArrowRight, GraduationCap, HeartHandshake, MapPin, MessageSquarePlus } from 'lucide-react'

import Container from '../components/ui/Container'
import Card from '../components/ui/Card'
import { ButtonLink } from '../components/ui/Button'

const TEAM = [
  { name: 'Nolan Ameriks', role: 'Co-founder' },
  { name: 'Nathan Hong', role: 'Co-founder' },
  { name: 'Tejas Gluth', role: 'Co-founder' },
  { name: 'Kent Isakari', role: 'Co-founder' },
  { name: 'Amaan Khan', role: 'Co-founder' },
  { name: 'Theron Schutz', role: 'Co-founder' },
]

function getInitials(name: string) {
  return name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export default function AboutPage() {
  return (
    <div className="py-10 sm:py-14">
      <Container>
        {/* ── Mission header ── */}
        <div className="mx-auto max-w-2xl">
          <div className="text-xs font-semibold uppercase tracking-wider text-brand-700">
            Social Innovation · The Bishop's School
          </div>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl">
            We built NeuroMap to help families plan outings with confidence.
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-ink-700">
            We kept hearing the same need from parents of autistic children: specific, honest information about sensory environments. Not vague labels, not a generic star rating.
          </p>
        </div>

        {/* ── Why we started / How it works ── */}
        <div className="mt-10 grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-ink-100/60 bg-sand-50 p-8 shadow-card">
            <div className="flex items-center gap-3 mb-5">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-100 text-brand-700">
                <HeartHandshake className="h-5 w-5" aria-hidden="true" />
              </span>
              <h2 className="text-base font-semibold text-ink-900">Why we started</h2>
            </div>
            <p className="text-sm leading-relaxed text-ink-700">
              Our team grew up alongside cousins with autism. Through personal experience, parent interviews, and community conversations, we kept hearing the same thing: families need honest, specific sensory information. Not a score. Not a certification. NeuroMap is our attempt to make that information easier to find and use before you leave home.
            </p>
          </div>

          <div className="rounded-2xl border border-ink-100/60 bg-sand-50 p-8 shadow-card">
            <div className="flex items-center gap-3 mb-5">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-100 text-brand-700">
                <GraduationCap className="h-5 w-5" aria-hidden="true" />
              </span>
              <h2 className="text-base font-semibold text-ink-900">How it works</h2>
            </div>
            <p className="text-sm leading-relaxed text-ink-700 mb-4">
              Parents browse places near La Jolla on the map, read sensory reviews written by other families, and filter by noise level, crowd density, staff responsiveness, and more. When they visit, they can add their own review to help the next family plan.
            </p>
            <p className="text-sm leading-relaxed text-ink-700">
              Every review focuses on practical, actionable detail: what time of day was calmer, what sensory triggers were present, and what small accommodations made the difference.
            </p>
          </div>
        </div>

        {/* ── Our approach ── */}
        <div className="mt-14">
          <div className="text-xs font-semibold uppercase tracking-wider text-brand-700">Our approach</div>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-ink-900 sm:text-3xl">
            Community knowledge, not corporate ratings.
          </h2>
          <p className="mt-3 max-w-2xl text-ink-700 leading-relaxed">
            NeuroMap treats caregivers as the experts in their own experience. We don't certify places or assign official status. We give families the tools to share what they observed, so the next family can prepare, not guess.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              {
                title: 'Specific over vague',
                body: 'Nine sensory dimensions instead of one label. Because "autism-friendly" means different things to different families.',
              },
              {
                title: 'Honest over optimistic',
                body: 'We ask parents to describe what was hard, not just what went well. That\'s where the planning value is.',
              },
              {
                title: 'Practical over promotional',
                body: 'Best times to visit. Common triggers. What helped. No marketing copy, no vague assurances.',
              },
            ].map(({ title, body }) => (
              <div key={title} className="rounded-2xl border border-ink-100/60 bg-sand-100 p-6">
                <div className="text-sm font-semibold text-ink-900">{title}</div>
                <p className="mt-2 text-sm leading-relaxed text-ink-600">{body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Team ── */}
        <div className="mt-14">
          <div className="text-xs font-semibold uppercase tracking-wider text-brand-700">The team</div>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-ink-900 sm:text-3xl">
            Built by students who care.
          </h2>
          <p className="mt-3 max-w-xl text-ink-700 leading-relaxed">
            We're a small group with a focused goal: reduce uncertainty so families can participate more fully in community life.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {TEAM.map(({ name, role }) => (
              <Card key={name} className="flex items-center gap-4 p-5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-sand-50 select-none">
                  {getInitials(name)}
                </div>
                <div>
                  <div className="text-sm font-semibold text-ink-900">{name}</div>
                  <div className="text-xs text-ink-500">{role} · The Bishop's School</div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* ── CTA ── */}
        <div className="mt-14 rounded-2xl border border-ink-100/60 bg-sand-50 p-8 shadow-card">
          <h2 className="text-xl font-semibold text-ink-900 sm:text-2xl">
            Ready to explore or contribute?
          </h2>
          <p className="mt-2 text-ink-600 leading-relaxed">
            Browse places near La Jolla or share your own experience to help other families plan.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <ButtonLink to="/map" variant="primary" size="lg">
              <MapPin className="h-5 w-5" aria-hidden="true" />
              Explore the Map
            </ButtonLink>
            <ButtonLink to="/add-review" variant="secondary" size="lg">
              <MessageSquarePlus className="h-5 w-5" aria-hidden="true" />
              Add a Review
            </ButtonLink>
            <ButtonLink to="/" variant="ghost" size="lg">
              Back to Home
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </ButtonLink>
          </div>
        </div>
      </Container>
    </div>
  )
}
