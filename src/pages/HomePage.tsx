import { ArrowRight, CheckCircle2, HeartHandshake, Search } from 'lucide-react'

import HeroSection from '../components/home/HeroSection'
import StatCard from '../components/home/StatCard'
import StoryCard from '../components/home/StoryCard'
import Container from '../components/ui/Container'
import SectionHeading from '../components/ui/SectionHeading'
import { ButtonLink } from '../components/ui/Button'
import Card from '../components/ui/Card'
import { RATING_DIMENSIONS } from '../data/ratings'
import { STORY_CARDS } from '../data/stories'

export default function HomePage() {
  return (
    <div className="pb-14">
      <HeroSection />

      <section className="py-10">
        <Container>
          <SectionHeading
            eyebrow="The problem"
            title={'\u201cAutism-friendly\u201d labels are often vague.'}
            description="Families are left guessing: Is it loud? Crowded? Will staff be patient? Will there be a quiet place to reset? A single label can't answer the questions that matter most."
          />

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <StatCard
              value="70%"
              label="Parents feel unwelcome in public"
              supporting="Many families avoid outings entirely because they've faced judgment or felt unwanted."
            />
            <StatCard
              value="21%"
              label="Have been asked to leave"
              supporting="Even careful planning isn't enough when the environment itself isn't prepared."
            />
            <StatCard
              value="1 in 31"
              label="Children in the U.S. are autistic"
              supporting="This is not a niche problem. Communities need practical, specific accessibility information."
            />
          </div>
        </Container>
      </section>

      <section className="py-10">
        <Container>
          <SectionHeading
            eyebrow="The approach"
            title="Nine dimensions parents actually use."
            description="NeuroMap focuses on the details caregivers use to decide: sensory load, predictability, transitions, and what helps."
          />

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {RATING_DIMENSIONS.map((dim) => (
              <Card key={dim.key} className="p-6">
                <div className="mb-3 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-brand-600" aria-hidden="true" />
                  <div className="text-sm font-semibold text-ink-900">{dim.label}</div>
                </div>
                <p className="text-sm leading-relaxed text-ink-800">{dim.description}</p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-10">
        <Container>
          <SectionHeading
            eyebrow="How it works"
            title="A simple flow for calmer outings"
            description="The goal isn't perfection — it's predictability. Small details reduce planning stress and prevent surprises."
          />

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <Card className="p-6">
              <div className="flex items-center gap-2 text-sm font-semibold text-ink-900">
                <Search className="h-4 w-4 text-brand-700" aria-hidden="true" />
                Search
              </div>
              <p className="mt-2 text-sm leading-relaxed text-ink-800">
                Find places near you and filter by category or overall autism-friendliness.
              </p>
            </Card>
            <Card className="p-6">
              <div className="flex items-center gap-2 text-sm font-semibold text-ink-900">
                <HeartHandshake className="h-4 w-4 text-brand-700" aria-hidden="true" />
                Read reviews
              </div>
              <p className="mt-2 text-sm leading-relaxed text-ink-800">
                Read specific sensory notes: noise spikes, lighting, crowds, transitions, and what helped.
              </p>
            </Card>
            <Card className="p-6">
              <div className="flex items-center gap-2 text-sm font-semibold text-ink-900">
                <CheckCircle2 className="h-4 w-4 text-brand-700" aria-hidden="true" />
                Plan with confidence
              </div>
              <p className="mt-2 text-sm leading-relaxed text-ink-800">
                Choose the best time to visit and bring the right supports — before you're already overwhelmed.
              </p>
            </Card>
          </div>
        </Container>
      </section>

      <section className="py-10">
        <Container>
          <SectionHeading
            eyebrow="Real moments"
            title="Small details decide the outing."
            description="These are the moments families described: an outing is going fine — until one sensory detail changes everything."
          />

          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            {STORY_CARDS.map((story) => (
              <StoryCard
                key={story.id}
                title={story.title}
                scenario={story.scenario}
                whyItMatters={story.whyItMatters}
              />
            ))}
          </div>
        </Container>
      </section>

      <section className="py-10">
        <Container>
          <SectionHeading
            eyebrow="What we heard"
            title="Families need specifics, not scores."
            description="Caregivers don't need a perfect rating. They need honest, practical information — and a community that understands why details matter."
          />

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <Card className="p-6">
              <div className="text-sm font-semibold text-ink-900">What we heard again and again</div>
              <ul className="mt-3 space-y-2 text-sm leading-relaxed text-ink-800">
                <li className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-brand-700" />
                  "I need to know what the wait feels like."
                </li>
                <li className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-brand-700" />
                  "We can handle noise — but not surprise noise."
                </li>
                <li className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-brand-700" />
                  "If I can plan an exit, we can try."
                </li>
              </ul>
            </Card>
            <Card className="p-6">
              <div className="text-sm font-semibold text-ink-900">A community-powered approach</div>
              <p className="mt-2 text-sm leading-relaxed text-ink-800">
                NeuroMap treats you as the expert in your own experience. Reviews focus on sensory reality and
                practical accommodations, not marketing.
              </p>
              <div className="mt-4">
                <ButtonLink to="/map" variant="ghost">
                  Explore the map
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </ButtonLink>
              </div>
            </Card>
          </div>
        </Container>
      </section>

      <section className="py-14">
        <Container>
          <SectionHeading
            eyebrow="The difference it makes"
            title="More participation, less stress"
            description="NeuroMap helps families plan around sensory needs — so outings are more likely to end with pride, not recovery."
          />

          <Card className="mt-8 p-6">
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 text-sm leading-relaxed text-ink-800">
              <li className="flex gap-3">
                <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-800">
                  1
                </span>
                Avoid meltdowns by anticipating triggers and choosing calmer timing.
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-800">
                  2
                </span>
                Reduce planning stress with clear expectations and practical tips.
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-800">
                  3
                </span>
                Save time by avoiding trial-and-error outings that drain everyone's energy.
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-800">
                  4
                </span>
                Participate more fully in community life — parks, restaurants, errands, and events.
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-800">
                  5
                </span>
                Feel welcomed through transparency and shared understanding.
              </li>
            </ul>
          </Card>
        </Container>
      </section>

      <section className="py-10">
        <Container>
          <Card className="p-8 sm:p-10">
            <div className="grid gap-6 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-8">
                <h2 className="text-balance text-2xl font-semibold tracking-tight text-ink-900 sm:text-3xl">
                  Ready to plan your next outing?
                </h2>
                <p className="mt-3 text-pretty text-base leading-relaxed text-ink-800">
                  Explore the map, read parent reviews, and add your own experience to help the next family plan.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 lg:col-span-4 lg:justify-end">
                <ButtonLink to="/map" variant="primary" size="lg">
                  Explore Map
                </ButtonLink>
                <ButtonLink to="/add-review" variant="secondary" size="lg">
                  Add a Review
                </ButtonLink>
                <ButtonLink to="/about" variant="ghost" size="lg">
                  Learn About Us
                </ButtonLink>
              </div>
            </div>
          </Card>
        </Container>
      </section>
    </div>
  )
}
