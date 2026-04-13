import { Link } from 'react-router-dom'

import Container from '../ui/Container'

export default function Footer() {
  return (
    <footer className="border-t border-ink-100/60 bg-sand-50">
      <Container className="py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="h-14 w-28 overflow-hidden rounded-lg bg-sand-50">
              <img
                src="/logo.png"
                alt="NeuroMap"
                className="-translate-y-7 h-28 w-28"
                width={112}
                height={112}
              />
            </div>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-ink-600">
              A parent-powered platform for sensory-aware place reviews. Ratings reflect real family visits and may vary by time of day or staffing.
            </p>
            <p className="mt-2 text-xs leading-relaxed text-ink-500">
              Not medical advice. Use your own judgment.
            </p>
          </div>

          {/* Explore */}
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-ink-500 mb-3">
              Explore
            </div>
            <ul className="space-y-2">
              {[
                { to: '/map', label: 'Find Places' },
                { to: '/add-review', label: 'Add a Review' },
                { to: '/about', label: 'About NeuroMap' },
                { to: '/contact', label: 'Contact Us' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-sm text-ink-600 no-underline hover:text-ink-900 transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-ink-500 mb-3">
              Account
            </div>
            <ul className="space-y-2">
              {[
                { to: '/sign-in', label: 'Sign In' },
                { to: '/sign-up', label: 'Create Account' },
                { to: '/account', label: 'My Account' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-sm text-ink-600 no-underline hover:text-ink-900 transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-ink-100/60 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-ink-500">
            © {new Date().getFullYear()} NeuroMap · A Social Innovation project · The Bishop's School
          </p>
          <div className="flex items-center gap-4">
            <Link to="/terms" className="text-xs text-ink-400 hover:text-ink-700 transition-colors">
              Terms
            </Link>
            <Link to="/privacy" className="text-xs text-ink-400 hover:text-ink-700 transition-colors">
              Privacy
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  )
}
