import { useEffect, useRef } from "react"
import eventBus, { subscribe, emit, unsubscribe, PlatformEvent } from "../core/eventBus"

export function useEventBus(eventType: string, handler: (e: PlatformEvent) => void) {
  const ref = useRef(handler)
  ref.current = handler

  useEffect(() => {
    function h(e: PlatformEvent) {
      ref.current(e)
    }
    const unsub = subscribe(eventType, h)
    return () => unsub()
  }, [eventType])
}

export function useEmitEvent() {
  return (type: string, payload?: any, userId?: string) => {
    const ev: Omit<PlatformEvent, "timestamp"> = { type, payload, userId }
    return emit(ev)
  }
}

export default eventBus
