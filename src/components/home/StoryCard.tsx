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
    <Card className="p-6">
      <h3 className="text-pretty text-base font-semibold text-ink-900">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-ink-800">{scenario}</p>
      <p className="mt-3 text-sm leading-relaxed text-ink-700">
        <span className="font-semibold text-ink-800">Why it matters:</span> {whyItMatters}
      </p>
    </Card>
  )
}

