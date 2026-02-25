import { subscribe, Events } from "./eventBus"
import { getRegisteredUsers, registerUser, logActivity, assignBadge } from "./activityEngine"
import { earn as earnTokens } from "./tokenProtocol"
import { getBalance } from "./wallet"

type Reward = {
  tokens?: number
  reputation?: number
  badge?: string
}

// simple in-memory dedupe store: keys are `${userId}:${timestamp}`
const processed = new Set<string>()

function makeKey(userId: string, timestamp: number | string) {
  return `${userId}:${timestamp}`
}

function resolveUser(userId?: string, payload?: any) {
  const id = userId || payload?.userId || payload?.user?.id || payload?.authorId || payload?.actorId
  if (!id) return null
  const users = getRegisteredUsers()
  const u = users.find((x: any) => x.id === id)
  return u ?? { id, username: id, reputation: 0, tokens: 0, badges: [], completedMissions: [] }
}

export async function rewardUser(userId: string, reward: Reward) {
  try {
    const users = getRegisteredUsers()
    const existing = users.find((u: any) => u.id === userId) || { id: userId, username: userId, reputation: 0, tokens: 0, badges: [], counters: {} }

    // tokens
    if (reward.tokens && reward.tokens > 0) {
      try {
        earnTokens(userId, reward.tokens, "reward_engine")
      } catch {}
      // log activity
      try {
        logActivity("TOKENS_EARNED", { amount: reward.tokens }, { id: existing.id, username: existing.username })
      } catch {}
    }

    // reputation: update stored user and emit activity
    if (reward.reputation && reward.reputation !== 0) {
      try {
        const newRep = (existing.reputation || 0) + reward.reputation
        registerUser({ ...existing, reputation: newRep })
        logActivity("REPUTATION_GAIN", { amount: reward.reputation, newReputation: newRep }, { id: existing.id, username: existing.username })
      } catch {}
    }

    // badge
    if (reward.badge) {
      try {
        assignBadge(userId, reward.badge)
      } catch {}
    }
  } catch (e) {
    // swallow errors to avoid breaking event flow
    // eslint-disable-next-line no-console
    console.error("rewardUser error", e)
  }
}

// map event types to reward amounts per spec
const mapping: Record<string, Reward> = {
  [Events.POST_CREATED]: { reputation: 5, tokens: 1 },
  [Events.POST_VOTED]: { reputation: 2 },
  [Events.MISSION_COMPLETED]: { reputation: 20, tokens: 10 },
  [Events.GOV_VOTE_CAST]: { reputation: 3 },
  [Events.GOV_PROPOSAL_CREATED]: { reputation: 10, tokens: 5 },
  [Events.USER_LOGIN]: {},
}

// subscribe handler
subscribe(Events.POST_CREATED, (e) => handleEvent(e))
subscribe(Events.POST_VOTED, (e) => handleEvent(e))
subscribe(Events.MISSION_COMPLETED, (e) => handleEvent(e))
subscribe(Events.GOV_VOTE_CAST, (e) => handleEvent(e))
subscribe(Events.GOV_PROPOSAL_CREATED, (e) => handleEvent(e))
subscribe(Events.USER_LOGIN, (e) => handleEvent(e))

function handleEvent(e: { type: string; userId?: string; payload?: any; timestamp: number }) {
  const userObj = resolveUser(e.userId, e.payload)
  if (!userObj) return
  const uid = userObj.id
  const key = makeKey(uid, e.timestamp || Date.now())
  if (processed.has(key)) return
  processed.add(key)

  // special-case USER_LOGIN: +1 activity score -> log as login activity
  if (e.type === Events.USER_LOGIN) {
    try {
      logActivity("USER_LOGIN", { score: 1 }, { id: uid, username: userObj.username })
    } catch {}
    return
  }

  const reward = mapping[e.type]
  if (!reward) return

  // apply rewards
  rewardUser(uid, reward)
}

export default { rewardUser }
