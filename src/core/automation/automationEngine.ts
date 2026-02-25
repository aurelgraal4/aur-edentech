import rulesEngine from "./rulesEngine"
import eventBus from "../events/eventBus"
import defaultRules from "./defaultRules"

let running = false
const subscriptions: Array<() => void> = []

export function start() {
  if (running) return
  running = true
  // ensure default rules loaded
  try { ;(defaultRules as any) } catch {}

  // subscribe to generic platform events
  const evs = ["USER_ACTION", "MISSION_COMPLETED", "TOKEN_TRANSFER", "REPUTATION_UPDATE", "GOVERNANCE_VOTE", "REWARD_RECEIVED"]
  evs.forEach((ev) => {
    const unsub = eventBus.on(ev, async (payload) => {
      try { await rulesEngine.evaluateRulesForEvent({ type: ev, payload, userId: payload?.userId }) } catch {}
    })
    subscriptions.push(unsub)
  })
}

export function stop() {
  subscriptions.splice(0).forEach((u) => u())
  running = false
}

export function registerRule(name: string, events: string[], handler: any) {
  rulesEngine.registerRule({ name, events, handler })
}

export async function executeRule(name: string, event: { type: string; payload?: any; userId?: string }) {
  const r = rulesEngine.getRule(name)
  if (!r) return
  try { await r.handler(event) } catch {}
}

export default { start, stop, registerRule, executeRule }
