import { useEffect, useState } from 'react'
import { createConversation, touchConversation } from './api/conversations.js'
import { requestAssistantReply } from './api/llm.js'
import { createMessage, getMessagesByConversationId } from './api/messages.js'
import ChatPanel from './components/chat-panel/ChatPanel.jsx'
import Sidebar from './components/sidebar/Sidebar.jsx'
import './App.css'

function sortByNewest(conversations) {
  return [...conversations].sort(
    (left, right) => new Date(right.updatedAt) - new Date(left.updatedAt)
  )
}

function App() {
  const [conversations, setConversations] = useState([])
  const [activeConversationId, setActiveConversationId] = useState(null)
  const [messages, setMessages] = useState([])
  const [isThinking, setIsThinking] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')

  useEffect(() => {
    let isCurrent = true

    async function loadMessages() {
      if (!activeConversationId) {
        setMessages([])
        return
      }

      const nextMessages =
        await getMessagesByConversationId(activeConversationId)

      if (isCurrent) {
        setMessages(nextMessages)
      }
    }

    loadMessages()

    return () => {
      isCurrent = false
    }
  }, [activeConversationId])

  function mergeConversation(updatedConversation) {
    setConversations((currentConversations) =>
      sortByNewest([
        updatedConversation,
        ...currentConversations.filter(
          (conversation) => conversation.id !== updatedConversation.id
        ),
      ])
    )
  }

  async function handleCreateConversation() {
    const newConversation = await createConversation()

    setConversations((currentConversations) =>
      sortByNewest([newConversation, ...currentConversations])
    )
    setActiveConversationId(newConversation.id)
    setMessages([])
    setStatusMessage('')
  }

  async function handleSendMessage(content) {
    setStatusMessage('')

    let conversationId = activeConversationId
    let currentMessages =
      conversationId === activeConversationId ? messages : []

    if (!conversationId) {
      const newConversation = await createConversation()

      conversationId = newConversation.id
      currentMessages = []

      setConversations((currentConversations) =>
        sortByNewest([newConversation, ...currentConversations])
      )
      setActiveConversationId(newConversation.id)
    }

    const userMessage = await createMessage({
      conversationId,
      role: 'user',
      content,
    })

    const nextMessages = [...currentMessages, userMessage]
    setMessages(nextMessages)

    const userConversation = await touchConversation(conversationId, content)
    mergeConversation(userConversation)

    setIsThinking(true)

    try {
      const assistantReply = await requestAssistantReply(nextMessages)
      const assistantMessage = await createMessage({
        conversationId,
        role: 'assistant',
        content: assistantReply,
      })

      setMessages((currentMessagesInState) => [
        ...currentMessagesInState,
        assistantMessage,
      ])

      const assistantConversation = await touchConversation(
        conversationId,
        assistantReply
      )
      mergeConversation(assistantConversation)
    } catch (error) {
      setStatusMessage(
        error instanceof Error
          ? error.message
          : 'Something went wrong while contacting OpenRouter.'
      )
    } finally {
      setIsThinking(false)
    }
  }

  const activeConversation =
    conversations.find(
      (conversation) => conversation.id === activeConversationId
    ) ?? null

  return (
    <div className="app-shell min-h-screen px-4 py-5 md:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-2.5rem)] max-w-7xl overflow-hidden rounded-[2rem] border border-white/70 bg-white/75 shadow-panel backdrop-blur-xl">
        <Sidebar
          conversations={conversations}
          activeConversationId={activeConversationId}
          setConversations={setConversations}
          setActiveConversationId={setActiveConversationId}
          onCreateConversation={handleCreateConversation}
          isBusy={isThinking}
        />
        <ChatPanel
          activeConversation={activeConversation}
          messages={messages}
          onSendMessage={handleSendMessage}
          isThinking={isThinking}
          statusMessage={statusMessage}
        />
      </div>
    </div>
  )
}

export default App
