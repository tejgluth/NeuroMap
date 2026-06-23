export async function onRequest(context) {
  const response = await context.next()
  const contentType = response.headers.get('content-type') || ''

  if (response.ok && contentType.toLowerCase().includes('text/html')) {
    return new Response('Asset not found', {
      status: 404,
      headers: {
        'cache-control': 'no-store',
        'content-type': 'text/plain; charset=utf-8',
        'x-content-type-options': 'nosniff',
      },
    })
  }

  return response
}
