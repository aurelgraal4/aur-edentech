import { useEffect, useState, useCallback } from "react"
import platformState, { PlatformState as _PlatformState } from "../core/platformState"

export type PlatformState = _PlatformState

export function usePlatform() {
  const [state, setState] = useState<PlatformState>(() => platformState.getPlatformState())

  useEffect(() => {
    const unsub = platformState.subscribe((s: PlatformState) => {
      try {
        setState(s)
      } catch {}
    })
    return () => {
      try {
        unsub()
      } catch {}
    }
  }, [])

  const subscribeToUpdates = useCallback((listener: (s: PlatformState) => void) => {
    return platformState.subscribe(listener)
  }, [])

  return { state, subscribeToUpdates }
}

export default usePlatform
