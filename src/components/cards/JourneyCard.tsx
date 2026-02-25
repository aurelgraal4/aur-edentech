import React from "react"
import Card from "../../shared/components/ui/Card"
import { getActiveMissions } from "../../core/missions"

export default function JourneyCard() {
  const missions = getActiveMissions().slice(0, 5)

  return (
    <Card title="Journey Preview">
      <ul>
        {missions.map((m) => (
          <li key={m.id} style={{ fontSize: 13 }}>{m.title} — {m.description}</li>
        ))}
      </ul>
    </Card>
  )
}
