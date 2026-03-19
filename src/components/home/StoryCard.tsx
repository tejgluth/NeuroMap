import Card from '../ui/Card'

export default function StoryCard({
  title,
  scenario,
  whyItMatters,
}: {
  title: string
  scenario: string
  whyItMatters: string
}) {
  return (
    <Card className="border-l-2 border-brand-300 p-6">
      <h3 className="text-pretty text-base font-semibold text-ink-900">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-ink-800">{scenario}</p>
      <div className="mt-3 rounded-xl bg-sand-100 px-4 py-3">
        <span className="text-xs font-semibold uppercase tracking-wide text-brand-700">Why it matters</span>
        <p className="mt-1 text-sm leading-relaxed text-ink-800">{whyItMatters}</p>
      </div>
    </Card>
  )
}
