export type MessageRole = 'user' | 'assistant'

export type ConversationSummary = {
  id: string
  title: string
  preview: string
  createdAt: string
  updatedAt: string
}

export type StoredMessage = {
  id: string
  conversationId: string
  role: MessageRole
  content: string
  createdAt: string
}

export type DeleteConversationResult = {
  deletedConversationId: string
}
