/** Web Push subscription. iOS requires the PWA to be installed to the Home Screen and a user tap. */
const VAPID = import.meta.env.VITE_VAPID_PUBLIC_KEY

const b64ToBytes = (s) => {
  const p = '='.repeat((4 - (s.length % 4)) % 4)
  return Uint8Array.from(atob((s + p).replace(/-/g, '+').replace(/_/g, '/')), (c) => c.charCodeAt(0))
}

export async function enablePush() {
  if (!('serviceWorker' in navigator) || !('Notification' in window)) throw new Error('Push not supported')
  if ((await Notification.requestPermission()) !== 'granted') throw new Error('Permission denied')
  const reg = await navigator.serviceWorker.ready
  if (!VAPID) return { local: true } // no backend yet: local notifications only
  const sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: b64ToBytes(VAPID) })
  // TODO: POST JSON.stringify(sub) to your push backend so it can target this device.
  return { local: false, sub }
}

/** Local alert used by the dashboard when a new critical interface appears. */
export async function notifyLocal(title, body, tag) {
  if (Notification.permission !== 'granted') return
  const reg = await navigator.serviceWorker.ready
  reg.showNotification(title, { body, tag, icon: '/icon-192.png' })
}
