'use client'

import { useEffect, useRef } from 'react'
import type { ChatUiMessage } from '@/lib/chat-ui'
import { LoadingDots } from './LoadingDots'
import { MessageBubble } from './MessageBubble'

type MessageListProps = {
  messages: ChatUiMessage[]
  isWaiting: boolean
}

export function MessageList({ messages, isWaiting }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
    })
  }, [messages, isWaiting])

  return (
    <section className="chat-scroll flex-1 overflow-y-auto px-4 py-6 md:px-7">
      <div className="mx-auto flex max-w-3xl flex-col gap-4">
        {messages.length === 0 ? (
          <div className="rounded-[1.8rem] border border-dashed border-lagoon-900/15 bg-white/70 px-6 py-10 text-center shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-lagoon-700/60">
              No messages yet
            </p>
            <p className="mt-3 text-base leading-7 text-slate-600">
              Send your first message and the server will stream the assistant
              reply right into this conversation.
            </p>
          </div>
        ) : null}

        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}

        {isWaiting ? <LoadingDots /> : null}
        <div ref={bottomRef}></div>
      </div>
    </section>
  )
}
