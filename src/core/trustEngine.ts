import { subscribe, Events } from "./eventBus"
import { subscribeActivities, logActivity, getUserStats, getUserFeed, registerUser } from "./activityEngine"
import { spendTokens, getBalance } from "./wallet"

type ActionType = "POST_CREATED" | "POST_VOTED" | "MISSION_COMPLETED" | "TOKENS_EARNED" | string

type CheckResult = {
  allowed: boolean
  allowTokens: boolean
  reductionFactor: number // 1.0 = full, 0 = blocked
  reason?: string
}

const LIMITS: Record<string, number> = {
  POST_CREATED: 20,
  POST_VOTED: 100,
  MISSION_COMPLETED: 10,
  TOKENS_EARNED: 200,
}

// per-user action history (timestamps in ms)
const userActions: Map<string, Map<string, number[]>> = new Map()
const userTokenEarnings: Map<string, { amount: number; ts: number }[]> = new Map()

// trust scores: 0..100 default 100
const trustScores: Map<string, number> = new Map()
const flaggedUsers: Set<string> = new Set()

function now() {
  return Date.now()
}

function pruneOld(arr: number[], windowMs: number) {
  const cutoff = now() - windowMs
  while (arr.length && arr[0] < cutoff) arr.shift()
}

function getActionList(userId: string, action: string) {
  if (!userActions.has(userId)) userActions.set(userId, new Map())
  const map = userActions.get(userId)!
  if (!map.has(action)) map.set(action, [])
  return map.get(action)!
}

export function getTrust(userId: string) {
  return trustScores.get(userId) ?? 100
}

export function updateTrust(userId: string, delta: number) {
  const cur = getTrust(userId)
  const next = Math.max(0, Math.min(100, cur + delta))
  trustScores.set(userId, next)
  if (next < 20) flaggedUsers.add(userId)
  if (next >= 20) flaggedUsers.delete(userId)
  try {
    logActivity("TRUST_UPDATED", { delta, trust: next }, { id: userId, username: userId })
  } catch {}
  return next
}

export function checkAction(userId: string, actionType: ActionType, amount = 0): CheckResult {
  const ts = now()
  const dayMs = 1000 * 60 * 60 * 24

  // prune and compute counts
  const list = getActionList(userId, actionType)
  pruneOld(list, dayMs)
  const count = list.length

  // tokens special: sum amounts
  if (actionType === "TOKENS_EARNED") {
    const arr = userTokenEarnings.get(userId) || []
    const cutoff = ts - dayMs
    const sum = arr.filter((t) => t.ts >= cutoff).reduce((s, t) => s + t.amount, 0) + amount
    if (sum > (LIMITS.TOKENS_EARNED ?? Infinity)) {
      // too many tokens
      const trust = getTrust(userId)
      const allowTokens = trust > 50
      const reductionFactor = trust > 80 ? 1 : trust > 50 ? 0.5 : 0
      return { allowed: true, allowTokens, reductionFactor, reason: "TOKENS_LIMIT_EXCEEDED" }
    }
    return { allowed: true, allowTokens: true, reductionFactor: 1 }
  }

  const limit = LIMITS[actionType] ?? Infinity
  const trust = getTrust(userId)

  // spam / burst detection: if last 5 same actions within 10s -> reduce trust
  const recentWindow = 1000 * 10
  const recent = list.filter((t) => t >= ts - recentWindow)
  if (recent.length >= 5) {
    updateTrust(userId, -5)
    logActivity("SECURITY_FLAG", { reason: "rapid_repeat", actionType }, { id: userId, username: userId })
  }

  if (count >= limit) {
    // exceeded
    const allowTokens = trust > 50
    const reductionFactor = trust > 80 ? 1 : trust > 50 ? 0.5 : 0
    updateTrust(userId, -2)
    logActivity("SECURITY_FLAG", { reason: "limit_exceeded", actionType, count, limit }, { id: userId, username: userId })
    return { allowed: false, allowTokens, reductionFactor, reason: "limit_exceeded" }
  }

  // trust score effects
  if (trust < 50) {
    const reductionFactor = trust >= 20 ? 0.5 : 0
    return { allowed: true, allowTokens: false, reductionFactor, reason: "low_trust" }
  }

  return { allowed: true, allowTokens: true, reductionFactor: 1 }
}

// Record action after it's accepted (or to keep history for checks)
function recordAction(userId: string, actionType: ActionType, amount = 0) {
  const ts = now()
  const list = getActionList(userId, actionType)
  list.push(ts)
  // keep list ordered ascending for prune efficiency
  if (actionType === "TOKENS_EARNED") {
    if (!userTokenEarnings.has(userId)) userTokenEarnings.set(userId, [])
    userTokenEarnings.get(userId)!.push({ amount, ts })
  }
}

// react to EventBus events: preliminary checks
subscribe(Events.POST_CREATED, (e) => {
  const uid = e.userId || e.payload?.userId || e.payload?.authorId
  if (!uid) return
  const res = checkAction(uid, "POST_CREATED")
  if (!res.allowed) {
    // reduce trust already handled in checkAction
    return
  }
  // record provisional action
  recordAction(uid, "POST_CREATED")
})

subscribe(Events.POST_VOTED, (e) => {
  const uid = e.userId || e.payload?.userId || e.payload?.voterId
  if (!uid) return
  const res = checkAction(uid, "POST_VOTED")
  if (!res.allowed) return
  recordAction(uid, "POST_VOTED")
})

subscribe(Events.MISSION_COMPLETED, (e) => {
  const uid = e.userId || e.payload?.userId || e.payload?.assigneeId
  if (!uid) return
  const res = checkAction(uid, "MISSION_COMPLETED")
  if (!res.allowed) return
  recordAction(uid, "MISSION_COMPLETED")
})

subscribe(Events.GOV_PROPOSAL_CREATED, (e) => {
  const uid = e.userId || e.payload?.userId
  if (!uid) return
  // small check
  recordAction(uid, "PROPOSAL_CREATED")
})

subscribe(Events.GOV_VOTE_CAST, (e) => {
  const uid = e.userId || e.payload?.userId
  if (!uid) return
  recordAction(uid, "PROPOSAL_VOTE")
})

// watch activityEngine token earnings to enforce token daily cap and reverse excess
subscribeActivities((a) => {
  try {
    if (a.type === "TOKENS_EARNED") {
      const uid = a.user?.id
      if (!uid) return
      const amount = a.data?.amount ?? 0
      // record token earning
      recordAction(uid, "TOKENS_EARNED", amount)
      // compute sum in last 24h
      const arr = userTokenEarnings.get(uid) || []
      const cutoff = now() - 1000 * 60 * 60 * 24
      const sum = arr.filter((t) => t.ts >= cutoff).reduce((s, t) => s + t.amount, 0)
      const cap = LIMITS.TOKENS_EARNED
      if (sum > cap) {
        const excess = sum - cap
        // remove excess tokens from user balance
        try {
          spendTokens(uid, excess, "anti_abuse_reversal")
        } catch {}
        updateTrust(uid, -5)
        logActivity("SECURITY_FLAG", { reason: "tokens_cap_exceeded", sum, cap, excess }, { id: uid, username: uid })
      }
    }
  } catch (e) {
    // swallow
  }
})

export default { checkAction, updateTrust, getTrust }
