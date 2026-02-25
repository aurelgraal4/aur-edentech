type InternalSession = {
  userId: string
  sequenceHash: string
  timestamp: number
  active: boolean
}

const KEY = "internal_session"

export function createSession(userId: string, sequenceHash: string) {
  const s: InternalSession = { userId, sequenceHash, timestamp: Date.now(), active: true }
  try {
    localStorage.setItem(KEY, JSON.stringify(s))
  } catch {}
  return s
}

export function getSession(): InternalSession | null {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    return JSON.parse(raw) as InternalSession
  } catch {
    return null
  }
}

export function validateSession(maxAgeMs = 1000 * 60 * 60 * 24) {
  const s = getSession()
  if (!s) return false
  if (!s.active) return false
  if (Date.now() - s.timestamp > maxAgeMs) return false
  return true
}

export function destroySession() {
  try { localStorage.removeItem(KEY) } catch {}
}

export default { createSession, getSession, validateSession, destroySession }
