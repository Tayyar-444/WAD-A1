import { useEffect, useRef } from 'react'
import LoadingIndicator from './LoadingIndicator.jsx'
import MessageBubble from './MessageBubble.jsx'

function MessageList({ messages, isThinking }) {
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
    })
  }, [messages, isThinking])

  return (
    <section className="chat-scroll flex-1 overflow-y-auto px-4 py-6 md:px-7">
      <div className="mx-auto flex max-w-3xl flex-col gap-4">
        {messages.length === 0 ? (
          <div className="rounded-[1.8rem] border border-dashed border-lagoon-900/15 bg-white/70 px-6 py-10 text-center shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-lagoon-700/60">
              No messages yet
            </p>
            <p className="mt-3 text-base leading-7 text-slate-600">
              Start with a question about your weekly assignment, project plan,
              or UI ideas and the conversation will appear here.
            </p>
          </div>
        ) : null}

        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}

        {isThinking ? <LoadingIndicator /> : null}
        <div ref={bottomRef}></div>
      </div>
    </section>
  )
}

export default MessageList
