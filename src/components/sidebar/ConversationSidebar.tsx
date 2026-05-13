'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { startTransition, useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import {
  createConversationRequest,
  deleteConversationRequest,
} from '@/lib/api-client'
import type { ConversationSummary } from '@/types/chat'

type ConversationSidebarProps = {
  initialConversations: ConversationSummary[]
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
  }).format(new Date(value))
}

function getActiveConversationId(pathname: string) {
  if (!pathname.startsWith('/chat/')) {
    return null
  }

  return pathname.split('/').at(-1) ?? null
}

export function ConversationSidebar({
  initialConversations,
}: ConversationSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const queryClient = useQueryClient()
  const [conversations, setConversations] =
    useState<ConversationSummary[]>(initialConversations)

  useEffect(() => {
    setConversations(initialConversations)
  }, [initialConversations])

  const activeConversationId = getActiveConversationId(pathname)

  const createConversationMutation = useMutation({
    mutationFn: createConversationRequest,
    onMutate: async () => {
      const previous = conversations
      const now = new Date().toISOString()

      setConversations((current) => [
        {
          id: `temp-${now}`,
          title: 'New Chat',
          preview: 'Setting up a fresh conversation...',
          createdAt: now,
          updatedAt: now,
        },
        ...current,
      ])

      return { previous }
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) {
        setConversations(context.previous)
      }
    },
    onSuccess: (conversation) => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] })

      startTransition(() => {
        router.push(`/chat/${conversation.id}`)
        router.refresh()
      })
    },
  })

  const deleteConversationMutation = useMutation({
    mutationFn: deleteConversationRequest,
    onMutate: async (conversationId: string) => {
      const previous = conversations
      const nextConversations = previous.filter(
        (conversation) => conversation.id !== conversationId
      )

      setConversations(nextConversations)

      if (conversationId === activeConversationId) {
        const nextDestination = nextConversations[0]
          ? `/chat/${nextConversations[0].id}`
          : '/'

        startTransition(() => {
          router.push(nextDestination)
        })
      }

      return { previous }
    },
    onError: (_error, _conversationId, context) => {
      if (context?.previous) {
        setConversations(context.previous)
      }

      startTransition(() => {
        router.refresh()
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] })

      startTransition(() => {
        router.refresh()
      })
    },
  })

  const isBusy =
    createConversationMutation.isPending || deleteConversationMutation.isPending

  return (
    <aside className="w-full max-w-[320px] border-b border-white/70 bg-lagoon-900/95 text-white md:border-b-0 md:border-r md:border-r-white/10">
      <div className="flex h-full flex-col gap-6 p-5 md:p-6">
        <div className="rounded-[1.75rem] border border-white/10 bg-white/10 p-5 shadow-2xl shadow-black/10 backdrop-blur">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-sand-100/80">
            Chat Simulator
          </p>
          <h1 className="mt-3 text-3xl font-bold leading-tight text-white">
            Next.js AI chat workspace
          </h1>
          <p className="mt-3 text-sm leading-6 text-sand-100/80">
            Create chats instantly, stream replies from the server, and keep
            your conversation list synced with the database.
          </p>
          <button
            type="button"
            onClick={() => createConversationMutation.mutate()}
            disabled={isBusy}
            className="mt-5 inline-flex w-full items-center justify-center rounded-2xl bg-ember-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-ember-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            New Chat
          </button>
        </div>

        <div className="min-h-0 flex-1 rounded-[1.75rem] border border-white/10 bg-white/5 p-4 backdrop-blur">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-sand-100/70">
            Conversations
          </p>

          {conversations.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/20 px-4 py-5 text-sm leading-6 text-sand-100/70">
              No conversations yet. Create one to begin chatting.
            </div>
          ) : (
            <div className="flex max-h-full flex-col gap-3 overflow-y-auto pr-1">
              {conversations.map((conversation) => {
                const isActive = conversation.id === activeConversationId

                return (
                  <div
                    key={conversation.id}
                    className={`rounded-[1.4rem] border px-4 py-4 text-left transition ${
                      isActive
                        ? 'border-sand-100/70 bg-sand-50 text-lagoon-900 shadow-lg shadow-black/10'
                        : 'border-white/10 bg-white/5 text-white hover:border-white/25 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <button
                        type="button"
                        onClick={() => router.push(`/chat/${conversation.id}`)}
                        disabled={isBusy}
                        className="flex-1 text-left disabled:cursor-not-allowed"
                      >
                        <span className="block text-base font-semibold leading-6">
                          {conversation.title}
                        </span>
                        <span
                          className={`mt-2 block text-sm leading-6 ${
                            isActive ? 'text-lagoon-700/90' : 'text-sand-100/75'
                          }`}
                        >
                          {conversation.preview}
                        </span>
                      </button>

                      <div className="flex shrink-0 flex-col items-end gap-3">
                        <span
                          className={`text-xs font-medium ${
                            isActive ? 'text-lagoon-700' : 'text-sand-100/70'
                          }`}
                        >
                          {formatDate(conversation.updatedAt)}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            deleteConversationMutation.mutate(conversation.id)
                          }
                          disabled={isBusy}
                          className={`rounded-full px-2 py-1 text-xs font-semibold transition ${
                            isActive
                              ? 'bg-lagoon-900/10 text-lagoon-700 hover:bg-lagoon-900/15'
                              : 'bg-white/10 text-sand-100/80 hover:bg-white/20'
                          } disabled:cursor-not-allowed disabled:opacity-60`}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}
