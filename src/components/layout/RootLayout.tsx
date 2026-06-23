import { Outlet, ScrollRestoration, useNavigation } from 'react-router-dom'
import { useEffect } from 'react'

import Footer from './Footer'
import Navbar from './Navbar'
import SkipToContent from './SkipToContent'
import { cn } from '../../lib/cn'
import { clearAssetRecoveryMarker } from '../../lib/assetRecovery'

export default function RootLayout() {
  const navigation = useNavigation()
  const isBusy = navigation.state !== 'idle'

  useEffect(() => {
    clearAssetRecoveryMarker()
  }, [])

  return (
    <div className="min-h-dvh">
      <SkipToContent />
      <Navbar />
      <div
        className={cn(
          'h-1 w-full bg-brand-600/70 transition-opacity motion-reduce:transition-none',
          isBusy ? 'opacity-100' : 'opacity-0',
        )}
        aria-hidden="true"
      />
      <div className="sr-only" role="status" aria-live="polite">
        {isBusy ? 'Loading…' : ''}
      </div>
      <main id="main-content" className="min-h-[70dvh]">
        <Outlet />
      </main>
      <Footer />
      <ScrollRestoration />
    </div>
  )
}
