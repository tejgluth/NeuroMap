import { AlertCircle, CheckCircle2, Send } from 'lucide-react'
import { useState } from 'react'

import Container from '../components/ui/Container'
import { Button } from '../components/ui/Button'
import { sendSiteMessage } from '../lib/siteMessages'

const inputClass = 'w-full rounded-xl border border-ink-200 bg-sand-50 px-4 py-3 text-sm text-ink-900 placeholder:text-ink-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200 transition'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '', website: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [error, setError] = useState('')

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setStatus('sending')
    setError('')
    try {
      await sendSiteMessage({ kind: 'contact', ...form })
      setStatus('sent')
      setForm({ name: '', email: '', subject: '', message: '', website: '' })
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Could not send your message.')
      setStatus('error')
    }
  }

  return (
    <div className="py-10 sm:py-14">
      <Container>
        <div className="mx-auto max-w-xl">
          <div className="text-xs font-semibold uppercase tracking-wider text-brand-700">Get in touch</div>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl">Contact us</h1>
          <p className="mt-4 text-base leading-relaxed text-ink-700">Have a question or something to report? Send us a message and we'll get back to you.</p>

          {status === 'sent' && (
            <div className="mt-8 flex gap-3 rounded-xl border border-brand-200 bg-brand-50 p-4 text-sm text-ink-800" role="status">
              <CheckCircle2 className="h-5 w-5 shrink-0 text-brand-700" aria-hidden="true" />
              Your message was sent. Thank you for contacting NeuroMaps.
            </div>
          )}
          {status === 'error' && (
            <div className="mt-8 flex gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800" role="alert">
              <AlertCircle className="h-5 w-5 shrink-0" aria-hidden="true" />{error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="grid gap-2"><span className="text-sm font-semibold text-ink-900">Name</span><input value={form.name} onChange={(e) => setForm((v) => ({ ...v, name: e.target.value }))} autoComplete="name" className={inputClass} /></label>
              <label className="grid gap-2"><span className="text-sm font-semibold text-ink-900">Email</span><input type="email" required value={form.email} onChange={(e) => setForm((v) => ({ ...v, email: e.target.value }))} autoComplete="email" className={inputClass} /></label>
            </div>
            <label className="grid gap-2"><span className="text-sm font-semibold text-ink-900">Subject</span><input required maxLength={160} value={form.subject} onChange={(e) => setForm((v) => ({ ...v, subject: e.target.value }))} className={inputClass} /></label>
            <label className="grid gap-2"><span className="text-sm font-semibold text-ink-900">Message</span><textarea required minLength={10} maxLength={6000} rows={7} value={form.message} onChange={(e) => setForm((v) => ({ ...v, message: e.target.value }))} className={`${inputClass} resize-y`} /></label>
            <label className="sr-only">Website<input tabIndex={-1} autoComplete="off" value={form.website} onChange={(e) => setForm((v) => ({ ...v, website: e.target.value }))} /></label>
            <Button type="submit" variant="primary" size="lg" disabled={status === 'sending'}>
              <Send className="h-4 w-4" aria-hidden="true" />{status === 'sending' ? 'Sending…' : 'Send message'}
            </Button>
          </form>
        </div>
      </Container>
    </div>
  )
}
