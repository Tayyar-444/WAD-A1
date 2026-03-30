import { streamAssistantReply } from './api.js'
import {
  appendMessage,
  renderMessages,
  setComposerState,
  updateMessage,
} from './chat.js'

const form = document.querySelector('[data-chat-form]')
const input = document.querySelector('[data-chat-input]')
const sendButton = document.querySelector('[data-send-button]')
const messageList = document.querySelector('[data-message-list]')

const messages = [
  {
    role: 'assistant',
    content: 'Welcome back. What do you need help building for this week?',
  },
  {
    role: 'user',
    content: 'I need a clean starting point for an AI chat assignment.',
  },
  {
    role: 'assistant',
    content:
      'Perfect. This legacy folder keeps the plain HTML, CSS, and JavaScript version available while the React app lives separately.',
  },
]

renderMessages(messageList, messages)

function focusComposer() {
  input.focus()
}

function submitMessage(content) {
  const userMessage = {
    role: 'user',
    content,
  }

  messages.push(userMessage)
  appendMessage(messageList, userMessage)
}

form.addEventListener('submit', async (event) => {
  event.preventDefault()

  const content = input.value.trim()

  if (!content) {
    return
  }

  submitMessage(content)
  input.value = ''
  setComposerState(input, sendButton, true)

  const assistantBubble = appendMessage(messageList, {
    role: 'assistant',
    content: '',
  })

  try {
    const assistantReply = await streamAssistantReply(
      messages,
      (partialReply) => {
        updateMessage(assistantBubble, partialReply)
      }
    )

    messages.push({
      role: 'assistant',
      content: assistantReply,
    })
  } catch (error) {
    const fallbackMessage =
      error instanceof Error
        ? error.message
        : 'Something went wrong while streaming the assistant reply.'

    updateMessage(assistantBubble, fallbackMessage)
    messages.push({
      role: 'assistant',
      content: fallbackMessage,
    })
  } finally {
    setComposerState(input, sendButton, false)
    focusComposer()
  }
})

input.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    form.requestSubmit()
  }
})

focusComposer()
