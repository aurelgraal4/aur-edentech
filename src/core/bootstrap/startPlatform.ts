import orchestrator from "../orchestrator/platformOrchestrator"
import session from "../session/internalSession"
import { getSession } from "../session/internalSession"
import automation from "../automation/automationEngine"
import { initPlatformState } from "../platformState"

export function startPlatform(user?: any) {
  // if user provided, use it; otherwise restore from session
  let u = user
  if (!u) {
    const s = getSession()
    if (s) u = { id: s.userId }
  }
  if (!u) return null
  orchestrator.initPlatform(u)
  try { initPlatformState() } catch {}
  try { automation.start() } catch {}
  return u
}

export default { startPlatform }
