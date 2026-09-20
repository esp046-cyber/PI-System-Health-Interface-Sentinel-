/* Service worker: offline app shell + Web Push (iOS 16.4+ installed PWAs). */
import { precacheAndRoute } from 'workbox-precaching'

// Injected at build time by vite-plugin-pwa
precacheAndRoute(self.__WB_MANIFEST)

self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()))

// Payload example: { "title": "PI Interface OFFLINE", "body": "OPC_Unit3 lost", "tag": "OPC_Unit3", "url": "/" }
self.addEventListener('push', (event) => {
  let data = { title: 'PI Sentinel', body: 'Critical interface failure' }
  try { data = { ...data, ...event.data.json() } } catch { /* plain text or empty */ }
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      tag: data.tag,            // collapses repeat alerts for the same interface
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      data: { url: data.url || '/' },
    })
  )
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const url = event.notification.data?.url || '/'
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
      for (const c of list) if ('focus' in c) return c.focus()
      return self.clients.openWindow(url)
    })
  )
})
