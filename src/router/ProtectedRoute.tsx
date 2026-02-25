import React from "react"
import { Navigate } from "react-router-dom"
import session from "../core/session/internalSession"

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const valid = session.validateSession()
  if (!valid) return <Navigate to="/login" replace />
  return <>{children}</>
}
