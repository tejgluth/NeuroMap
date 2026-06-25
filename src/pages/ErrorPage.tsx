import { AlertTriangle, RefreshCcw } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { isRouteErrorResponse, useRouteError } from 'react-router-dom'

import Container from '../components/ui/Container'
import { Button, ButtonLink } from '../components/ui/Button'
import { hasRetriedCurrentUrl, markCurrentUrlRetried } from '../lib/assetRecovery'

function getErrorMessage(error: unknown) {
  if (isRouteErrorResponse(error)) {
    return `${error.status} ${error.statusText}`.trim()
  }

  if (error instanceof Error) {
    return error.message
  }

  if (typeof error === 'string') {
    return error
  }

  return ''
}

function isAssetLoadError(error: unknown) {
  const message = getErrorMessage(error).toLowerCase()

  return [
    'valid javascript mime type',
    'dynamically imported module',
    'importing a module script failed',
    'failed to fetch dynamically imported module',
    'chunkloaderror',
  ].some((needle) => message.includes(needle))
}

export default function ErrorPage() {
  const error = useRouteError()
  const message = getErrorMessage(error)
  const isMissingAsset = useMemo(() => isAssetLoadError(error), [error])
  const [isRecovering] = useState(() => isMissingAsset && !hasRetriedCurrentUrl())

  useEffect(() => {
    if (!isRecovering) {
      return
    }

    markCurrentUrlRetried()

    const reloadTimer = window.setTimeout(() => {
      window.location.reload()
    }, 750)

    return () => window.clearTimeout(reloadTimer)
  }, [isRecovering])

  const title = isRecovering
    ? 'Refreshing NeuroMaps'
    : isMissingAsset
      ? 'NeuroMaps needs a fresh reload'
      : 'Something went wrong'

  const description = isRecovering
    ? 'A newer version of the site is available. We are reloading it now.'
    : isMissingAsset
      ? 'Your browser tried to load an older site file that is no longer available. Reloading will fetch the current version.'
      : 'The page could not load correctly. You can reload the page or return to the map.'

  return (
    <main className="min-h-dvh bg-sand-50 py-20">
      <Container>
        <div className="mx-auto max-w-lg rounded-3xl border border-ink-100 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-100 text-brand-700">
            {isRecovering ? (
              <RefreshCcw className="h-7 w-7 animate-spin motion-reduce:animate-none" aria-hidden="true" />
            ) : (
              <AlertTriangle className="h-7 w-7" aria-hidden="true" />
            )}
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-ink-900">{title}</h1>
          <p className="mt-3 text-ink-600">{description}</p>
          {!isRecovering && message ? (
            <p className="mt-4 rounded-2xl bg-sand-100 px-4 py-3 text-sm text-ink-600">
              Error reference: {isMissingAsset ? 'stale site asset' : 'route load failure'}
            </p>
          ) : null}
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Button type="button" variant="primary" onClick={() => window.location.reload()}>
              Reload page
            </Button>
            <ButtonLink to="/map" variant="ghost">
              Explore Map
            </ButtonLink>
          </div>
        </div>
      </Container>
    </main>
  )
}
