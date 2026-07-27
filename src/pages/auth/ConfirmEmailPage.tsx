import { AlertCircle, CheckCircle2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import { ButtonLink } from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Container from '../../components/ui/Container'
import Spinner from '../../components/ui/Spinner'
import { supabase } from '../../lib/supabase'

type ConfirmationState = 'verifying' | 'confirmed' | 'error'

export default function ConfirmEmailPage() {
  const [searchParams] = useSearchParams()
  const tokenHash = searchParams.get('token_hash')
  const [state, setState] = useState<ConfirmationState>('verifying')
  const [message, setMessage] = useState('Confirming your email address…')

  useEffect(() => {
    let cancelled = false

    async function confirmEmail() {
      if (!tokenHash) {
        setState('error')
        setMessage('This confirmation link is incomplete. Please request a new confirmation email.')
        return
      }

      const { error } = await supabase.auth.verifyOtp({
        token_hash: tokenHash,
        type: 'email',
      })

      if (cancelled) return

      if (error) {
        setState('error')
        setMessage('This confirmation link is invalid or has expired. Please request a new confirmation email.')
        return
      }

      setState('confirmed')
      setMessage('Your email is confirmed. Your NeuroMaps account is ready.')
    }

    void confirmEmail()
    return () => {
      cancelled = true
    }
  }, [tokenHash])

  return (
    <Container className="flex justify-center py-16">
      <div className="w-full max-w-md text-center">
        <Card className="p-8">
          {state === 'verifying' ? (
            <Spinner className="mx-auto" />
          ) : (
            <div
              className={`mx-auto flex h-12 w-12 items-center justify-center rounded-2xl ${
                state === 'confirmed'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
              }`}
            >
              {state === 'confirmed' ? (
                <CheckCircle2 className="h-6 w-6" aria-hidden="true" />
              ) : (
                <AlertCircle className="h-6 w-6" aria-hidden="true" />
              )}
            </div>
          )}

          <h1 className="mt-5 text-xl font-semibold tracking-tight text-ink-900">
            {state === 'confirmed'
              ? 'Email confirmed'
              : state === 'error'
                ? 'Confirmation link unavailable'
                : 'Confirming your email'}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-ink-700">{message}</p>

          {state === 'confirmed' && (
            <div className="mt-6">
              <ButtonLink to="/account" variant="secondary">
                Continue to your account
              </ButtonLink>
            </div>
          )}

          {state === 'error' && (
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <ButtonLink to="/sign-in" variant="secondary">
                Go to sign in
              </ButtonLink>
              <ButtonLink to="/contact" variant="ghost">
                Contact us
              </ButtonLink>
            </div>
          )}
        </Card>
      </div>
    </Container>
  )
}
