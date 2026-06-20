export type SiteMessagePayload = {
  kind: 'contact' | 'feedback'
  name?: string
  email?: string
  subject: string
  message: string
  feedbackType?: string
  website?: string
}

export async function sendSiteMessage(payload: SiteMessagePayload) {
  const response = await fetch('/api/email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const body = await response.json().catch(() => null) as { error?: string } | null
  if (!response.ok) throw new Error(body?.error || 'Could not send your message. Please try again.')
}
