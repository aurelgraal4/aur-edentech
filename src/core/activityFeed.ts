import { getGlobalFeed, subscribeActivities } from "./activityEngine"
import { getRecentActivities as getSimpleRecent } from "./activity"

export type UnifiedActivity = {
  id: string
  type: string
  user?: { id?: string; username?: string }
  action: string
  context?: any
  reward?: string | number
  timestamp: string
}

let cache: UnifiedActivity[] = []

function mapEngine(a: any): UnifiedActivity {
  const t = a.type
  let action = t
  let context = a.data
  let reward: any = undefined

  switch (t) {
    case "POST_CREATED":
      action = "created a post"
      break
    case "MISSION_COMPLETED":
      action = `completed mission ${a.data?.missionId ?? ""}`
      reward = a.data?.reward
      break
    case "PROPOSAL_CREATED":
      action = `created proposal`
      context = a.data
      break
    case "PROPOSAL_VOTE":
    case "VOTE_CAST":
      action = `voted`
      context = a.data
      break
    case "BADGE_EARNED":
      action = `earned badge ${a.data?.badgeId ?? ""}`
      break
    case "TOKENS_EARNED":
    case "TOKENS_AWARDED":
      action = `earned tokens`
      reward = a.data?.amount
      break
    default:
      action = t
  }

  return {
    id: a.id,
    type: a.type,
    user: a.user,
    action,
    context,
    reward,
    timestamp: a.timestamp,
  }
}

function mapSimple(a: any): UnifiedActivity {
  return {
    id: a.id,
    type: a.type,
    action: a.description || a.type,
    timestamp: a.timestamp,
  }
}

export function getFeed(limit = 50) {
  // build from engine and simple activity logs
  const engine = getGlobalFeed().map(mapEngine)
  const simple = getSimpleRecent(50).map(mapSimple)

  const merged = [...engine, ...simple]
  // dedupe by id
  const seen = new Set<string>()
  const combined = merged.filter((m) => {
    if (seen.has(m.id)) return false
    seen.add(m.id)
    return true
  })
  // sort newest first
  combined.sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1))
  const limited = combined.slice(0, limit)
  cache = limited
  return limited
}

export function subscribeFeed(cb: (items: UnifiedActivity[]) => void) {
  // push initial
  cb(getFeed())
  // subscribe to engine events for real-time updates
  const unsubEngine = subscribeActivities((a) => {
    // prepend mapped activity
    const mapped = mapEngine(a)
    cache = [mapped, ...cache].slice(0, 50)
    cb(cache)
  })

  // also poll simple activity log (fallback)
  let stopped = false
  let lastSimple = new Set(getSimpleRecent(50).map((s:any) => s.id))
  const interval = setInterval(() => {
    if (stopped) return
    const recent = getSimpleRecent(50)
    const added = recent.filter((r:any) => !lastSimple.has(r.id)).map(mapSimple)
    if (added.length) {
      lastSimple = new Set(recent.map((r:any) => r.id))
      cache = [...added, ...cache].slice(0, 50)
      cb(cache)
    }
  }, 1500)

  return () => {
    unsubEngine()
    stopped = true
    clearInterval(interval)
  }
}
