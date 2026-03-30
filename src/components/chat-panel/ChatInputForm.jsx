import { useState } from 'react'

function ChatInputForm({ onSendMessage, isThinking }) {
  const [draft, setDraft] = useState('')

  const trimmedDraft = draft.trim()

  function submitDraft() {
    if (!trimmedDraft || isThinking) {
      return
    }

    onSendMessage(trimmedDraft)
    setDraft('')
  }

  function handleSubmit(event) {
    event.preventDefault()
    submitDraft()
  }

  function handleKeyDown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      submitDraft()
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="rounded-[1.8rem] border border-lagoon-900/15 bg-white p-3 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-end">
          <textarea
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={handleKeyDown}
            rows="3"
            placeholder="Ask about your assignment, UI, or next development step..."
            className="min-h-[96px] flex-1 rounded-[1.4rem] border border-transparent bg-sand-50 px-4 py-3 text-sm leading-7 text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-lagoon-700/20 focus:bg-white"
          />
          <button
            type="submit"
            disabled={!trimmedDraft || isThinking}
            className="inline-flex h-12 items-center justify-center rounded-2xl bg-lagoon-900 px-6 text-sm font-semibold text-white transition hover:bg-lagoon-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {isThinking ? 'Thinking...' : 'Send'}
          </button>
        </div>
      </div>
      <p className="mt-3 text-xs leading-6 text-slate-500">
        Press Enter to send. Use Shift+Enter for a new line.
      </p>
    </form>
  )
}

export default ChatInputForm
