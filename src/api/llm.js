const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions'

function readErrorMessage(payload) {
  if (payload?.error?.message) {
    return payload.error.message
  }

  return 'OpenRouter could not complete the request.'
}

export async function requestAssistantReply(messages) {
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY
  const model = import.meta.env.VITE_OPENROUTER_MODEL || 'openrouter/auto'

  if (!apiKey) {
    throw new Error(
      'Add VITE_OPENROUTER_API_KEY to .env.local before requesting an AI reply.'
    )
  }

  const response = await fetch(OPENROUTER_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': window.location.origin,
      'X-Title': 'Campus Chat Studio',
    },
    body: JSON.stringify({
      model,
      messages: messages.map(({ role, content }) => ({ role, content })),
    }),
  })

  if (!response.ok) {
    let errorPayload = null

    try {
      errorPayload = await response.json()
    } catch {
      errorPayload = null
    }

    throw new Error(readErrorMessage(errorPayload))
  }

  const payload = await response.json()
  const reply = payload.choices?.[0]?.message?.content?.trim()

  if (!reply) {
    throw new Error('OpenRouter returned an empty reply.')
  }

  return reply
}
