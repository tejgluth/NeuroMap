export default function RouteFallback() {
  return (
    <div className="min-h-dvh bg-sand-50 px-6 py-16">
      <div className="mx-auto flex max-w-sm flex-col items-center text-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-brand-100 border-t-brand-600 motion-reduce:animate-none" />
        <p className="mt-4 text-sm font-semibold text-ink-800">Loading NeuroMaps…</p>
      </div>
    </div>
  )
}
