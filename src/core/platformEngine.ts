import bus from "./events/eventBus"
import { logActivity } from "./activityEngine"
import * as reputation from "./reputation"
import rewardEngine from "./rewardEngine"
import automation from "./automation/automationEngine"
import * as platformStats from "./platformStats"
import { earnTokens as walletEarn, getBalance as getWalletBalance } from "./wallet"
import { getTrendingUsers, getTrendingPosts } from "./trending"

let initialized = false

export function initPlatformEngine(user?: { id: string; username?: string }) {
  if (initialized) return
  initialized = true

  // start automation
  try { automation.start() } catch {}

  // subscribe to core platform events
  const events = ["USER_ACTION", "MISSION_COMPLETED", "TOKEN_TRANSFER", "REPUTATION_UPDATE", "GOVERNANCE_VOTE"]
  events.forEach((e) => bus.on(e, (payload: any) => handleEvent(e, payload)))

  // initial stat snapshot
  try {
    if (user) {
      logActivity("PLATFORM_INIT", { user: user.id }, { id: user.id, username: user.username || user.id })
    }
  } catch {}
}

function handleEvent(eventType: string, payload: any) {
  try {
    switch (eventType) {
      case "USER_ACTION": {
        // record activity
        const uid = payload?.userId
        if (uid) {
          try { logActivity("USER_ACTION", payload, { id: uid, username: uid }) } catch {}
        }
        break
      }
      case "MISSION_COMPLETED": {
        const uid = payload?.userId
        const reward = payload?.reward ?? 0
        if (uid) {
          try { rewardEngine.rewardUser(uid, { reputation: 20, tokens: reward || 10 }) } catch {}
          try { reputation.gainReputation(20) } catch {}
          try { platformStats.incrementMissionsCompleted(1) } catch {}
          try { logActivity("MISSION_COMPLETED", payload, { id: uid, username: uid }) } catch {}
        }
        break
      }
      case "TOKEN_TRANSFER": {
        const from = payload?.from
        const to = payload?.to
        const amount = payload?.amount ?? 0
        try { platformStats.incrementTokensDistributed(amount) } catch {}
        try {
          if (to) logActivity("TOKENS_RECEIVED", { amount, from }, { id: to, username: to })
          if (from) logActivity("TOKENS_SENT", { amount, to }, { id: from, username: from })
        } catch {}
        break
      }
      case "REPUTATION_UPDATE": {
        const uid = payload?.userId
        const delta = payload?.delta ?? 0
        if (uid && delta) {
          try { reputation.gainReputation(delta) } catch {}
          try { logActivity("REPUTATION_UPDATE", { delta }, { id: uid, username: uid }) } catch {}
        }
        break
      }
      case "GOVERNANCE_VOTE": {
        const uid = payload?.userId
        if (uid) {
          try { logActivity("GOVERNANCE_VOTE", payload, { id: uid, username: uid }) } catch {}
        }
        break
      }
      default:
        break
    }

    // always pass event to automation rules
    try { bus.emit(eventType, payload) } catch {}
  } catch (e) {
    // swallow
  }
}

export function emitPlatformEvent(event: string, payload?: any) {
  try { handleEvent(event, payload) } catch {}
}

export function registerRule(name: string, events: string[], handler: any) {
  try { automation.registerRule(name, events, handler) } catch {}
}

export default { initPlatformEngine, emitPlatformEvent, registerRule }
