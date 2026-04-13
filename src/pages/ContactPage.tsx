import { useState } from 'react'
import { Send } from 'lucide-react'

import Container from '../components/ui/Container'
import { Button } from '../components/ui/Button'

// Set the destination email address here
const CONTACT_EMAIL = 'hello@neuromap.app'

export default function ContactPage() {
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const mailtoUrl =
      `mailto:${CONTACT_EMAIL}` +
      `?subject=${encodeURIComponent(subject)}` +
      `&body=${encodeURIComponent(message)}`
    window.location.href = mailtoUrl
  }

  return (
    <div className="py-10 sm:py-14">
      <Container>
        <div className="mx-auto max-w-xl">
          <div className="text-xs font-semibold uppercase tracking-wider text-brand-700">About</div>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl">
            Contact us
          </h1>
          <p className="mt-4 text-base leading-relaxed text-ink-700">
            Have a question, suggestion, or something to report? Send us a message and we'll get back to you.
          </p>

          <form onSubmit={handleSubmit} className="mt-10 space-y-6">
            <div>
              <label htmlFor="subject" className="block text-sm font-semibold text-ink-900 mb-2">
                Subject
              </label>
              <input
                id="subject"
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="What's this about?"
                className="w-full rounded-xl border border-ink-200 bg-sand-50 px-4 py-3 text-sm text-ink-900 placeholder:text-ink-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200 transition"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-semibold text-ink-900 mb-2">
                Message
              </label>
              <textarea
                id="message"
                required
                rows={6}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us what's on your mind…"
                className="w-full resize-none rounded-xl border border-ink-200 bg-sand-50 px-4 py-3 text-sm text-ink-900 placeholder:text-ink-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200 transition"
              />
            </div>

            <Button type="submit" variant="primary" size="lg" className="w-full sm:w-auto">
              <Send className="h-4 w-4" aria-hidden="true" />
              Send message
            </Button>
          </form>
        </div>
      </Container>
    </div>
  )
}
