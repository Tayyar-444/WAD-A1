const conversationsDb = [
  {
    id: 'conversation-1',
    title: 'Assignment Planning',
    preview: 'Can you break week one into smaller tasks for me?',
    updatedAt: '2026-03-30T17:25:00.000Z',
  },
  {
    id: 'conversation-2',
    title: 'UI Polish',
    preview: 'Let us make the chat interface feel cleaner and warmer.',
    updatedAt: '2026-03-29T13:50:00.000Z',
  },
]

const messagesDb = [
  {
    id: 'message-1',
    conversationId: 'conversation-1',
    role: 'assistant',
    content:
      'Absolutely. Start with the repository setup, then build the static UI, and finish with the send-message interaction.',
    createdAt: '2026-03-30T17:22:00.000Z',
  },
  {
    id: 'message-2',
    conversationId: 'conversation-1',
    role: 'user',
    content:
      'Can you keep the structure simple enough for a weekly assignment?',
    createdAt: '2026-03-30T17:24:00.000Z',
  },
  {
    id: 'message-3',
    conversationId: 'conversation-1',
    role: 'assistant',
    content:
      'Yes. We can keep each feature in its own small module so every week feels like a clear upgrade instead of a rewrite.',
    createdAt: '2026-03-30T17:25:00.000Z',
  },
  {
    id: 'message-4',
    conversationId: 'conversation-2',
    role: 'user',
    content:
      'I want the layout to feel more like a real chat app and less like a homework mockup.',
    createdAt: '2026-03-29T13:46:00.000Z',
  },
  {
    id: 'message-5',
    conversationId: 'conversation-2',
    role: 'assistant',
    content:
      'A strong sidebar, softer background layers, and distinct user versus assistant bubbles will make it feel much more polished.',
    createdAt: '2026-03-29T13:48:00.000Z',
  },
  {
    id: 'message-6',
    conversationId: 'conversation-2',
    role: 'user',
    content: 'Perfect. Please keep it mobile friendly too.',
    createdAt: '2026-03-29T13:50:00.000Z',
  },
]

let conversationCounter = conversationsDb.length + 1
let messageCounter = messagesDb.length + 1

export function buildConversationId() {
  const nextId = `conversation-${conversationCounter}`
  conversationCounter += 1
  return nextId
}

export function buildMessageId() {
  const nextId = `message-${messageCounter}`
  messageCounter += 1
  return nextId
}

export function cloneValue(value) {
  return structuredClone(value)
}

export function resolveLater(value, delay = 180) {
  return new Promise((resolve) => {
    window.setTimeout(() => {
      resolve(cloneValue(value))
    }, delay)
  })
}

export { conversationsDb, messagesDb }
