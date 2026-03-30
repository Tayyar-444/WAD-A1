import ConversationItem from './ConversationItem.jsx'

function ConversationList({
  conversations,
  activeConversationId,
  onSelect,
  isBusy,
}) {
  if (conversations.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-white/20 px-4 py-5 text-sm leading-6 text-sand-100/70">
        Loading conversations...
      </div>
    )
  }

  return (
    <div className="flex max-h-full flex-col gap-3 overflow-y-auto pr-1">
      {conversations.map((conversation) => (
        <ConversationItem
          key={conversation.id}
          conversation={conversation}
          isActive={conversation.id === activeConversationId}
          onSelect={onSelect}
          disabled={isBusy}
        />
      ))}
    </div>
  )
}

export default ConversationList
