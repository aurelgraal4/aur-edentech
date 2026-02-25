export type RiskProfile = {
  userId: string
  score: number
  flags: string[]
  lastUpdate: number
  flagged?: boolean
}

const store: Map<string, RiskProfile> = new Map()

export function updateRisk(userId: string, score: number, flags: string[] = []) {
  const now = Date.now()
  const existing = store.get(userId) || { userId, score: 0, flags: [], lastUpdate: now, flagged: false }
  const next: RiskProfile = { ...existing, score, flags, lastUpdate: now }
  next.flagged = next.score >= 70
  store.set(userId, next)
  return next
}

export function getRisk(userId: string) {
  return store.get(userId) ?? null
}

export function flagUser(userId: string, reason?: string) {
  const p = store.get(userId) || { userId, score: 100, flags: [], lastUpdate: Date.now(), flagged: true }
  if (reason) p.flags = Array.from(new Set([...(p.flags || []), reason]))
  p.flagged = true
  p.lastUpdate = Date.now()
  store.set(userId, p)
  return p
}

export function getAllRisks() {
  return Array.from(store.values())
}

export default { updateRisk, getRisk, flagUser, getAllRisks }
