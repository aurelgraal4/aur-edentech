type Handler = (payload?: any) => void

const listeners: Map<string, Set<Handler>> = new Map()

export function emit(event: string, payload?: any) {
  const set = listeners.get(event)
  if (!set) return
  Array.from(set).forEach((h) => {
    try { h(payload) } catch {}
  })
}

export function on(event: string, handler: Handler) {
  if (!listeners.has(event)) listeners.set(event, new Set())
  listeners.get(event)!.add(handler)
  return () => off(event, handler)
}

export function off(event: string, handler?: Handler) {
  const set = listeners.get(event)
  if (!set) return
  if (handler) set.delete(handler)
  else listeners.delete(event)
}

export default { emit, on, off }
