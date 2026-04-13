import { MapPin } from 'lucide-react'

import Container from '../components/ui/Container'
import { ButtonLink } from '../components/ui/Button'

export default function NotFoundPage() {
  return (
    <div className="py-24">
      <Container>
        <div className="mx-auto max-w-md text-center">
          <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-100 text-brand-700">
            <MapPin className="h-7 w-7" aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-ink-900">Page not found</h1>
          <p className="mt-2 text-ink-600">
            We couldn't find that page. Try exploring the map or heading home.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <ButtonLink to="/" variant="primary">
              Back to Home
            </ButtonLink>
            <ButtonLink to="/map" variant="ghost">
              Explore Map
            </ButtonLink>
          </div>
        </div>
      </Container>
    </div>
  )
}
