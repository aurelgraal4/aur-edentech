import registry from "./moduleRegistry"
import bus from "../events/eventBus"
import state from "../state/platformState"

let initialized = false

export function initPlatform(user: any) {
  if (initialized) return
  initialized = true
  // set initial state
  state.updateState({ user })

  // register known modules if present globally
  // modules should register themselves too; this is best-effort
  console.info("Platform initialized for user", user?.id)
}

export function registerModule(name: string, mod: any) {
  registry.register(name, mod)
}

export function dispatchEvent(event: string, payload?: any) {
  // update state when certain events occur
  switch (event) {
    case "REPUTATION_UPDATE":
      state.updateState({ reputation: payload?.reputation })
      break
    case "TOKEN_TRANSFER":
      state.updateState({ tokenBalance: payload?.balance })
      break
  }
  bus.emit(event, payload)
}

export function getModule(name: string) {
  return registry.get(name)
}

export default { initPlatform, registerModule, dispatchEvent, getModule }
