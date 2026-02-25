import eventBus from "./events/eventBus"

export type PlatformState = {
  activeUsers: Record<string, { lastSeen: number }>
  totalActiveUsers: number
  reputationChanges: Record<string, number>
  missionsProgress: Record<string, { completed: number }>
  tokensDistributed: number
  tokensTransferred: number
  governanceActions: { proposals: number; votes: number }
  lastUpdate: number
}

let state: PlatformState = {
  activeUsers: {},
  totalActiveUsers: 0,
  reputationChanges: {},
  missionsProgress: {},
  tokensDistributed: 0,
  tokensTransferred: 0,
  governanceActions: { proposals: 0, votes: 0 },
  lastUpdate: Date.now(),
}

const subscribers: Set<(s: PlatformState) => void> = new Set()

let inited = false

export function initPlatformState(initial?: Partial<PlatformState>) {
  if (inited) return state
  inited = true
  if (initial) state = { ...state, ...initial, lastUpdate: Date.now() }

  // subscribe to core events
  const handlers: Array<() => void> = []

  handlers.push(eventBus.on("USER_ACTION", (p: any) => updatePlatformState({ type: "USER_ACTION", payload: p })))
  handlers.push(eventBus.on("MISSION_COMPLETED", (p: any) => updatePlatformState({ type: "MISSION_COMPLETED", payload: p })))
  handlers.push(eventBus.on("TOKEN_TRANSFER", (p: any) => updatePlatformState({ type: "TOKEN_TRANSFER", payload: p })))
  handlers.push(eventBus.on("REPUTATION_UPDATE", (p: any) => updatePlatformState({ type: "REPUTATION_UPDATE", payload: p })))
  handlers.push(eventBus.on("GOVERNANCE_VOTE", (p: any) => updatePlatformState({ type: "GOVERNANCE_VOTE", payload: p })))
  handlers.push(eventBus.on("PROPOSAL_CREATED", (p: any) => updatePlatformState({ type: "PROPOSAL_CREATED", payload: p })))

  return state
}

export function getPlatformState() {
  return { ...state, activeUsers: { ...state.activeUsers }, reputationChanges: { ...state.reputationChanges }, missionsProgress: { ...state.missionsProgress } }
}

export function subscribeToState(listener: (s: PlatformState) => void) {
  subscribers.add(listener)
  // immediate call with current state
  try { listener(getPlatformState()) } catch {}
  return () => subscribers.delete(listener)
}

export function updatePlatformState(event: { type: string; payload?: any }) {
  const t = (event.type || "").toUpperCase()
  const p = event.payload || {}
  const now = Date.now()
  let changed = false

  switch (t) {
    case "USER_ACTION": {
      const uid = p.userId
      if (uid) {
        state.activeUsers[uid] = { lastSeen: now }
        state.totalActiveUsers = Object.keys(state.activeUsers).length
        changed = true
      }
      break
    }
    case "MISSION_COMPLETED": {
      const uid = p.userId
      const mid = p.missionId || "unknown"
      if (mid) {
        state.missionsProgress[mid] = state.missionsProgress[mid] || { completed: 0 }
        state.missionsProgress[mid].completed += 1
        changed = true
      }
      if (p.reward) {
        state.tokensDistributed += Number(p.reward) || 0
        changed = true
      }
      if (uid) {
        state.reputationChanges[uid] = (state.reputationChanges[uid] || 0) + (p.reputationDelta ?? 0)
      }
      break
    }
    case "TOKEN_TRANSFER": {
      const amt = Number(p.amount) || 0
      state.tokensTransferred += amt
      changed = true
      break
    }
    case "TOKENS_DISTRIBUTED": {
      state.tokensDistributed += Number(p.amount) || 0
      changed = true
      break
    }
    case "REPUTATION_UPDATE": {
      const uid = p.userId
      const delta = Number(p.delta) || 0
      if (uid) {
        state.reputationChanges[uid] = (state.reputationChanges[uid] || 0) + delta
        changed = true
      }
      break
    }
    case "GOVERNANCE_VOTE": {
      state.governanceActions.votes += 1
      changed = true
      break
    }
    case "PROPOSAL_CREATED": {
      state.governanceActions.proposals += 1
      changed = true
      break
    }
    default:
      break
  }

  if (changed) {
    state.lastUpdate = now
    // notify subscribers
    subscribers.forEach((s) => {
      try { s(getPlatformState()) } catch {}
    })
  }

  return state
}

export default { initPlatformState, getPlatformState, updatePlatformState, subscribeToState }
