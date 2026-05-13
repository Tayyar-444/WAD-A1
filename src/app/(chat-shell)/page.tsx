export const dynamic = 'force-dynamic'

export default function HomePage() {
  return (
    <main className="flex min-h-[70vh] flex-1 items-center justify-center bg-white/35 px-5 py-8 md:px-8">
      <section className="max-w-2xl rounded-[2rem] border border-lagoon-900/10 bg-white/80 px-7 py-10 text-center shadow-lg shadow-slate-900/5 backdrop-blur">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-lagoon-700/70">
          Welcome
        </p>
        <h1 className="mt-4 text-4xl font-bold text-lagoon-900">
          Your chat workspace is ready.
        </h1>
        <p className="mt-4 text-base leading-8 text-slate-600">
          Pick an existing conversation from the sidebar or create a new one to
          start talking with the assistant. This version now runs on Next.js,
          stores data in PostgreSQL through Prisma, streams responses with the
          AI SDK, and keeps an offline fallback ready for installable PWA use.
        </p>
      </section>
    </main>
  )
}
