import { createOpenRouter } from '@openrouter/ai-sdk-provider'
import { convertToModelMessages, streamText, type UIMessage } from 'ai'
import { getTextFromUiMessage, storedMessagesToUiMessages } from '@/lib/chat-ui'
import {
  createMessage,
  getConversationById,
  listMessagesByConversationId,
} from '@/server/data/chat-data'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

type ChatRouteContext = {
  params: Promise<{
    conversationId: string
  }>
}

const openrouterApiKey = process.env.OPENROUTER_API_KEY
const openrouterModel = process.env.OPENROUTER_MODEL || 'openrouter/auto'

export async function POST(request: Request, context: ChatRouteContext) {
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

  if (!openrouterApiKey) {
    return Response.json(
      {
        error:
          'Missing OPENROUTER_API_KEY. Add it to .env.local or your Vercel environment settings.',
      },
      { status: 500 }
    )
  }

  const body = (await request.json()) as {
    messages?: UIMessage[]
  }

  const lastUserMessage = body.messages
    ?.slice()
    .reverse()
    .find((message) => message.role === 'user')

  const userText = lastUserMessage ? getTextFromUiMessage(lastUserMessage) : ''

  if (!userText) {
    return Response.json(
      {
        error: 'The latest user message was empty.',
      },
      { status: 400 }
    )
  }

  await createMessage(conversationId, 'user', userText)

  const persistedMessages = await listMessagesByConversationId(conversationId)
  const originalMessages = storedMessagesToUiMessages(persistedMessages)

  const openrouter = createOpenRouter({
    apiKey: openrouterApiKey,
  })

  const result = streamText({
    model: openrouter.chat(openrouterModel),
    messages: convertToModelMessages(
      originalMessages.map(({ role, metadata, parts }) => ({
        role,
        metadata,
        parts,
      }))
    ),
  })

  return result.toUIMessageStreamResponse({
    originalMessages,
    onFinish: async ({ responseMessage, isAborted }) => {
      if (isAborted) {
        return
      }

      const assistantText = getTextFromUiMessage(responseMessage)

      if (assistantText) {
        await createMessage(conversationId, 'assistant', assistantText)
      }
    },
    onError: (error) =>
      error instanceof Error
        ? error.message
        : 'The assistant response could not be completed.',
  })
}
