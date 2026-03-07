import { Link } from 'react-router-dom'

import Container from '../components/ui/Container'

export default function NotFoundPage() {
  return (
    <div className="py-16">
      <Container>
        <div className="rounded-2xl border border-ink-100/60 bg-sand-50 p-8 shadow-card">
          <h1 className="text-2xl font-semibold text-ink-900">Page not found</h1>
          <p className="mt-2 text-ink-700">That page doesn’t exist.</p>
          <div className="mt-6">
            <Link
              to="/"
              className="rounded-xl bg-ink-900 px-4 py-2 text-sm font-semibold text-sand-50 no-underline shadow-soft transition-colors hover:bg-ink-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 motion-reduce:transition-none"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </Container>
    </div>
  )
}
