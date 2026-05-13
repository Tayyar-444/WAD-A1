import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Chat Simulator',
    short_name: 'ChatSim',
    description:
      'A streaming AI chat application built with Next.js, Prisma, and the Vercel AI SDK.',
    start_url: '/',
    display: 'standalone',
    background_color: '#f7f1e7',
    theme_color: '#11343b',
    icons: [
      {
        src: '/icon',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/apple-icon',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  }
}
