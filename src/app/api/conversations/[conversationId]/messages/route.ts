import {
  createMessage,
  getConversationById,
  listMessagesByConversationId,
} from '@/server/data/chat-data'
import type { MessageRole } from '@/types/chat'

export const dynamic = 'force-dynamic'

type MessageRouteContext = {
  params: Promise<{
    conversationId: string
  }>
}

export async function GET(_request: Request, context: MessageRouteContext) {
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

  const messages = await listMessagesByConversationId(conversationId)

  return Response.json(messages)
}

export async function POST(request: Request, context: MessageRouteContext) {
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

  const body = (await request.json()) as {
    role?: MessageRole
    content?: string
  }

  if (
    (body.role !== 'user' && body.role !== 'assistant') ||
    typeof body.content !== 'string'
  ) {
    return Response.json(
      {
        error: 'A valid role and content are required.',
      },
      { status: 400 }
    )
  }

  const message = await createMessage(conversationId, body.role, body.content)

  return Response.json(message, {
    status: 201,
  })
}
