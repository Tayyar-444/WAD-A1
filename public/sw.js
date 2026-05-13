const CACHE_NAME = 'chat-simulator-shell-v1'
const PRECACHE_URLS = [
  '/',
  '/manifest.webmanifest',
  '/icon',
  '/apple-icon',
  '/offline.html',
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME)

      await Promise.allSettled(
        PRECACHE_URLS.map(async (url) => {
          const response = await fetch(url, { cache: 'no-store' })

          if (response.ok) {
            await cache.put(url, response.clone())
          }
        })
      )

      await self.skipWaiting()
    })()
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const cacheNames = await caches.keys()

      await Promise.all(
        cacheNames
          .filter((cacheName) => cacheName !== CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName))
      )

      await self.clients.claim()
    })()
  )
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  if (request.method !== 'GET') {
    return
  }

  if (url.pathname.startsWith('/api/')) {
    return
  }

  if (request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          return await fetch(request)
        } catch {
          const cache = await caches.open(CACHE_NAME)
          const offlinePage = await cache.match('/offline.html')

          return offlinePage || Response.error()
        }
      })()
    )

    return
  }

  event.respondWith(
    (async () => {
      const cachedResponse = await caches.match(request)

      if (cachedResponse) {
        return cachedResponse
      }

      try {
        const networkResponse = await fetch(request)

        if (networkResponse.ok && url.origin === self.location.origin) {
          const cache = await caches.open(CACHE_NAME)
          await cache.put(request, networkResponse.clone())
        }

        return networkResponse
      } catch {
        return Response.error()
      }
    })()
  )
})
