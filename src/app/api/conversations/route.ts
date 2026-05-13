import { createConversation, listConversations } from '@/server/data/chat-data'

export const dynamic = 'force-dynamic'

export async function GET() {
  const conversations = await listConversations()

  return Response.json(conversations)
}

export async function POST() {
  const conversation = await createConversation()

  return Response.json(conversation, {
    status: 201,
  })
}
