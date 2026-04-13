import { ChevronDown, Menu, X } from 'lucide-react'
import { useEffect, useId, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'

import { useAuth } from '../../contexts/AuthContext'
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
          'rounded-lg px-3 py-1.5 text-sm font-medium no-underline transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 motion-reduce:transition-none',
          isActive
            ? 'bg-sand-200/70 text-ink-900'
            : 'text-ink-700 hover:bg-sand-200/50 hover:text-ink-900',
        )
      }
    >
      {label}
    </NavLink>
  )
}

function getInitials(displayName: string | null | undefined, email: string | null | undefined) {
  const name = displayName ?? email ?? 'U'
  return name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

function UserMenu() {
  const { user, profile, signOut, loading } = useAuth()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    function keyHandler(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    document.addEventListener('keydown', keyHandler)
    return () => {
      document.removeEventListener('mousedown', handler)
      document.removeEventListener('keydown', keyHandler)
    }
  }, [open])

  if (loading) {
    return <div className="h-8 w-8 animate-pulse rounded-full bg-sand-200" aria-hidden="true" />
  }

  if (!user) {
    return (
      <NavLink
        to="/sign-in"
        className={({ isActive }) =>
          cn(
            'rounded-lg px-3 py-1.5 text-sm font-medium no-underline ring-1 ring-inset ring-ink-100/80 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
            isActive ? 'bg-sand-100 text-ink-900' : 'bg-sand-50 text-ink-800 hover:bg-sand-100',
          )
        }
      >
        Sign in
      </NavLink>
    )
  }

  const initials = getInitials(profile?.display_name, user.email)

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1.5 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
        aria-label="Account menu"
        aria-expanded={open}
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-sand-50 select-none">
          {initials}
        </span>
        <ChevronDown
          className={cn('h-3.5 w-3.5 text-ink-500 transition-transform', open && 'rotate-180')}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-52 rounded-2xl border border-ink-100/60 bg-sand-50 shadow-card z-50 overflow-hidden">
          <div className="px-4 py-3 border-b border-ink-100/60">
            <p className="text-xs font-semibold text-ink-900 truncate">{profile?.display_name ?? 'My Account'}</p>
            <p className="text-xs text-ink-500 truncate">{user.email}</p>
          </div>
          <div className="py-1">
            <Link
              to="/account"
              onClick={() => setOpen(false)}
              className="block px-4 py-2 text-sm text-ink-700 hover:bg-sand-100 hover:text-ink-900 transition-colors no-underline"
            >
              My account
            </Link>
          </div>
          <div className="border-t border-ink-100/60 py-1">
            <button
              type="button"
              onClick={async () => {
                setOpen(false)
                await signOut()
              }}
              className="block w-full text-left px-4 py-2 text-sm text-ink-700 hover:bg-sand-100 hover:text-ink-900 transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function MobileNav({
  user,
  signOut,
}: {
  user: ReturnType<typeof useAuth>['user']
  signOut: () => Promise<void>
}) {
  const [open, setOpen] = useState(false)
  const mobileNavId = useId()
  const close = () => setOpen(false)

  return (
    <>
      <button
        type="button"
        className="inline-flex items-center justify-center rounded-lg p-2 text-ink-700 transition-colors hover:bg-sand-200/60 hover:text-ink-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 motion-reduce:transition-none md:hidden"
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
          <div className="flex flex-col gap-0.5">
            <NavItem to="/" label="Home" onNavigate={close} />
            <NavItem to="/map" label="Explore Map" onNavigate={close} />
            <NavItem to="/add-review" label="Add a Review" onNavigate={close} />
            <NavItem to="/about" label="About" onNavigate={close} />
            <hr className="my-2 border-ink-100/60" />
            {user ? (
              <>
                <NavItem to="/account" label="My Account" onNavigate={close} />
                <button
                  type="button"
                  onClick={async () => {
                    close()
                    await signOut()
                  }}
                  className="rounded-lg px-3 py-1.5 text-left text-sm font-medium text-ink-700 hover:bg-sand-200/50 hover:text-ink-900 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                >
                  Sign out
                </button>
              </>
            ) : (
              <NavItem to="/sign-in" label="Sign in" onNavigate={close} />
            )}
          </div>
        </Container>
      </div>
    </>
  )
}

export default function Navbar() {
  const location = useLocation()
  const { user, signOut } = useAuth()

  return (
    <header className="sticky top-0 z-40 border-b border-ink-100/60 bg-sand-100/90 backdrop-blur-md">
      <Container className="flex h-14 items-center justify-between gap-4 py-0">
        <Link
          to="/"
          className="flex items-center no-underline focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded-lg"
          aria-label="NeuroMap — Home"
        >
          <div className="h-12 w-24 overflow-hidden rounded-lg">
            <img
              src="/logo.png"
              alt="NeuroMap"
              className="-translate-y-6 h-24 w-24"
              width={96}
              height={96}
              loading="eager"
            />
          </div>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-0.5 md:flex">
          <NavItem to="/" label="Home" />
          <NavItem to="/map" label="Explore Map" />
          <NavItem to="/add-review" label="Add a Review" />
          <NavItem to="/about" label="About" />
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <UserMenu />
        </div>

        <MobileNav key={location.pathname} user={user} signOut={signOut} />
      </Container>
    </header>
  )
}
