import { useEffect } from 'react'
import { getConversations } from '../../api/conversations.js'
import ConversationList from './ConversationList.jsx'
import NewChatButton from './NewChatButton.jsx'

function Sidebar({
  conversations,
  activeConversationId,
  setConversations,
  setActiveConversationId,
  onCreateConversation,
  isBusy,
}) {
  useEffect(() => {
    let isCurrent = true

    async function loadConversations() {
      const nextConversations = await getConversations()

      if (!isCurrent) {
        return
      }

      setConversations(nextConversations)
      setActiveConversationId(
        (currentConversationId) =>
          currentConversationId ?? nextConversations[0]?.id ?? null
      )
    }

    loadConversations()

    return () => {
      isCurrent = false
    }
  }, [setActiveConversationId, setConversations])

  return (
    <aside className="w-full max-w-[320px] border-b border-white/70 bg-lagoon-900/95 text-white md:border-b-0 md:border-r md:border-r-white/10">
      <div className="flex h-full flex-col gap-6 p-5 md:p-6">
        <div className="rounded-[1.75rem] border border-white/10 bg-white/10 p-5 shadow-2xl shadow-black/10 backdrop-blur">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-sand-100/80">
            Campus Chat
          </p>
          <h1 className="mt-3 text-3xl font-bold leading-tight text-white">
            Assignment-ready AI chat workspace
          </h1>
          <p className="mt-3 text-sm leading-6 text-sand-100/80">
            Use the sidebar to jump between stored conversations or start a
            fresh thread for a new weekly task.
          </p>
          <div className="mt-5">
            <NewChatButton onClick={onCreateConversation} disabled={isBusy} />
          </div>
        </div>

        <div className="min-h-0 flex-1 rounded-[1.75rem] border border-white/10 bg-white/5 p-4 backdrop-blur">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-sand-100/70">
            Conversations
          </p>
          <ConversationList
            conversations={conversations}
            activeConversationId={activeConversationId}
            onSelect={setActiveConversationId}
            isBusy={isBusy}
          />
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
