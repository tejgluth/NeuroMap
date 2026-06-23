const json = (body, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
})

const MAX_BODY_BYTES = 12_000
const WINDOW_MS = 60_000
const MAX_MESSAGES_PER_WINDOW = 5
const ipBuckets = new Map()

const escapeHtml = (value) => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;')

function isAllowedOrigin(request, env) {
  const origin = request.headers.get('Origin')
  if (!origin) return true

  const requestUrl = new URL(request.url)
  const allowed = new Set([requestUrl.origin])
  const siteUrl = String(env.VITE_SITE_URL || '').trim()
  if (siteUrl) allowed.add(new URL(siteUrl).origin)

  return allowed.has(origin)
}

function isRateLimited(request) {
  const ip = request.headers.get('CF-Connecting-IP') || 'unknown'
  const now = Date.now()
  const current = ipBuckets.get(ip)

  if (!current || now > current.resetAt) {
    ipBuckets.set(ip, { count: 1, resetAt: now + WINDOW_MS })
    return false
  }

  current.count += 1
  return current.count > MAX_MESSAGES_PER_WINDOW
}

export async function onRequest({ request, env }) {
  if (request.method !== 'POST') return json({ error: 'Method not allowed.' }, 405)
  if (!isAllowedOrigin(request, env)) return json({ error: 'Request origin is not allowed.' }, 403)
  if (!request.headers.get('Content-Type')?.toLowerCase().includes('application/json')) {
    return json({ error: 'Invalid request.' }, 415)
  }
  const contentLength = Number(request.headers.get('Content-Length') || 0)
  if (contentLength > MAX_BODY_BYTES) return json({ error: 'Message is too large.' }, 413)
  if (isRateLimited(request)) return json({ error: 'Too many messages. Please try again later.' }, 429)

  let payload
  try {
    payload = await request.json()
  } catch {
    return json({ error: 'Invalid request.' }, 400)
  }

  if (payload.website) return json({ ok: true })

  const kind = payload.kind === 'feedback' ? 'feedback' : 'contact'
  const name = String(payload.name || '').trim().slice(0, 100)
  const email = String(payload.email || '').trim().slice(0, 254)
  const subject = String(payload.subject || '').replace(/[\r\n]/g, ' ').trim().slice(0, 160)
  const message = String(payload.message || '').trim().slice(0, 6000)
  const feedbackType = String(payload.feedbackType || '').trim().slice(0, 80)

  if (!subject || message.length < 10) {
    return json({ error: 'Please include a subject and a message of at least 10 characters.' }, 400)
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ error: 'Please enter a valid email address.' }, 400)
  }

  const apiKey = env.RESEND_API_KEY || env.RESEND_KEY
  const from = String(env.RESEND_FROM || '').trim()
  const contactEmail = String(env.CONTACT_EMAIL || '').trim()
  if (!apiKey || !from || !contactEmail) return json({ error: 'Email service is not configured.' }, 503)

  const heading = kind === 'feedback' ? 'Website feedback' : 'Contact message'
  const rows = [
    name && `<p><strong>Name:</strong> ${escapeHtml(name)}</p>`,
    email && `<p><strong>Email:</strong> ${escapeHtml(email)}</p>`,
    feedbackType && `<p><strong>Feedback type:</strong> ${escapeHtml(feedbackType)}</p>`,
  ].filter(Boolean).join('')

  const resendResponse = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [contactEmail],
      reply_to: email || undefined,
      subject: `[NeuroMaps ${kind === 'feedback' ? 'Feedback' : 'Contact'}] ${subject}`,
      html: `<div style="font-family:Arial,sans-serif;line-height:1.6;color:#1c3444;max-width:640px"><h1 style="font-size:22px">${heading}</h1>${rows}<p><strong>Subject:</strong> ${escapeHtml(subject)}</p><hr style="border:0;border-top:1px solid #dce3e5"><p style="white-space:pre-wrap">${escapeHtml(message)}</p></div>`,
      text: [heading, name && `Name: ${name}`, email && `Email: ${email}`, feedbackType && `Feedback type: ${feedbackType}`, `Subject: ${subject}`, '', message].filter(Boolean).join('\n'),
    }),
  })

  if (!resendResponse.ok) {
    console.error('Resend request failed', resendResponse.status, await resendResponse.text())
    return json({ error: 'Email delivery failed. Please try again later.' }, 502)
  }

  return json({ ok: true })
}
