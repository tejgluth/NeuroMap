import { AlertCircle, CheckCircle2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import { ButtonLink } from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Container from '../../components/ui/Container'
import Spinner from '../../components/ui/Spinner'
import { supabase } from '../../lib/supabase'

type ConfirmationState = 'verifying' | 'confirmed' | 'error'
type AuthEmailType = 'email' | 'signup' | 'recovery' | 'invite' | 'magiclink' | 'email_change'

const AUTH_EMAIL_FLOWS: Record<AuthEmailType, {
  progress: string
  success: string
  actionLabel: string
  actionPath: string
}> = {
  email: {
    progress: 'Confirming your email address…',
    success: 'Your email is confirmed. Your NeuroMaps account is ready.',
    actionLabel: 'Continue to your account',
    actionPath: '/account',
  },
  signup: {
    progress: 'Confirming your email address…',
    success: 'Your email is confirmed. Your NeuroMaps account is ready.',
    actionLabel: 'Continue to your account',
    actionPath: '/account',
  },
  recovery: {
    progress: 'Verifying your password-reset link…',
    success: 'Your reset link is verified. You can now choose a new password.',
    actionLabel: 'Choose a new password',
    actionPath: '/reset-password',
  },
  invite: {
    progress: 'Accepting your NeuroMaps invitation…',
    success: 'Your invitation is accepted and your NeuroMaps account is ready.',
    actionLabel: 'Continue to your account',
    actionPath: '/account',
  },
  magiclink: {
    progress: 'Signing you in securely…',
    success: 'You are signed in to NeuroMaps.',
    actionLabel: 'Continue to your account',
    actionPath: '/account',
  },
  email_change: {
    progress: 'Confirming your new email address…',
    success: 'Your NeuroMaps email address has been updated.',
    actionLabel: 'Continue to your account',
    actionPath: '/account',
  },
}

function isAuthEmailType(value: string | null): value is AuthEmailType {
  return value !== null && value in AUTH_EMAIL_FLOWS
}

export default function ConfirmEmailPage() {
  const [searchParams] = useSearchParams()
  const tokenHash = searchParams.get('token_hash')
  const requestedType = searchParams.get('type')
  const emailType = isAuthEmailType(requestedType) ? requestedType : null
  const flow = emailType ? AUTH_EMAIL_FLOWS[emailType] : null
  const [state, setState] = useState<ConfirmationState>('verifying')
  const [message, setMessage] = useState(flow?.progress ?? 'Verifying your secure link…')

  useEffect(() => {
    let cancelled = false

    async function confirmAuthEmail() {
      if (!tokenHash || !emailType || !flow) {
        setState('error')
        setMessage('This secure link is incomplete. Please request a new email and try again.')
        return
      }

      const { error } = await supabase.auth.verifyOtp({
        token_hash: tokenHash,
        type: emailType,
      })

      if (cancelled) return

      if (error) {
        setState('error')
        setMessage('This secure link is invalid or has expired. Please request a new email and try again.')
        return
      }

      setState('confirmed')
      setMessage(flow.success)
    }

    void confirmAuthEmail()
    return () => {
      cancelled = true
    }
  }, [emailType, flow, tokenHash])

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
              ? emailType === 'recovery'
                ? 'Reset link verified'
                : 'Secure link verified'
              : state === 'error'
                ? 'Secure link unavailable'
                : 'Verifying your link'}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-ink-700">{message}</p>

          {state === 'confirmed' && (
            <div className="mt-6">
              <ButtonLink to={flow?.actionPath ?? '/account'} variant="secondary">
                {flow?.actionLabel ?? 'Continue to NeuroMaps'}
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
