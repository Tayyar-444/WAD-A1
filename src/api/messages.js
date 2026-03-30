import { buildMessageId, messagesDb, resolveLater } from './mockDatabase.js'

function sortMessages(messages) {
  return [...messages].sort(
    (left, right) => new Date(left.createdAt) - new Date(right.createdAt)
  )
}

export function getMessagesByConversationId(conversationId) {
  return resolveLater(
    sortMessages(
      messagesDb.filter((message) => message.conversationId === conversationId)
    )
  )
}

export function createMessage({ conversationId, role, content }) {
  const newMessage = {
    id: buildMessageId(),
    conversationId,
    role,
    content,
    createdAt: new Date().toISOString(),
  }

  messagesDb.push(newMessage)

  return resolveLater(newMessage)
}
