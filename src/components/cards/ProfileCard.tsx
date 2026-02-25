import React from "react"
import Card from "../../shared/components/ui/Card"
import { useUser } from "../../app/providers/UserProvider"

export default function ProfileCard() {
  const { user } = useUser()
  if (!user) return <Card title="Profile">Not logged</Card>

  return (
    <Card title="Profile Snapshot">
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <div style={{ width: 64, height: 64, borderRadius: 12, background: "linear-gradient(135deg,#ffd166,#f6c90e)" }} />
        <div>
          <div style={{ fontWeight: 700, fontSize: 18 }}>{user.username}</div>
          <div>Level: {user.level}</div>
          <div style={{ fontSize: 12, color: "#bbb" }}>Sequence: {user.id?.slice?.(0, 8)}</div>
        </div>
      </div>
    </Card>
  )
}
