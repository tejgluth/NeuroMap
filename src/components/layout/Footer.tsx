import Container from '../ui/Container'

export default function Footer() {
  return (
    <footer className="border-t border-ink-100/60 bg-sand-100">
      <Container className="flex flex-col gap-3 py-10 text-sm text-ink-700 md:flex-row md:items-start md:justify-between">
        <div className="max-w-xl">
          <div className="font-semibold text-ink-900">NeuroMap</div>
          <p className="mt-1 leading-relaxed">
            A calm, parent-powered platform for anticipating sensory environments. Ratings and reviews reflect
            parent-reported experiences and may change over time. Reviews you add are saved locally on this device.
          </p>
          <p className="mt-2 leading-relaxed">
            NeuroMap does not provide medical advice. Always use your best judgment and consult qualified professionals
            for individualized guidance.
          </p>
        </div>

        <div className="text-xs text-ink-700">
          <div className="font-semibold text-ink-900">NeuroMap</div>
          <div className="mt-1">No accounts needed · Reviews stay on your device</div>
          <div className="mt-1">© {new Date().getFullYear()} NeuroMap Team</div>
        </div>
      </Container>
    </footer>
  )
}
