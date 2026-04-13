import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { Button } from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Container from '../../components/ui/Container'

const inputClass =
  'w-full rounded-xl border border-ink-100/60 bg-white px-4 py-2.5 text-sm text-ink-900 placeholder-ink-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30 transition-colors'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function SignUpPage() {
  const { user, loading: authLoading, signUp } = useAuth()
  const navigate = useNavigate()

  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (!authLoading && user) {
      navigate('/account', { replace: true })
    }
  }, [authLoading, user, navigate])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!EMAIL_RE.test(email.trim())) {
      setError('Please enter a valid email address.')
      return
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    const { error } = await signUp(email.trim(), password, displayName.trim())
    setLoading(false)

    if (error) {
      setError(error)
    } else {
      setSuccess(true)
    }
  }

  if (success) {
    return (
      <Container className="py-16 flex justify-center">
        <div className="w-full max-w-md text-center">
          <Card className="p-8">
            <div className="mb-4 text-3xl">✉️</div>
            <h1 className="text-xl font-bold text-ink-900 mb-2">Check your email</h1>
            <p className="text-sm text-ink-600 mb-6">
              We've sent a confirmation link to <strong className="text-ink-900">{email}</strong>.
              Open it to activate your account, then sign in.
            </p>
            <Link
              to="/sign-in"
              className="inline-flex items-center justify-center rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-sand-50 shadow-sm ring-1 ring-inset ring-brand-600/10 hover:bg-brand-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            >
              Go to sign in
            </Link>
          </Card>
          <p className="mt-4 text-xs text-ink-500">
            For staging: if you don't receive an email, ask your admin to disable "Confirm email" in Supabase Auth settings.
          </p>
        </div>
      </Container>
    )
  }

  return (
    <Container className="py-16 flex justify-center">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-ink-900 tracking-tight">Create an account</h1>
          <p className="mt-2 text-sm text-ink-600">Join NeuroMap to save places and share your family's experience.</p>
        </div>

        <Card className="p-8">
          {error && (
            <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="display-name" className="text-sm font-semibold text-ink-800">
                Display name <span className="font-normal text-ink-500">(optional)</span>
              </label>
              <input
                id="display-name"
                type="text"
                autoComplete="name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="e.g. Maya's Mom"
                maxLength={80}
                className={inputClass}
              />
              <p className="text-xs text-ink-500">This appears on your reviews. You can change it later.</p>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-sm font-semibold text-ink-800">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className={inputClass}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-sm font-semibold text-ink-800">
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                className={inputClass}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="confirm" className="text-sm font-semibold text-ink-800">
                Confirm password
              </label>
              <input
                id="confirm"
                type="password"
                autoComplete="new-password"
                required
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Repeat password"
                className={inputClass}
              />
            </div>

            <Button
              type="submit"
              variant="secondary"
              size="lg"
              disabled={loading || !email || !password || !confirm}
              className="w-full mt-1"
            >
              {loading ? 'Creating account…' : 'Create account'}
            </Button>
          </form>
        </Card>

        <p className="mt-6 text-center text-sm text-ink-600">
          Already have an account?{' '}
          <Link to="/sign-in" className="font-semibold text-brand-700 hover:text-brand-800 underline underline-offset-2">
            Sign in
          </Link>
        </p>
      </div>
    </Container>
  )
}
