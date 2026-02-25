import { subscribe, Events } from "./eventBus"
import { getUserScore } from "./rankingEngine"
import { getUserBalance } from "./economy"
import * as rep from "./reputation"
import { getTrust } from "./trustEngine"

// cache for computed powers
const powerCache: Map<string, number> = new Map()

// delegations: userId -> delegatedTo
const delegations: Map<string, string | null> = new Map()

function computeBasePower(userId: string) {
  const rankingScore = getUserScore(userId) || 0
  const tokens = getUserBalance(userId) || 0
  // reputation module doesn't expose per-user getter; attempt to read via ranking data fallback
  // use global reputation as fallback
  const reputation = ((): number => {
    try {
      // ranking engine stores per-user reputation in registered users; if not available, use global
      // keep this conservative and rely on rankingScore for most weight
      return rep.getReputation ? rep.getReputation() : 0
    } catch {
      return 0
    }
  })()
  const trust = getTrust(userId) || 0

  const power = rankingScore * 2 + tokens + reputation + trust
  return power
}

export function getVotingPower(userId: string) {
  if (powerCache.has(userId)) return powerCache.get(userId) as number

  // base power
  let power = computeBasePower(userId)

  // include delegated power from users who delegated to this user
  for (const [from, to] of delegations.entries()) {
    if (to === userId) {
      try {
        const delegated = computeBasePower(from)
        power += delegated
      } catch {}
    }
  }

  powerCache.set(userId, power)
  return power
}

export function canCreateProposal(userId: string) {
  const trust = getTrust(userId)
  if (trust < 15) return false
  const power = getVotingPower(userId)
  return power >= 100
}

export function canVote(userId: string) {
  const trust = getTrust(userId)
  if (trust < 15) return false
  const power = getVotingPower(userId)
  return power >= 10
}

export function setDelegation(fromUserId: string, toUserId: string | null) {
  if (toUserId === null) delegations.delete(fromUserId)
  else delegations.set(fromUserId, toUserId)
  // invalidate caches for affected users
  powerCache.delete(fromUserId)
  if (toUserId) powerCache.delete(toUserId)
}

export function getDelegation(userId: string) {
  return delegations.get(userId) ?? null
}

export function invalidateCache(userId?: string) {
  if (userId) powerCache.delete(userId)
  else powerCache.clear()
}

// subscribe to events that change ranking/token/reputation
const watched = [
  Events.POST_CREATED,
  Events.POST_VOTED,
  Events.MISSION_COMPLETED,
  Events.TOKEN_EARNED,
  Events.GOV_VOTE_CAST,
  Events.GOV_PROPOSAL_CREATED,
]

watched.forEach((ev) => subscribe(ev, (e) => {
  const uid = e.userId || e.payload?.userId || e.payload?.user?.id || e.payload?.authorId || e.payload?.actorId
  if (!uid) return
  try { invalidateCache(uid) } catch {}
}))

export default { getVotingPower, canCreateProposal, canVote, setDelegation, getDelegation }
