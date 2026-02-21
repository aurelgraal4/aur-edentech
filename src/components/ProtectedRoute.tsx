import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'

type Props = {
  children: ReactNode
}

export default function ProtectedRoute({ children }: Props) {
  const auth = localStorage.getItem('auth')

  if (!auth) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}