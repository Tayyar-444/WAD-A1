import { ConversationSidebar } from '@/components/sidebar/ConversationSidebar'
import { listConversations } from '@/server/data/chat-data'

export const dynamic = 'force-dynamic'

export default async function ChatShellLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const conversations = await listConversations()

  return (
    <div className="app-shell min-h-screen px-4 py-5 md:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-2.5rem)] max-w-7xl overflow-hidden rounded-[2rem] border border-white/70 bg-white/75 shadow-[0_32px_80px_-42px_rgba(17,52,59,0.45)] backdrop-blur-xl">
        <ConversationSidebar initialConversations={conversations} />
        {children}
      </div>
    </div>
  )
}
