import { AlertCircle, CheckCircle2, Lightbulb, Send } from 'lucide-react'
import { useState } from 'react'

import { Button } from '../components/ui/Button'
import Container from '../components/ui/Container'
import { sendSiteMessage } from '../lib/siteMessages'

const inputClass = 'w-full rounded-xl border border-ink-200 bg-sand-50 px-4 py-3 text-sm text-ink-900 placeholder:text-ink-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200 transition'

export default function FeedbackPage() {
  const [form, setForm] = useState({ feedbackType: 'Feature request', subject: '', message: '', email: '', website: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [error, setError] = useState('')

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setStatus('sending')
    setError('')
    try {
      await sendSiteMessage({ kind: 'feedback', ...form })
      setStatus('sent')
      setForm({ feedbackType: 'Feature request', subject: '', message: '', email: '', website: '' })
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Could not send your feedback.')
      setStatus('error')
    }
  }

  return (
    <div className="py-10 sm:py-14">
      <Container>
        <div className="mx-auto max-w-2xl">
          <Lightbulb className="h-8 w-8 text-brand-600" aria-hidden="true" />
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl">Help improve NeuroMaps</h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-ink-700">Suggest a website change, request a feature, or tell us about something that is not working.</p>

          {status === 'sent' && <div className="mt-8 flex gap-3 rounded-xl border border-brand-200 bg-brand-50 p-4 text-sm text-ink-800" role="status"><CheckCircle2 className="h-5 w-5 shrink-0 text-brand-700" aria-hidden="true" />Your feedback was sent. Thank you.</div>}
          {status === 'error' && <div className="mt-8 flex gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800" role="alert"><AlertCircle className="h-5 w-5 shrink-0" aria-hidden="true" />{error}</div>}

          <form onSubmit={handleSubmit} className="mt-8 space-y-5 rounded-2xl border border-ink-100/60 bg-sand-50 p-6 shadow-card">
            <label className="grid gap-2"><span className="text-sm font-semibold text-ink-900">Type of feedback</span><select value={form.feedbackType} onChange={(e) => setForm((v) => ({ ...v, feedbackType: e.target.value }))} className={inputClass}><option>Feature request</option><option>Suggested change</option><option>Bug report</option><option>Accessibility issue</option><option>Place data correction</option><option>Other</option></select></label>
            <label className="grid gap-2"><span className="text-sm font-semibold text-ink-900">Short summary</span><input required maxLength={160} value={form.subject} onChange={(e) => setForm((v) => ({ ...v, subject: e.target.value }))} placeholder="What would you like us to change?" className={inputClass} /></label>
            <label className="grid gap-2"><span className="text-sm font-semibold text-ink-900">Details</span><textarea required minLength={10} maxLength={6000} rows={7} value={form.message} onChange={(e) => setForm((v) => ({ ...v, message: e.target.value }))} placeholder="Describe the problem or idea and why it would help." className={`${inputClass} resize-y`} /></label>
            <label className="grid gap-2"><span className="text-sm font-semibold text-ink-900">Email <span className="font-normal text-ink-500">(optional)</span></span><input type="email" value={form.email} onChange={(e) => setForm((v) => ({ ...v, email: e.target.value }))} autoComplete="email" placeholder="If you want a reply" className={inputClass} /></label>
            <label className="sr-only">Website<input tabIndex={-1} autoComplete="off" value={form.website} onChange={(e) => setForm((v) => ({ ...v, website: e.target.value }))} /></label>
            <Button type="submit" variant="primary" size="lg" disabled={status === 'sending'}><Send className="h-4 w-4" aria-hidden="true" />{status === 'sending' ? 'Sending…' : 'Send feedback'}</Button>
          </form>
        </div>
      </Container>
    </div>
  )
}
