import React, { useState } from "react"
import { getLeaderboard } from "../core/leaderboard"
import { getAllScores } from "../core/activityScore"
import Card from "../shared/components/ui/Card"

export default function Leaderboard() {
  const [tab, setTab] = useState<"reputation" | "missions" | "earners">("reputation")
  const base = getLeaderboard()
  const scores = getAllScores()

  const byReputation = [...base].slice(0, 50)
  const byMissions = [...base].sort((a, b) => b.completedMissions - a.completedMissions).slice(0, 50)
  const byEarners = [...base].sort((a, b) => b.tokens - a.tokens).slice(0, 50)

  const list = tab === "reputation" ? byReputation : tab === "missions" ? byMissions : byEarners

  return (
    <div style={{ maxWidth: 1000, margin: "24px auto" }}>
      <h1>Leaderboard</h1>
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <button onClick={() => setTab("reputation")} style={{ fontWeight: tab === "reputation" ? 700 : 400 }}>Top Reputation</button>
        <button onClick={() => setTab("missions")} style={{ fontWeight: tab === "missions" ? 700 : 400 }}>Top Missions</button>
        <button onClick={() => setTab("earners")} style={{ fontWeight: tab === "earners" ? 700 : 400 }}>Top Earners</button>
      </div>
      <Card>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ textAlign: "left", borderBottom: "1px solid #333" }}>
              <th>Rank</th>
              <th>User</th>
              <th>Reputation</th>
              <th>Tokens</th>
              <th>Missions</th>
            </tr>
          </thead>
          <tbody>
            {list.slice(0, 10).map((e, i) => (
              <tr key={e.id} style={{ borderBottom: "1px solid #222" }}>
                <td style={{ padding: "8px 6px" }}>{i + 1}</td>
                <td style={{ padding: "8px 6px" }}>{e.username}</td>
                <td style={{ padding: "8px 6px" }}>{e.reputation}</td>
                <td style={{ padding: "8px 6px" }}>{Math.round(e.tokens)}</td>
                <td style={{ padding: "8px 6px" }}>{e.completedMissions}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  )
}
