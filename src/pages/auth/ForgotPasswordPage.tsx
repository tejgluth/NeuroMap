import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { Button } from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Container from '../../components/ui/Container'

const inputClass =
  'w-full rounded-xl border border-ink-100/60 bg-white px-4 py-2.5 text-sm text-ink-900 placeholder-ink-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30 transition-colors'

export default function ForgotPasswordPage() {
  const { sendPasswordReset } = useAuth()
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const { error } = await sendPasswordReset(email.trim())
    setLoading(false)
    if (error) {
      setError(error)
    } else {
      setSent(true)
    }
  }

  if (sent) {
    return (
      <Container className="py-16 flex justify-center">
        <div className="w-full max-w-md text-center">
          <Card className="p-8">
            <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-100 text-brand-700">
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect width="20" height="16" x="2" y="4" rx="2"/>
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
              </svg>
            </div>
            <h1 className="text-xl font-semibold tracking-tight text-ink-900 mb-2">Check your email</h1>
            <p className="text-sm text-ink-700 mb-6">
              If an account exists for <strong className="text-ink-900">{email}</strong>, we sent a password reset link. It expires in 1 hour.
            </p>
            <Link
              to="/sign-in"
              className="inline-flex items-center justify-center rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-sand-50 shadow-sm ring-1 ring-inset ring-brand-600/10 hover:bg-brand-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            >
              Back to sign in
            </Link>
          </Card>
          <p className="mt-4 text-xs text-ink-500">
            Didn't receive it? Check your spam folder or try again.
          </p>
        </div>
      </Container>
    )
  }

  return (
    <Container className="py-16 flex justify-center">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-ink-900">Reset your password</h1>
          <p className="mt-2 text-sm text-ink-700">Enter your email and we'll send you a reset link.</p>
        </div>

        <Card className="p-8">
          {error && (
            <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
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

            <Button
              type="submit"
              variant="secondary"
              size="lg"
              disabled={loading || !email}
              className="w-full mt-1"
            >
              {loading ? 'Sending…' : 'Send reset link'}
            </Button>
          </form>
        </Card>

        <p className="mt-6 text-center text-sm text-ink-700">
          Remember your password?{' '}
          <Link to="/sign-in" className="font-semibold text-brand-700 hover:text-brand-800 underline underline-offset-2">
            Sign in
          </Link>
        </p>
      </div>
    </Container>
  )
}
