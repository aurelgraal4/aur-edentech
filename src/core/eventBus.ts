export type PlatformEvent = {
  type: string
  userId?: string
  payload?: any
  timestamp: number
}

type Handler = (event: PlatformEvent) => void

const listeners: Map<string, Set<Handler>> = new Map()

export function subscribe(eventType: string, handler: Handler) {
  if (!listeners.has(eventType)) listeners.set(eventType, new Set())
  listeners.get(eventType)!.add(handler)
  return () => unsubscribe(eventType, handler)
}

export function unsubscribe(eventType: string, handler?: Handler) {
  const set = listeners.get(eventType)
  if (!set) return
  if (handler) {
    set.delete(handler)
  } else {
    // remove all handlers for this event
    listeners.delete(eventType)
  }
}

export function emit(event: Omit<PlatformEvent, "timestamp"> | PlatformEvent) {
  const evPartial = { ...(event as PlatformEvent) } as PlatformEvent
  if (!evPartial.timestamp) evPartial.timestamp = Date.now()
  const ev: PlatformEvent = evPartial

  // notify specific listeners
  const set = listeners.get(ev.type)
  if (set) {
    // copy to avoid mutation during iteration
    Array.from(set).forEach((h) => {
      try {
        h(ev)
      } catch (e) {
        // swallow handler errors to avoid breaking bus
        // eslint-disable-next-line no-console
        console.error("Event handler error", e)
      }
    })
  }

  return ev
}

// initial supported events (constants)
export const Events = {
  USER_LOGIN: "USER_LOGIN",
  POST_CREATED: "POST_CREATED",
  POST_VOTED: "POST_VOTED",
  MISSION_COMPLETED: "MISSION_COMPLETED",
  TOKEN_EARNED: "TOKEN_EARNED",
  TOKEN_SENT: "TOKEN_SENT",
  GOV_PROPOSAL_CREATED: "GOV_PROPOSAL_CREATED",
  GOV_VOTE_CAST: "GOV_VOTE_CAST",
  PROFILE_UPDATED: "PROFILE_UPDATED",
} as const

export type EventType = typeof Events[keyof typeof Events]

export default { subscribe, unsubscribe, emit, Events }
