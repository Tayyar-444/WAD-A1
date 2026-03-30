import {
  buildConversationId,
  conversationsDb,
  resolveLater,
} from './mockDatabase.js'

function trimText(text, maxLength) {
  if (text.length <= maxLength) {
    return text
  }

  return `${text.slice(0, maxLength - 1).trimEnd()}…`
}

function sortConversations(conversations) {
  return [...conversations].sort(
    (left, right) => new Date(right.updatedAt) - new Date(left.updatedAt)
  )
}

export function getConversations() {
  return resolveLater(sortConversations(conversationsDb))
}

export function createConversation() {
  const timestamp = new Date().toISOString()
  const newConversation = {
    id: buildConversationId(),
    title: `New Chat ${conversationsDb.length + 1}`,
    preview: 'Start typing to begin the conversation.',
    updatedAt: timestamp,
  }

  conversationsDb.unshift(newConversation)

  return resolveLater(newConversation)
}

export function touchConversation(conversationId, previewText) {
  const conversation = conversationsDb.find(
    (entry) => entry.id === conversationId
  )

  if (!conversation) {
    throw new Error('Conversation not found.')
  }

  const cleanPreview = previewText.trim()

  conversation.preview =
    cleanPreview.length > 0
      ? trimText(cleanPreview, 72)
      : 'Start typing to begin the conversation.'
  conversation.updatedAt = new Date().toISOString()

  if (conversation.title.startsWith('New Chat') && cleanPreview.length > 0) {
    conversation.title = trimText(cleanPreview, 26)
  }

  return resolveLater(conversation)
}
