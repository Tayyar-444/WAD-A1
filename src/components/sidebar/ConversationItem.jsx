function formatDate(dateString) {
  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
  }).format(new Date(dateString))
}

function ConversationItem({ conversation, isActive, onSelect, disabled }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(conversation.id)}
      disabled={disabled}
      className={`rounded-[1.4rem] border px-4 py-4 text-left transition ${
        isActive
          ? 'border-sand-100/70 bg-sand-50 text-lagoon-900 shadow-lg shadow-black/10'
          : 'border-white/10 bg-white/5 text-white hover:border-white/25 hover:bg-white/10'
      } disabled:cursor-not-allowed disabled:opacity-60`}
    >
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-base font-semibold leading-6">
          {conversation.title}
        </h2>
        <span
          className={`shrink-0 text-xs font-medium ${
            isActive ? 'text-lagoon-700' : 'text-sand-100/70'
          }`}
        >
          {formatDate(conversation.updatedAt)}
        </span>
      </div>
      <p
        className={`mt-2 text-sm leading-6 ${
          isActive ? 'text-lagoon-700/90' : 'text-sand-100/75'
        }`}
      >
        {conversation.preview}
      </p>
    </button>
  )
}

export default ConversationItem
