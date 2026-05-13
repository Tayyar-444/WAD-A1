import type {
  ConversationSummary,
  DeleteConversationResult,
  MessageRole,
  StoredMessage,
} from '@/types/chat'

async function readJson<T>(response: Response) {
  if (!response.ok) {
    const errorPayload = (await response.json().catch(() => null)) as {
      error?: string
    } | null

    throw new Error(
      errorPayload?.error || 'The request could not be completed.'
    )
  }

  return (await response.json()) as T
}

export async function createConversationRequest() {
  const response = await fetch('/api/conversations', {
    method: 'POST',
  })

  return readJson<ConversationSummary>(response)
}

export async function deleteConversationRequest(conversationId: string) {
  const response = await fetch(`/api/conversations/${conversationId}`, {
    method: 'DELETE',
  })

  return readJson<DeleteConversationResult>(response)
}

export async function fetchConversationMessages(conversationId: string) {
  const response = await fetch(
    `/api/conversations/${conversationId}/messages`,
    {
      cache: 'no-store',
    }
  )

  return readJson<StoredMessage[]>(response)
}

export async function saveConversationMessageRequest(
  conversationId: string,
  role: MessageRole,
  content: string
) {
  const response = await fetch(
    `/api/conversations/${conversationId}/messages`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        role,
        content,
      }),
    }
  )

  return readJson<StoredMessage>(response)
}
