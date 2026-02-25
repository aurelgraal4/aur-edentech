import eventBus from "../events/eventBus"
import automation from "./automationEngine"

export function connect() {
  // forward core events to automation engine via shared platform event bus
  const events = ["USER_ACTION", "MISSION_COMPLETED", "TOKEN_TRANSFER", "REPUTATION_UPDATE", "GOVERNANCE_VOTE", "REWARD_RECEIVED"]
  events.forEach((e) => eventBus.on(e, (payload) => {
    try { automation.start(); } catch {}
  }))
}

export default { connect }
