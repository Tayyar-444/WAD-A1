function LoadingIndicator() {
  return (
    <div className="message-fade flex flex-col items-start">
      <span className="mb-2 px-1 text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
        AI Assistant
      </span>
      <div className="rounded-[1.6rem] border border-lagoon-900/10 bg-white px-5 py-4 shadow-lg shadow-slate-900/5">
        <div className="flex items-center gap-2">
          <span className="typing-dot h-2.5 w-2.5 rounded-full bg-lagoon-700"></span>
          <span className="typing-dot h-2.5 w-2.5 rounded-full bg-lagoon-700"></span>
          <span className="typing-dot h-2.5 w-2.5 rounded-full bg-lagoon-700"></span>
        </div>
      </div>
    </div>
  )
}

export default LoadingIndicator
