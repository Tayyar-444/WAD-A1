function formatTime(dateString) {
  return new Intl.DateTimeFormat(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateString))
}

function MessageBubble({ message }) {
  const isUser = message.role === 'user'

  return (
    <article
      className={`message-fade flex flex-col ${
        isUser ? 'items-end' : 'items-start'
      }`}
    >
      <span className="mb-2 px-1 text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
        {isUser ? 'You' : 'AI Assistant'}
      </span>

      <div
        className={`max-w-[85%] rounded-[1.6rem] px-4 py-3 shadow-lg shadow-slate-900/5 md:max-w-[78%] md:px-5 md:py-4 ${
          isUser
            ? 'bg-ember-500 text-white'
            : 'border border-lagoon-900/10 bg-white text-slate-700'
        }`}
      >
        <p className="whitespace-pre-wrap text-sm leading-7 md:text-base">
          {message.content}
        </p>
      </div>

      <span className="mt-2 px-1 text-xs text-slate-400">
        {formatTime(message.createdAt)}
      </span>
    </article>
  )
}

export default MessageBubble
