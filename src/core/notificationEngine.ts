import { subscribe, Events } from "./eventBus"
import { addNotification } from "../state/notificationStore"

const processed = new Set<string>()

function makeKey(e: any) {
  const id = e.id || e.payload?.id || `${e.type}:${e.timestamp || Date.now()}`
  return id
}

function extractUserId(e: any) {
  return e.userId || e.payload?.userId || e.payload?.user?.id || e.payload?.toUserId || e.payload?.recipientId || e.payload?.authorId || null
}

function notifyForEvent(e: any) {
  const key = makeKey(e)
  if (processed.has(key)) return
  processed.add(key)

  const userId = extractUserId(e)
  if (!userId) return

  const type = (e.type || "").toLowerCase()
  const ts = e.timestamp || Date.now()

  switch (type) {
    case Events.POST_CREATED.toLowerCase():
    case "post_created":
      addNotification({ userId, type: "reward_received", title: "Post created", message: "You received reputation and tokens for your post." })
      break
    case Events.MISSION_COMPLETED.toLowerCase():
    case "mission_completed":
      addNotification({ userId, type: "mission_completed", title: "Mission completed", message: "Mission completed — rewards granted." })
      break
    case "new_follower":
      addNotification({ userId, type: "new_follower", title: "New follower", message: "You have a new follower." })
      break
    case Events.GOV_PROPOSAL_CREATED.toLowerCase():
    case "proposal_created":
      addNotification({ userId, type: "proposal_created", title: "Proposal created", message: "Your governance proposal was created." })
      break
    case Events.GOV_VOTE_CAST.toLowerCase():
    case "vote_received":
    case "post_voted":
      addNotification({ userId, type: "vote_received", title: "Vote received", message: "Someone voted on your content." })
      break
    case "badge_unlocked":
    case "badge_earned":
    case "BADGE_EARNED":
      addNotification({ userId, type: "badge_unlocked", title: "Badge unlocked", message: `You unlocked a new badge: ${e.payload?.badge || e.payload?.badgeId || "badge"}.` })
      break
    case Events.TOKEN_EARNED.toLowerCase():
    case "tokens_received":
    case "tokens_earned":
      addNotification({ userId, type: "tokens_received", title: "Tokens received", message: `You received ${e.payload?.amount ?? "some"} tokens.` })
      break
    default:
      // ignore other events
      break
  }
}

let started = false

export function startNotificationEngine() {
  if (started) return
  started = true

  // subscribe to common event names and constants
  const evs = [
    Events.POST_CREATED,
    Events.MISSION_COMPLETED,
    Events.GOV_PROPOSAL_CREATED,
    Events.GOV_VOTE_CAST,
    Events.TOKEN_EARNED,
  ]
  evs.forEach((ev) => subscribe(ev, (e) => notifyForEvent(e)))

  // lowercase/common names
  subscribe("post_created", (e) => notifyForEvent(e))
  subscribe("mission_completed", (e) => notifyForEvent(e))
  subscribe("proposal_created", (e) => notifyForEvent(e))
  subscribe("vote_cast", (e) => notifyForEvent(e))
  subscribe("tokens_received", (e) => notifyForEvent(e))
  subscribe("new_follower", (e) => notifyForEvent(e))
  subscribe("badge_unlocked", (e) => notifyForEvent(e))
}

export default { startNotificationEngine }
