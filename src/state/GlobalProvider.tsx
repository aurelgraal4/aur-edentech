import type { ReactNode } from "react"
import React, { useEffect } from "react"
import startPlatform from "../core/bootstrap/startPlatform"
import session from "../core/session/internalSession"

// Lightweight global provider using existing zustand stores.
// Keeps responsibilities minimal: ensure a single place to extend
// global initialization (session restore, background sync, etc.).

type Props = {
  children: ReactNode
}

export default function GlobalProvider({ children }: Props) {
  useEffect(() => {
    try {
      if (session.validateSession()) {
        const s = session.getSession()
        if (s) startPlatform.startPlatform({ id: s.userId })
      }
    } catch {}
  }, [])

  return <>{children}</>
}
