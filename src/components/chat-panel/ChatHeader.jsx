function ChatHeader({ activeConversation, isThinking }) {
  return (
    <header className="border-b border-lagoon-900/10 bg-white/70 px-4 py-5 backdrop-blur md:px-7">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-lagoon-700/70">
            Active Conversation
          </p>
          <h2 className="mt-2 text-2xl font-bold text-lagoon-900">
            {activeConversation?.title || 'Fresh conversation'}
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            Send a prompt to the mock API layer first, then let OpenRouter
            produce the assistant reply for the current chat.
          </p>
        </div>

        <div className="inline-flex items-center gap-3 self-start rounded-full border border-lagoon-900/10 bg-white px-4 py-2 text-sm text-slate-600 shadow-sm">
          <span
            className={`h-2.5 w-2.5 rounded-full ${
              isThinking ? 'bg-amber-500' : 'bg-emerald-500'
            }`}
          ></span>
          {isThinking ? 'Waiting for AI reply' : 'Ready for your next message'}
        </div>
      </div>
    </header>
  )
}

export default ChatHeader
