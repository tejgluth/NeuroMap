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
            title="“Autism-friendly” labels are often vague."
            description="Families are left guessing: Is it loud? Crowded? Will staff be patient? Will there be a quiet place to reset? A single label can’t answer the questions that matter most."
          />

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <StatCard
              value="70%"
              label="Parents feel unwelcome in public"
              supporting="Many families avoid outings because they’ve been stared at, judged, or treated as a disruption."
            />
            <StatCard
              value="21%"
              label="Have been asked to leave"
              supporting="Even when families plan carefully, environments and reactions can turn an outing into an emergency exit."
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
            eyebrow="The solution"
            title="Parent-powered sensory reviews, built for planning."
            description="NeuroMap focuses on the details caregivers use to decide: sensory load, predictability, transitions, and what helps."
          />

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {RATING_DIMENSIONS.map((dim) => (
              <Card key={dim.key} className="p-6">
                <div className="text-sm font-semibold text-ink-900">{dim.label}</div>
                <p className="mt-2 text-sm leading-relaxed text-ink-800">{dim.description}</p>
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
            description="The goal isn’t perfection — it’s predictability. Small details reduce planning stress and prevent surprises."
          />

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <Card className="p-6">
              <div className="flex items-center gap-2 text-sm font-semibold text-ink-900">
                <Search className="h-4 w-4 text-brand-700" aria-hidden="true" />
                1) Search the map
              </div>
              <p className="mt-2 text-sm leading-relaxed text-ink-800">
                Find places near you and filter by category or overall autism-friendliness.
              </p>
            </Card>
            <Card className="p-6">
              <div className="flex items-center gap-2 text-sm font-semibold text-ink-900">
                <HeartHandshake className="h-4 w-4 text-brand-700" aria-hidden="true" />
                2) See real parent reviews
              </div>
              <p className="mt-2 text-sm leading-relaxed text-ink-800">
                Read specific sensory notes: noise spikes, lighting, crowds, transitions, and what helped.
              </p>
            </Card>
            <Card className="p-6">
              <div className="flex items-center gap-2 text-sm font-semibold text-ink-900">
                <CheckCircle2 className="h-4 w-4 text-brand-700" aria-hidden="true" />
                3) Plan with confidence
              </div>
              <p className="mt-2 text-sm leading-relaxed text-ink-800">
                Choose the best time to visit and bring the right supports — before you’re already overwhelmed.
              </p>
            </Card>
          </div>
        </Container>
      </section>

      <section className="py-10">
        <Container>
          <SectionHeading
            eyebrow="Why it matters"
            title="Real scenarios, real stakes"
            description="These are the moments families described: an outing is going fine… until one sensory detail flips the experience."
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
            eyebrow="Demand"
            title="Families are asking for something more specific."
            description="Caregivers don’t need a perfect rating. They need honest, practical information — and a community that understands why details matter."
          />

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <Card className="p-6">
              <div className="text-sm font-semibold text-ink-900">What we heard again and again</div>
              <ul className="mt-3 space-y-2 text-sm leading-relaxed text-ink-800">
                <li className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-brand-700" />
                  “I need to know what the wait feels like.”
                </li>
                <li className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-brand-700" />
                  “We can handle noise — but not surprise noise.”
                </li>
                <li className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-brand-700" />
                  “If I can plan an exit, we can try.”
                </li>
              </ul>
            </Card>
            <Card className="p-6">
              <div className="text-sm font-semibold text-ink-900">A community-powered approach</div>
              <p className="mt-2 text-sm leading-relaxed text-ink-800">
                NeuroMap treats families as experts in their own experiences. Reviews focus on sensory reality and
                practical accommodations — not marketing.
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

      <section className="py-10">
        <Container>
          <SectionHeading
            eyebrow="Impact"
            title="More participation, less stress"
            description="NeuroMap helps families plan around sensory needs — so outings are more likely to end with pride, not recovery."
          />

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <Card className="p-6">
              <ul className="space-y-3 text-sm leading-relaxed text-ink-800">
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
                  Save time by avoiding “trial-and-error” outings that drain everyone’s energy.
                </li>
              </ul>
            </Card>
            <Card className="p-6">
              <ul className="space-y-3 text-sm leading-relaxed text-ink-800">
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
          </div>
        </Container>
      </section>

      <section className="py-10">
        <Container>
          <SectionHeading eyebrow="Mission" title="Built with dignity, clarity, and care" />

          <Card className="mt-8 p-8">
            <p className="text-pretty text-base leading-relaxed text-ink-800 sm:text-lg">
              NeuroMap’s mission is to help families of autistic and sensory-sensitive children participate fully in
              their communities by sharing practical, parent-informed insights about sensory environments — so every
              outing can start with clarity and dignity.
            </p>
          </Card>
        </Container>
      </section>

      <section className="py-10">
        <Container>
          <Card className="p-8 sm:p-10">
            <div className="grid gap-6 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-8">
                <h2 className="text-balance text-2xl font-semibold tracking-tight text-ink-900 sm:text-3xl">
                  Adventure Without Uncertainty
                </h2>
                <p className="mt-3 text-pretty text-base leading-relaxed text-ink-800">
                  Explore the map, read parent reviews, and add your own experience to help the next family plan.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 lg:col-span-4 lg:justify-end">
                <ButtonLink to="/map" variant="primary" size="lg">
                  Explore Map
                </ButtonLink>
                <ButtonLink to="/about" variant="ghost" size="lg">
                  Learn About Us
                </ButtonLink>
                <ButtonLink to="/add-review" variant="secondary" size="lg">
                  Add a Review
                </ButtonLink>
              </div>
            </div>
          </Card>
        </Container>
      </section>
    </div>
  )
}
