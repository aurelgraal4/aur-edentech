export type Notification = {
  id: string
  userId: string
  type: string
  title: string
  message: string
  timestamp: number
  read: boolean
}

const store: Map<string, Notification[]> = new Map()

function makeId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export function addNotification(n: Omit<Notification, "id" | "timestamp" | "read">) {
  const id = makeId()
  const ts = Date.now()
  const notif: Notification = { id, timestamp: ts, read: false, ...n }
  const list = store.get(n.userId) || []
  // prevent exact duplicates (same type + message + timestamp)
  const dup = list.find((x) => x.type === notif.type && x.message === notif.message && Math.abs(x.timestamp - notif.timestamp) < 1000)
  if (dup) return dup
  list.unshift(notif)
  store.set(n.userId, list)
  return notif
}

export function markAsRead(userId: string, notificationId: string) {
  const list = store.get(userId) || []
  const it = list.find((x) => x.id === notificationId)
  if (!it) return null
  it.read = true
  return it
}

export function getUserNotifications(userId: string) {
  return (store.get(userId) || []).slice()
}

export default { addNotification, markAsRead, getUserNotifications }
