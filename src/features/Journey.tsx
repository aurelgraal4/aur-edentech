import React from "react"
import { getActiveMissions, completeMission } from "../core/missions"
import { useUser } from "../app/providers/UserProvider"
import { triggerReputationEvent } from "../core/reputationEvents"
import { logActivity } from "../core/activity"

export default function Journey() {
  const missions = getActiveMissions()
  const { user, addReputation, addTokens } = useUser()

  function handleComplete(id: string) {
    // delegate to user context to handle tokens/reputation and logging
    completeMission(id)
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Journey</h2>
      <div style={{ display: "grid", gap: 12 }}>
        {missions.map((m) => (
          <div key={m.id} style={{ padding: 12, border: "1px solid #222", borderRadius: 8 }}>
            <strong>{m.title}</strong>
            <p style={{ margin: "6px 0" }}>{m.description}</p>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <span>Reward: {m.reward}</span>
              <button onClick={() => handleComplete(m.id)} style={{ marginLeft: "auto" }}>
                Complete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
