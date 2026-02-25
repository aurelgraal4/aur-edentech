import { subscribe, Events } from "./eventBus"
import * as rewardEngine from "./rewardEngine"
import { gainReputation } from "./reputation"
import { updateUserScore } from "./rankingEngine"
import * as trustEngine from "./trustEngine"

const processed = new Set<string>()

function makeKey(userId: string, ts: number | string) {
  return `${userId}:${ts}`
}

function handleEvent(e: any) {
  const type = (e.type || "").toUpperCase()
  const payload = e.payload || {}
  const userId = e.userId || payload.userId || payload.user?.id || payload.authorId || payload.actorId
  const ts = e.timestamp || payload.timestamp || Date.now()
  if (!userId) return
  const key = makeKey(userId, ts)
  if (processed.has(key)) return
  processed.add(key)

  // route by event type
  switch (type) {
    case Events.POST_CREATED:
    case "POST_CREATED":
    case "post_created":
      // reward +5 rep +1 token
      try { rewardEngine.rewardUser(userId, { reputation: 5, tokens: 1 }) } catch {}
      try { gainReputation(5) } catch {}
      try { updateUserScore(userId) } catch {}
      break

    case Events.POST_VOTED:
    case "POST_VOTED":
    case "post_voted":
    case "VOTE_CAST":
    case "vote_cast":
      try { gainReputation(2) } catch {}
      try { updateUserScore(userId) } catch {}
      break

    case Events.MISSION_COMPLETED:
    case "MISSION_COMPLETED":
    case "mission_completed":
      // large reward +20 rep +10 tokens, increase trust
      try { rewardEngine.rewardUser(userId, { reputation: 20, tokens: 10 }) } catch {}
      try { gainReputation(20) } catch {}
      try { trustEngine.updateTrust(userId, 3) } catch {}
      try { updateUserScore(userId) } catch {}
      break

    case Events.GOV_VOTE_CAST:
    case "GOV_VOTE_CAST":
    case "GOV_VOTE_CAST".toUpperCase():
    case "proposal_voted":
    case "proposal_vote":
    case "vote_cast":
      try { gainReputation(3) } catch {}
      try { updateUserScore(userId) } catch {}
      break

    case Events.GOV_PROPOSAL_CREATED:
    case "GOV_PROPOSAL_CREATED":
    case "proposal_created":
      try { rewardEngine.rewardUser(userId, { reputation: 10, tokens: 5 }) } catch {}
      try { gainReputation(10) } catch {}
      try { updateUserScore(userId) } catch {}
      break

    case "TOKENS_SENT":
    case "tokens_sent":
      // tokens transfer affects ranking
      try { updateUserScore(userId) } catch {}
      break

    case "COMMENT_CREATED":
    case "comment_created":
      // mild reputation for comments
      try { gainReputation(1) } catch {}
      try { updateUserScore(userId) } catch {}
      break

    default:
      // ignore
      break
  }
}

let started = false

export function startOrchestrator() {
  if (started) return
  started = true
  // subscribe to known events (both uppercase and lowercase forms)
  const evs = [
    Events.POST_CREATED,
    Events.POST_VOTED,
    Events.MISSION_COMPLETED,
    Events.GOV_PROPOSAL_CREATED,
    Events.GOV_VOTE_CAST,
  ]

  // subscribe to both uppercase constants and common lowercase names
  evs.forEach((ev) => subscribe(ev, handleEvent as any))
  subscribe("post_created", handleEvent as any)
  subscribe("post_voted", handleEvent as any)
  subscribe("mission_completed", handleEvent as any)
  subscribe("proposal_created", handleEvent as any)
  subscribe("vote_cast", handleEvent as any)
  subscribe("tokens_sent", handleEvent as any)
  subscribe("comment_created", handleEvent as any)
}

export default { startOrchestrator }
