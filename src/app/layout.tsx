import type { Metadata, Viewport } from 'next'
import '@fontsource/manrope/400.css'
import '@fontsource/manrope/500.css'
import '@fontsource/manrope/700.css'
import '@fontsource/space-grotesk/500.css'
import '@fontsource/space-grotesk/700.css'
import { QueryProvider } from '@/components/providers/QueryProvider'
import { ServiceWorkerRegistration } from '@/components/pwa/ServiceWorkerRegistration'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Chat Simulator',
    template: '%s | Chat Simulator',
  },
  description:
    'A Next.js chat workspace with Prisma, TanStack Query, streaming responses, and offline support.',
  applicationName: 'Chat Simulator',
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Chat Simulator',
  },
}

export const viewport: Viewport = {
  themeColor: '#11343b',
  colorScheme: 'light',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full">
        <QueryProvider>
          {children}
          <ServiceWorkerRegistration />
        </QueryProvider>
      </body>
    </html>
  )
}
