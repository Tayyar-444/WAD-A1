'use client'

import { useChat } from '@ai-sdk/react'
import { useQueryClient } from '@tanstack/react-query'
import { DefaultChatTransport } from 'ai'
import { startTransition, useState } from 'react'
import { useRouter } from 'next/navigation'
import { storedMessagesToUiMessages, type ChatUiMessage } from '@/lib/chat-ui'
import type { ConversationSummary, StoredMessage } from '@/types/chat'
import { MessageList } from './MessageList'

type ChatWorkspaceProps = {
  conversation: ConversationSummary
  initialMessages: StoredMessage[]
}

export function ChatWorkspace({
  conversation,
  initialMessages,
}: ChatWorkspaceProps) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [draft, setDraft] = useState('')

  const { messages, sendMessage, status, error, clearError } =
    useChat<ChatUiMessage>({
      id: conversation.id,
      messages: storedMessagesToUiMessages(initialMessages),
      transport: new DefaultChatTransport({
        api: `/api/chat/${conversation.id}`,
      }),
      onFinish: () => {
        queryClient.invalidateQueries({
          queryKey: ['messages', conversation.id],
        })
        queryClient.invalidateQueries({ queryKey: ['conversations'] })

        startTransition(() => {
          router.refresh()
        })
      },
    })

  const isWaiting = status === 'submitted' || status === 'streaming'
  const trimmedDraft = draft.trim()

  async function submitDraft() {
    if (!trimmedDraft || isWaiting) {
      return
    }

    clearError()

    const nextDraft = trimmedDraft
    setDraft('')

    await sendMessage({
      text: nextDraft,
      metadata: {
        createdAt: new Date().toISOString(),
      },
    })
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    await submitDraft()
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      void submitDraft()
    }
  }

  return (
    <main className="flex min-h-[70vh] flex-1 flex-col bg-white/30">
      <header className="border-b border-lagoon-900/10 bg-white/70 px-4 py-5 backdrop-blur md:px-7">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-lagoon-700/70">
              Active Conversation
            </p>
            <h2 className="mt-2 text-2xl font-bold text-lagoon-900">
              {conversation.title}
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Messages stream from a server route, are stored in PostgreSQL
              through Prisma, and refresh the server-rendered sidebar as soon as
              the assistant finishes responding.
            </p>
          </div>

          <div className="inline-flex items-center gap-3 self-start rounded-full border border-lagoon-900/10 bg-white px-4 py-2 text-sm text-slate-600 shadow-sm">
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                isWaiting ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
            ></span>
            {isWaiting
              ? 'Streaming assistant reply'
              : 'Ready for your next message'}
          </div>
        </div>
      </header>

      <MessageList messages={messages} isWaiting={isWaiting} />

      <div className="border-t border-lagoon-900/10 bg-white/80 px-4 py-4 backdrop-blur md:px-7">
        {error ? (
          <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error.message}
          </div>
        ) : null}

        <form onSubmit={handleSubmit}>
          <div className="rounded-[1.8rem] border border-lagoon-900/15 bg-white p-3 shadow-sm">
            <div className="flex flex-col gap-3 md:flex-row md:items-end">
              <textarea
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={handleKeyDown}
                rows={3}
                placeholder="Ask about your assignment, architecture, or the next feature..."
                className="min-h-[96px] flex-1 rounded-[1.4rem] border border-transparent bg-sand-50 px-4 py-3 text-sm leading-7 text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-lagoon-700/20 focus:bg-white"
              />
              <button
                type="submit"
                disabled={!trimmedDraft || isWaiting}
                className="inline-flex h-12 items-center justify-center rounded-2xl bg-lagoon-900 px-6 text-sm font-semibold text-white transition hover:bg-lagoon-700 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                {isWaiting ? 'Thinking...' : 'Send'}
              </button>
            </div>
          </div>
          <p className="mt-3 text-xs leading-6 text-slate-500">
            Press Enter to send. Use Shift+Enter for a new line.
          </p>
        </form>
      </div>
    </main>
  )
}
