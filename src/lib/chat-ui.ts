import type { UIMessage } from 'ai'
import type { StoredMessage } from '@/types/chat'

export type ChatUiMessage = UIMessage<{
  createdAt?: string
}>

export function storedMessageToUiMessage(
  message: StoredMessage
): ChatUiMessage {
  return {
    id: message.id,
    role: message.role,
    metadata: {
      createdAt: message.createdAt,
    },
    parts: [
      {
        type: 'text',
        text: message.content,
      },
    ],
  }
}

export function storedMessagesToUiMessages(messages: StoredMessage[]) {
  return messages.map(storedMessageToUiMessage)
}

export function getTextFromUiMessage(message: UIMessage) {
  return message.parts
    .filter((part) => part.type === 'text')
    .map((part) => part.text)
    .join('')
    .trim()
}
