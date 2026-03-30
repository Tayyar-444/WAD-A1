import ChatHeader from './ChatHeader.jsx'
import ChatInputForm from './ChatInputForm.jsx'
import MessageList from './MessageList.jsx'

function ChatPanel({
  activeConversation,
  messages,
  onSendMessage,
  isThinking,
  statusMessage,
}) {
  return (
    <main className="flex min-h-[70vh] flex-1 flex-col bg-white/30">
      <ChatHeader
        activeConversation={activeConversation}
        isThinking={isThinking}
      />
      <MessageList messages={messages} isThinking={isThinking} />

      <div className="border-t border-lagoon-900/10 bg-white/80 px-4 py-4 backdrop-blur md:px-7">
        {statusMessage ? (
          <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {statusMessage}
          </div>
        ) : null}

        <ChatInputForm onSendMessage={onSendMessage} isThinking={isThinking} />
      </div>
    </main>
  )
}

export default ChatPanel
