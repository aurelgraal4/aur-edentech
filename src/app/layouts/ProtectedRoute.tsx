import type { ReactNode } from "react"
import { Navigate } from "react-router-dom"

type Props = {
  children: ReactNode
}

export default function ProtectedRoute({ children }: Props) {
  const session = localStorage.getItem("aur-session")

  if (!session) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}
