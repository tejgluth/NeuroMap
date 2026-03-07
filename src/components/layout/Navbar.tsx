import { Menu, X } from 'lucide-react'
import { useId, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'

import { cn } from '../../lib/cn'
import Container from '../ui/Container'

function NavItem({
  to,
  label,
  onNavigate,
}: {
  to: string
  label: string
  onNavigate?: () => void
}) {
  return (
    <NavLink
      to={to}
      onClick={onNavigate}
      className={({ isActive }) =>
        cn(
          'rounded-xl px-3 py-2 text-sm font-semibold text-ink-800 no-underline transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 motion-reduce:transition-none',
          isActive
            ? 'bg-sand-50 text-ink-900 shadow-soft'
            : 'hover:bg-sand-50 hover:text-ink-900',
        )
      }
    >
      {label}
    </NavLink>
  )
}

function MobileNav() {
  const [open, setOpen] = useState(false)
  const mobileNavId = useId()

  return (
    <>
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-xl bg-sand-50 p-2 text-ink-900 ring-1 ring-inset ring-ink-100/60 transition-colors hover:bg-sand-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 motion-reduce:transition-none md:hidden"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls={mobileNavId}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
        </button>

      <div
        id={mobileNavId}
        className={cn(
          'border-t border-ink-100/60 bg-sand-100 md:hidden',
          open ? 'block' : 'hidden',
        )}
      >
        <Container className="py-3">
          <div className="flex flex-col gap-1">
            <NavItem to="/" label="Home" onNavigate={() => setOpen(false)} />
            <NavItem to="/map" label="Explore Map" onNavigate={() => setOpen(false)} />
            <NavItem to="/add-review" label="Add Review" onNavigate={() => setOpen(false)} />
            <NavItem to="/about" label="About" onNavigate={() => setOpen(false)} />
          </div>
        </Container>
      </div>
    </>
  )
}

export default function Navbar() {
  const location = useLocation()

  return (
    <header className="sticky top-0 z-40 border-b border-ink-100/60 bg-sand-100/85 backdrop-blur">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link
          to="/"
          className="flex items-center gap-3 no-underline focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          aria-label="NeuroMap — Home"
        >
          <img
            src="/logo.png"
            alt=""
            className="h-9 w-9 rounded-xl bg-sand-50 p-1 shadow-soft"
            width={36}
            height={36}
            loading="eager"
          />
          <div className="leading-tight">
            <div className="text-sm font-semibold text-ink-900">NeuroMap</div>
            <div className="text-xs text-ink-700">Sensory-friendly planning</div>
          </div>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
          <NavItem to="/" label="Home" />
          <NavItem to="/map" label="Explore Map" />
          <NavItem to="/add-review" label="Add Review" />
          <NavItem to="/about" label="About" />
        </nav>

        <MobileNav key={location.pathname} />
      </Container>
    </header>
  )
}
