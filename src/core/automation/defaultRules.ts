import rulesEngine from "./rulesEngine"
import trustEngine from "../trustEngine"
import sybilEngine from "../sybilEngine"
import rewardEngine from "../rewardEngine"
import { completeMissionForUser } from "../missions"

// ANTI_SPAM: reduce trust on rapid USER_ACTION bursts
rulesEngine.registerRule({
  name: "ANTI_SPAM",
  events: ["USER_ACTION"],
  handler: async (e) => {
    const uid = e.userId || e.payload?.userId
    if (!uid) return
    // simple heuristic: if payload.recentCount > 20 reduce trust
    const recent = e.payload?.recentCount ?? 0
    if (recent > 20) {
      try { trustEngine.updateTrust(uid, -5) } catch {}
    }
  },
})

// ANTI_SYBIL: trigger sybil analysis on suspicious events
rulesEngine.registerRule({
  name: "ANTI_SYBIL",
  events: ["TOKEN_TRANSFER", "REWARD_RECEIVED", "MISSION_COMPLETED"],
  handler: async (e) => {
    const uid = e.userId || e.payload?.userId
    if (!uid) return
    try { sybilEngine.analyzeUserSignals(uid) } catch {}
  },
})

// AUTO_REWARD: when mission completed, distribute auto bonus
rulesEngine.registerRule({
  name: "AUTO_REWARD",
  events: ["MISSION_COMPLETED"],
  handler: async (e) => {
    const uid = e.userId || e.payload?.userId
    if (!uid) return
    const amount = e.payload?.rewardBonus ?? 10
    try { rewardEngine.rewardUser(uid, { tokens: amount, reputation: 5 }) } catch {}
  },
})

// MISSION_SCORE: auto-validate small missions
rulesEngine.registerRule({
  name: "MISSION_SCORE",
  events: ["MISSION_COMPLETED"],
  handler: async (e) => {
    const uid = e.userId || e.payload?.userId
    const missionId = e.payload?.missionId
    if (!uid || !missionId) return
    // if mission reward small, auto-confirm completion
    try {
      const m = completeMissionForUser(uid, missionId, (u: string, a: number, r?: string) => {})
      // already handled by missions module; nothing else
    } catch {}
  },
})

// TRUST_UPDATE: update trust based on reputation changes
rulesEngine.registerRule({
  name: "TRUST_UPDATE",
  events: ["REPUTATION_UPDATE"],
  handler: async (e) => {
    const uid = e.userId || e.payload?.userId
    const delta = e.payload?.delta ?? 0
    if (!uid) return
    try { trustEngine.updateTrust(uid, Math.sign(delta) * Math.min(3, Math.abs(delta))) } catch {}
  },
})

export default { }
