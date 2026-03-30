const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions'
const OPENROUTER_API_KEY = 'PASTE_YOUR_OPENROUTER_API_KEY_HERE'
const OPENROUTER_MODEL = 'openrouter/auto'
const WORD_DELAY_MS = 28

function wait(delay) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, delay)
  })
}

function extractReadySegments(buffer) {
  const segments = []
  const matcher = /\S+\s*/g
  let match = matcher.exec(buffer)
  let consumedUntil = 0

  while (match) {
    const segment = match[0]
    const endsAt = matcher.lastIndex
    const segmentEndsWithWhitespace = /\s$/.test(segment)

    if (!segmentEndsWithWhitespace && endsAt === buffer.length) {
      break
    }

    segments.push(segment)
    consumedUntil = endsAt
    match = matcher.exec(buffer)
  }

  return {
    segments,
    remainder: buffer.slice(consumedUntil),
  }
}

function readErrorMessage(payload) {
  if (payload?.error?.message) {
    return payload.error.message
  }

  return 'OpenRouter could not complete the streaming request.'
}

export async function streamAssistantReply(messages, onDelta) {
  if (OPENROUTER_API_KEY === 'PASTE_YOUR_OPENROUTER_API_KEY_HERE') {
    throw new Error(
      'Paste your OpenRouter API key into legacy/plain-chat/api.js first.'
    )
  }

  const response = await fetch(OPENROUTER_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: OPENROUTER_MODEL,
      messages,
      stream: true,
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

  const reader = response.body?.getReader()

  if (!reader) {
    throw new Error('This browser did not expose a readable stream.')
  }

  const decoder = new TextDecoder()
  let completeReply = ''
  let partialLine = ''
  let partialWords = ''

  while (true) {
    const { value, done } = await reader.read()

    if (done) {
      break
    }

    partialLine += decoder.decode(value, { stream: true })
    const lines = partialLine.split('\n')
    partialLine = lines.pop() || ''

    for (const rawLine of lines) {
      const line = rawLine.trim()

      if (!line.startsWith('data:')) {
        continue
      }

      const payload = line.slice(5).trim()

      if (payload === '[DONE]') {
        continue
      }

      const parsed = JSON.parse(payload)
      const contentDelta = parsed.choices?.[0]?.delta?.content

      if (!contentDelta) {
        continue
      }

      partialWords += contentDelta
      const { segments, remainder } = extractReadySegments(partialWords)
      partialWords = remainder

      for (const segment of segments) {
        completeReply += segment
        onDelta(completeReply)
        await wait(WORD_DELAY_MS)
      }
    }
  }

  const finalChunk = decoder.decode()

  if (finalChunk) {
    partialWords += finalChunk
  }

  if (partialWords) {
    completeReply += partialWords
    onDelta(completeReply)
  }

  return completeReply
}
