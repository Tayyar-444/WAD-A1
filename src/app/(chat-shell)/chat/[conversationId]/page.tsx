import { notFound } from 'next/navigation'
import { ChatWorkspace } from '@/components/chat/ChatWorkspace'
import {
  getConversationById,
  listMessagesByConversationId,
} from '@/server/data/chat-data'

export const dynamic = 'force-dynamic'

type ChatPageProps = {
  params: Promise<{
    conversationId: string
  }>
}

export default async function ConversationPage({ params }: ChatPageProps) {
  const { conversationId } = await params
  const [conversation, messages] = await Promise.all([
    getConversationById(conversationId),
    listMessagesByConversationId(conversationId),
  ])

  if (!conversation) {
    notFound()
  }

  return (
    <ChatWorkspace
      key={conversation.id}
      conversation={conversation}
      initialMessages={messages}
    />
  )
}
