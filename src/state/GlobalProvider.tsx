import type { ReactNode } from "react"
import React from "react"

// Lightweight global provider using existing zustand stores.
// Keeps responsibilities minimal: ensure a single place to extend
// global initialization (session restore, background sync, etc.).

type Props = {
  children: ReactNode
}

export default function GlobalProvider({ children }: Props) {
  return <>{children}</>
}
