function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

class ChatMessageElement extends HTMLElement {
  static get observedAttributes() {
    return ['role', 'content']
  }

  connectedCallback() {
    this.render()
  }

  attributeChangedCallback() {
    this.render()
  }

  render() {
    const role = this.getAttribute('role') || 'assistant'
    const content = this.getAttribute('content') || ''
    const isUser = role === 'user'

    this.className = 'block'
    this.innerHTML = `
      <div class="mb-4 flex flex-col ${isUser ? 'items-end' : 'items-start'}">
        <span class="mb-2 px-1 text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
          ${isUser ? 'You' : 'AI Assistant'}
        </span>
        <div class="max-w-[85%] rounded-[1.6rem] px-4 py-3 shadow-lg shadow-slate-900/5 md:max-w-[78%] ${
          isUser
            ? 'bg-orange-500 text-white'
            : 'border border-slate-200 bg-white text-slate-700'
        }">
          <p class="whitespace-pre-wrap text-sm leading-7 md:text-base">${escapeHtml(
            content
          )}</p>
        </div>
      </div>
    `
  }
}

if (!customElements.get('chat-message')) {
  customElements.define('chat-message', ChatMessageElement)
}

export function renderMessages(container, messages) {
  container.innerHTML = ''
  messages.forEach((message) => {
    appendMessage(container, message)
  })
}

export function appendMessage(container, message) {
  const element = document.createElement('chat-message')
  element.setAttribute('role', message.role)
  element.setAttribute('content', message.content)
  container.append(element)
  element.scrollIntoView({ behavior: 'smooth', block: 'end' })
  return element
}

export function updateMessage(element, nextContent) {
  element.setAttribute('content', nextContent)
  element.scrollIntoView({ behavior: 'smooth', block: 'end' })
}

export function setComposerState(textarea, button, isBusy) {
  textarea.disabled = isBusy
  button.disabled = isBusy
  button.textContent = isBusy ? 'Streaming...' : 'Send'
}
