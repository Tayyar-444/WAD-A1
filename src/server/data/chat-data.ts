import { prisma } from '@/lib/prisma'
import type {
  ConversationSummary,
  MessageRole,
  StoredMessage,
} from '@/types/chat'

const DEFAULT_TITLE = 'New Chat'
const DEFAULT_PREVIEW = 'Start typing to begin the conversation.'

function clipText(value: string, maxLength: number) {
  if (value.length <= maxLength) {
    return value
  }

  return `${value.slice(0, maxLength - 3).trimEnd()}...`
}

function normalizeContent(content: string) {
  return content.trim()
}

function serializeConversation(record: {
  id: string
  title: string
  preview: string
  createdAt: Date
  updatedAt: Date
}): ConversationSummary {
  return {
    id: record.id,
    title: record.title,
    preview: record.preview,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  }
}

function serializeMessage(record: {
  id: string
  conversationId: string
  role: string
  content: string
  createdAt: Date
}): StoredMessage {
  return {
    id: record.id,
    conversationId: record.conversationId,
    role: record.role as MessageRole,
    content: record.content,
    createdAt: record.createdAt.toISOString(),
  }
}

async function updateConversationSummary(
  conversationId: string,
  role: MessageRole,
  content: string
) {
  const cleanContent = normalizeContent(content)
  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
  })

  if (!conversation) {
    throw new Error('Conversation not found.')
  }

  const nextPreview =
    cleanContent.length > 0 ? clipText(cleanContent, 72) : DEFAULT_PREVIEW

  const data: {
    title?: string
    preview: string
  } = {
    preview: nextPreview,
  }

  if (
    role === 'user' &&
    conversation.title === DEFAULT_TITLE &&
    cleanContent.length > 0
  ) {
    data.title = clipText(cleanContent, 28)
  }

  await prisma.conversation.update({
    where: { id: conversationId },
    data,
  })
}

export async function listConversations() {
  const conversations = await prisma.conversation.findMany({
    orderBy: {
      updatedAt: 'desc',
    },
  })

  return conversations.map(serializeConversation)
}

export async function getConversationById(conversationId: string) {
  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
  })

  if (!conversation) {
    return null
  }

  return serializeConversation(conversation)
}

export async function createConversation() {
  const conversation = await prisma.conversation.create({
    data: {
      title: DEFAULT_TITLE,
      preview: DEFAULT_PREVIEW,
    },
  })

  return serializeConversation(conversation)
}

export async function deleteConversation(conversationId: string) {
  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
  })

  if (!conversation) {
    return null
  }

  await prisma.conversation.delete({
    where: { id: conversationId },
  })

  return conversationId
}

export async function listMessagesByConversationId(conversationId: string) {
  const messages = await prisma.message.findMany({
    where: {
      conversationId,
    },
    orderBy: {
      createdAt: 'asc',
    },
  })

  return messages.map(serializeMessage)
}

export async function createMessage(
  conversationId: string,
  role: MessageRole,
  content: string
) {
  const cleanContent = normalizeContent(content)

  if (!cleanContent) {
    throw new Error('Message content cannot be empty.')
  }

  const message = await prisma.message.create({
    data: {
      conversationId,
      role,
      content: cleanContent,
    },
  })

  await updateConversationSummary(conversationId, role, cleanContent)

  return serializeMessage(message)
}
