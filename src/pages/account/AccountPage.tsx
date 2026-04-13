import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MapPin, Star, Heart, User } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useFavorites, useMyFavoritePlaces, useMyReviews } from '../../hooks/useFavorites'
import { useDeleteReview } from '../../hooks/useReviews'
import { Button } from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Container from '../../components/ui/Container'
import Spinner from '../../components/ui/Spinner'
import { cn } from '../../lib/cn'

type Tab = 'profile' | 'reviews' | 'favorites'

const inputClass =
  'w-full rounded-xl border border-ink-100/60 bg-white px-4 py-2.5 text-sm text-ink-900 placeholder-ink-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30 transition-colors disabled:bg-sand-100 disabled:text-ink-500'

function SkeletonList() {
  return (
    <div className="flex flex-col gap-3">
      {[0, 1, 2].map((i) => (
        <div key={i} className="animate-pulse rounded-2xl bg-sand-100 h-16" />
      ))}
    </div>
  )
}

function ProfileTab() {
  const { user, profile, updateProfile } = useAuth()
  // Initialized from profile; component is remounted via key when profile.display_name changes
  const [displayName, setDisplayName] = useState(profile?.display_name ?? '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!displayName.trim()) { setError('Display name cannot be empty.'); return }
    setError(null)
    setSaving(true)
    const { error } = await updateProfile(displayName)
    setSaving(false)
    if (error) {
      setError(error)
    } else {
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }
  }

  return (
    <Card className="p-6 md:p-8">
      <h2 className="text-base font-semibold text-ink-900 mb-6">Profile settings</h2>

      {error && (
        <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</div>
      )}
      {saved && (
        <div className="mb-5 rounded-2xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">Profile updated.</div>
      )}

      <form onSubmit={handleSave} className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email-ro" className="text-sm font-semibold text-ink-800">Email</label>
          <input id="email-ro" type="email" value={user?.email ?? ''} readOnly disabled className={inputClass} />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="display-name" className="text-sm font-semibold text-ink-800">Display name</label>
          <input
            id="display-name"
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            maxLength={80}
            placeholder="Your name or nickname"
            className={inputClass}
          />
          <p className="text-xs text-ink-500">This appears on reviews you write.</p>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-ink-800">Member since</label>
          <p className="text-sm text-ink-600">
            {profile?.created_at
              ? new Date(profile.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
              : '—'}
          </p>
        </div>

        <Button type="submit" variant="secondary" size="md" disabled={saving} className="self-start">
          {saving ? 'Saving…' : 'Save changes'}
        </Button>
      </form>
    </Card>
  )
}

function ReviewsTab() {
  const { reviews, loading, refetch } = useMyReviews()
  const { deleteReview } = useDeleteReview()
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [confirmId, setConfirmId] = useState<string | null>(null)

  async function handleDelete(id: string) {
    setDeletingId(id)
    await deleteReview(id)
    setDeletingId(null)
    setConfirmId(null)
    refetch()
  }

  if (loading) return <SkeletonList />

  if (reviews.length === 0) {
    return (
      <div className="rounded-2xl border border-ink-100/60 bg-sand-50 p-10 text-center">
        <Star className="mx-auto mb-3 h-8 w-8 text-ink-300" />
        <p className="text-sm font-semibold text-ink-800">No reviews yet</p>
        <p className="mt-1 text-sm text-ink-500">Visit a place and share what you noticed.</p>
        <Link
          to="/map"
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:text-brand-800 underline underline-offset-2"
        >
          Browse places
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {reviews.map((r) => (
        <Card key={r.id} className="p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <Link
                to={`/places/${r.place_slug}`}
                className="text-sm font-semibold text-brand-700 hover:text-brand-800 underline underline-offset-2 truncate block"
              >
                {r.place_name}
              </Link>
              {r.rating_overall != null && (
                <p className="text-xs text-ink-500 mt-0.5">Overall: {r.rating_overall}/5</p>
              )}
              <p className="mt-1.5 text-sm text-ink-700 line-clamp-2">{r.review_text}</p>
              <p className="mt-1 text-xs text-ink-400">
                {new Date(r.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
              </p>
            </div>

            <div className="shrink-0">
              {confirmId === r.id ? (
                <div className="flex gap-2 items-center">
                  <button
                    type="button"
                    onClick={() => handleDelete(r.id)}
                    disabled={deletingId === r.id}
                    className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-50 transition-colors"
                  >
                    {deletingId === r.id ? 'Deleting…' : 'Delete'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmId(null)}
                    className="rounded-lg bg-sand-100 px-3 py-1.5 text-xs font-semibold text-ink-800 hover:bg-sand-200 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmId(r.id)}
                  className="rounded-lg p-1.5 text-ink-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                  aria-label="Delete review"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                </button>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}

function FavoritesTab() {
  const { places, loading } = useMyFavoritePlaces()
  const { toggle, toggling } = useFavorites()

  if (loading) return <SkeletonList />

  if (places.length === 0) {
    return (
      <div className="rounded-2xl border border-ink-100/60 bg-sand-50 p-10 text-center">
        <Heart className="mx-auto mb-3 h-8 w-8 text-ink-300" />
        <p className="text-sm font-semibold text-ink-800">No saved places yet</p>
        <p className="mt-1 text-sm text-ink-500">Tap the heart on any place to save it here.</p>
        <Link
          to="/map"
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:text-brand-800 underline underline-offset-2"
        >
          Browse places
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {places.map((p) => (
        <Card key={p.place_id} className="p-4">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <Link
                to={`/places/${p.slug}`}
                className="text-sm font-semibold text-brand-700 hover:text-brand-800 underline underline-offset-2 truncate block"
              >
                {p.name}
              </Link>
              <p className="mt-0.5 text-xs text-ink-500 flex items-center gap-1">
                <MapPin className="h-3 w-3 shrink-0" aria-hidden="true" />
                {p.address}
              </p>
            </div>
            <button
              type="button"
              onClick={() => toggle(p.place_id)}
              disabled={toggling === p.place_id}
              className="shrink-0 rounded-lg p-1.5 text-brand-600 hover:text-brand-800 hover:bg-brand-50 disabled:opacity-50 transition-colors"
              aria-label="Remove from favorites"
            >
              <Heart className="h-4 w-4 fill-brand-600" aria-hidden="true" />
            </button>
          </div>
        </Card>
      ))}
    </div>
  )
}

export default function AccountPage() {
  const { user, profile, loading: authLoading, signOut } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState<Tab>('profile')
  const [signingOut, setSigningOut] = useState(false)

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/sign-in', { replace: true })
    }
  }, [authLoading, user, navigate])

  if (authLoading || !user) {
    return (
      <Container className="py-16 flex justify-center">
        <Spinner />
      </Container>
    )
  }

  const initials = (profile?.display_name ?? user.email ?? 'U')
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  const tabs: { id: Tab; label: string; Icon: typeof User }[] = [
    { id: 'profile', label: 'Profile', Icon: User },
    { id: 'reviews', label: 'My reviews', Icon: Star },
    { id: 'favorites', label: 'Saved places', Icon: Heart },
  ]

  async function handleSignOut() {
    setSigningOut(true)
    await signOut()
    navigate('/', { replace: true })
  }

  return (
    <Container className="py-10 md:py-16">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-600 text-sand-50 text-base font-bold select-none">
              {initials}
            </div>
            <div>
              <p className="font-semibold text-ink-900">{profile?.display_name ?? user.email}</p>
              <p className="text-sm text-ink-500">{user.email}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            disabled={signingOut}
          >
            {signingOut ? 'Signing out…' : 'Sign out'}
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 rounded-2xl bg-sand-100 p-1">
          {tabs.map(({ id, label, Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={cn(
                'flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
                tab === id
                  ? 'bg-sand-50 text-ink-900 shadow-soft'
                  : 'text-ink-600 hover:text-ink-900 hover:bg-sand-50/60',
              )}
            >
              <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>

        {/* Tab content */}
        {tab === 'profile' && <ProfileTab key={profile?.display_name} />}
        {tab === 'reviews' && <ReviewsTab />}
        {tab === 'favorites' && <FavoritesTab />}
      </div>
    </Container>
  )
}
