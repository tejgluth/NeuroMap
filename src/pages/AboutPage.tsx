import { GraduationCap, HeartHandshake, Users } from 'lucide-react'

import Container from '../components/ui/Container'
import SectionHeading from '../components/ui/SectionHeading'
import Card from '../components/ui/Card'
import { ButtonLink } from '../components/ui/Button'

const TEAM = ['Nolan Ameriks', 'Nathan Hong', 'Kent Isakari', 'Amaan Khan', 'Theron Schutz']

export default function AboutPage() {
  return (
    <div className="py-12 sm:py-14">
      <Container>
        <SectionHeading
          eyebrow="Social Innovation · The Bishop’s School"
          title="We built NeuroMap to help families plan outings with confidence."
          description="We’re a student team who kept hearing the same need from parents of autistic children: specific, trustworthy information about sensory environments — not vague labels."
        />

        <div className="mt-8 grid gap-4 lg:grid-cols-12 lg:items-start">
          <Card className="p-6 lg:col-span-7">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-100 text-brand-800">
                <HeartHandshake className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <h2 className="text-lg font-semibold text-ink-900">Why we started</h2>
                <p className="mt-2 text-sm leading-relaxed text-ink-800">
                  Our team grew up alongside cousins with autism. Through personal experience, parent interviews, and
                  community conversations, we kept hearing the same thing: families need honest, specific sensory
                  information — not a star rating, not a vague label. NeuroMap is our attempt to make that information
                  easier to find and easier to use when it matters most.
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 lg:col-span-5">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-100 text-brand-800">
                <GraduationCap className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <h2 className="text-lg font-semibold text-ink-900">How it works</h2>
                <p className="mt-2 text-sm leading-relaxed text-ink-800">
                  Right now NeuroMap is a demo — no accounts or backend. Reviews you add are saved on this device so
                  you can try the full flow and see your contribution appear immediately.
                </p>
              </div>
            </div>
          </Card>
        </div>

        <div className="mt-10">
          <SectionHeading
            eyebrow="Team"
            title="The people behind NeuroMap"
            description="A small group with a big goal: reduce uncertainty so families can participate more fully in community life."
          />

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {TEAM.map((name) => (
              <Card key={name} className="p-6">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-sand-100 text-ink-800 ring-1 ring-inset ring-ink-100/60">
                    <Users className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <div className="text-sm font-semibold text-ink-900">{name}</div>
                    <div className="text-xs text-ink-700">Social Innovation • The Bishop’s School</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <Card className="mt-10 p-8">
          <h2 className="text-lg font-semibold text-ink-900">A note on language and respect</h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-800">
            We try to be respectful in how we talk about autism and sensory differences, and we welcome feedback from
            families and the community.
          </p>
        </Card>

        <div className="mt-10 flex flex-wrap gap-3">
          <ButtonLink to="/map" variant="primary" size="lg">
            Explore Map
          </ButtonLink>
          <ButtonLink to="/add-review" variant="secondary" size="lg">
            Add a Review
          </ButtonLink>
        </div>
      </Container>
    </div>
  )
}
