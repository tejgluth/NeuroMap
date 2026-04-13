import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'
import { Button } from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Container from '../../components/ui/Container'

const inputClass =
  'w-full rounded-xl border border-ink-100/60 bg-white px-4 py-2.5 text-sm text-ink-900 placeholder-ink-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30 transition-colors'

export default function ResetPasswordPage() {
  const { updatePassword } = useAuth()
  const navigate = useNavigate()

  const [ready, setReady] = useState(false)
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  // Supabase fires PASSWORD_RECOVERY when the user arrives via a reset link.
  // detectSessionInUrl:true (set on the client) parses the hash and sets up the session.
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setReady(true)
      }
    })
    return () => subscription.unsubscribe()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    const { error } = await updatePassword(password)
    setLoading(false)

    if (error) {
      setError(error)
    } else {
      setSuccess(true)
      setTimeout(() => navigate('/account', { replace: true }), 2500)
    }
  }

  if (success) {
    return (
      <Container className="py-16 flex justify-center">
        <div className="w-full max-w-md text-center">
          <Card className="p-8">
            <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100 text-green-700">
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M20 6 9 17l-5-5"/>
              </svg>
            </div>
            <h1 className="text-xl font-semibold tracking-tight text-ink-900 mb-2">Password updated</h1>
            <p className="text-sm text-ink-700">Your password has been changed. Redirecting to your account…</p>
          </Card>
        </div>
      </Container>
    )
  }

  if (!ready) {
    return (
      <Container className="py-16 flex justify-center">
        <div className="w-full max-w-md text-center">
          <Card className="p-8">
            <p className="text-sm text-ink-700">Verifying your reset link…</p>
            <p className="mt-3 text-xs text-ink-500">
              If nothing happens, the link may have expired.{' '}
              <a href="/forgot-password" className="font-semibold text-brand-700 hover:text-brand-800 underline underline-offset-2">
                Request a new one.
              </a>
            </p>
          </Card>
        </div>
      </Container>
    )
  }

  return (
    <Container className="py-16 flex justify-center">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-ink-900">Choose a new password</h1>
          <p className="mt-2 text-sm text-ink-700">Pick something strong and memorable.</p>
        </div>

        <Card className="p-8">
          {error && (
            <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-sm font-semibold text-ink-800">
                New password
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
                Confirm new password
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
              disabled={loading || !password || !confirm}
              className="w-full mt-1"
            >
              {loading ? 'Saving…' : 'Set new password'}
            </Button>
          </form>
        </Card>
      </div>
    </Container>
  )
}
