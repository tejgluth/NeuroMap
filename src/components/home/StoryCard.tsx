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
    <div className="rounded-2xl border border-ink-100/60 bg-sand-50 p-7 shadow-card">
      <h3 className="text-base font-semibold text-ink-900">{title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-ink-700">{scenario}</p>
      <div className="mt-5 flex gap-3 rounded-xl bg-brand-50 px-4 py-3.5">
        <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" aria-hidden="true" />
        <p className="text-sm leading-relaxed text-brand-900">{whyItMatters}</p>
      </div>
    </div>
  )
}
