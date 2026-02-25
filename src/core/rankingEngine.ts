import { subscribe, Events } from "./eventBus"
import { getRegisteredUsers, getUserStats } from "./activityEngine"
import { getBalance } from "./wallet"
import { getTrust } from "./trustEngine"

type LeaderboardItem = { userId: string; score: number }

const cache: Map<string, number> = new Map()

function computeScoreFor(userId: string) {
  const users = getRegisteredUsers()
  const u: any = users.find((x: any) => x.id === userId) || { id: userId, reputation: 0 }
  const reputation = u.reputation ?? 0
  const tokens = getBalance(userId) || 0
  const stats = getUserStats(userId)
  const missions = stats.missionsCompleted || 0
  const governanceVotes = stats.votesCast || 0
  const posts = stats.posts || 0
  const trust = getTrust(userId)

  const score = reputation * 2 + tokens + missions * 5 + governanceVotes * 3 + posts * 1 + trust
  return score
}

export function updateUserScore(userId: string) {
  const trust = getTrust(userId)
  if (trust < 20) {
    cache.delete(userId)
    return null
  }
  const s = computeScoreFor(userId)
  cache.set(userId, s)
  return s
}

export function getUserScore(userId: string) {
  if (cache.has(userId)) return cache.get(userId) as number
  return updateUserScore(userId)
}

export function getLeaderboard(limit = 100): LeaderboardItem[] {
  // ensure cache for all users
  const users = getRegisteredUsers()
  users.forEach((u: any) => {
    if (!cache.has(u.id)) updateUserScore(u.id)
  })

  const arr: LeaderboardItem[] = Array.from(cache.entries())
    .map(([userId, score]) => ({ userId, score }))
    .filter((it) => getTrust(it.userId) >= 20)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)

  return arr
}

// subscribe to events and update affected users
const watchEvents = [
  Events.POST_CREATED,
  Events.POST_VOTED,
  Events.MISSION_COMPLETED,
  Events.TOKEN_EARNED,
  Events.GOV_VOTE_CAST,
  Events.GOV_PROPOSAL_CREATED,
]

watchEvents.forEach((ev) => subscribe(ev, (e) => {
  const uid = e.userId || e.payload?.userId || e.payload?.user?.id || e.payload?.authorId || e.payload?.actorId
  if (!uid) return
  try { updateUserScore(uid) } catch {}
}))

export default { updateUserScore, getUserScore, getLeaderboard }
