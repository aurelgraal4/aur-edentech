import React from "react"
import Card from "../../shared/components/ui/Card"
import { useUser } from "../../app/providers/UserProvider"

export default function BadgeCard() {
  const { user } = useUser()
  const badges = user?.badges || []

  return (
    <Card title="Badges">
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {badges.length === 0 && <div>No badges yet</div>}
        {badges.map((b: string) => (
          <div key={b} style={{ padding: 8, background: "#121212", borderRadius: 8 }}>{b}</div>
        ))}
      </div>
    </Card>
  )
}
