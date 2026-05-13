import {
  deleteConversation,
  getConversationById,
} from '@/server/data/chat-data'

export const dynamic = 'force-dynamic'

type ConversationRouteContext = {
  params: Promise<{
    conversationId: string
  }>
}

export async function GET(
  _request: Request,
  context: ConversationRouteContext
) {
  const { conversationId } = await context.params
  const conversation = await getConversationById(conversationId)

  if (!conversation) {
    return Response.json(
      {
        error: 'Conversation not found.',
      },
      { status: 404 }
    )
  }

  return Response.json(conversation)
}

export async function DELETE(
  _request: Request,
  context: ConversationRouteContext
) {
  const { conversationId } = await context.params
  const deletedConversationId = await deleteConversation(conversationId)

  if (!deletedConversationId) {
    return Response.json(
      {
        error: 'Conversation not found.',
      },
      { status: 404 }
    )
  }

  return Response.json({
    deletedConversationId,
  })
}
