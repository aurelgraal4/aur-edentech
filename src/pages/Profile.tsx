import React from "react"
import Card from "../shared/components/ui/Card"
import { useUser } from "../app/providers/UserProvider"
import { getUserFeed, getUserStats } from "../core/activityEngine"
import { getTransactionHistory } from "../core/wallet"
import { listBadges, getBadgeById } from "../core/badges"
import { getWeeklyScore, getDailyScore } from "../core/activityScore"
import { calculateUserScore } from "../core/reputation"
import { getLeaderboard } from "../core/leaderboard"

export default function Profile() {
  const { user } = useUser()
  if (!user) return <div>Please login</div>

  const feed = getUserFeed(user.id).slice(0, 10)
  const tx = getTransactionHistory(user.id).slice(0, 10)
  const stats = getUserStats(user.id)
  const weekly = getWeeklyScore(user.id).weeklyScore
  const daily = getDailyScore(user.id).dailyScore
  const scores = calculateUserScore(user.id)
  const rank = getLeaderboard().findIndex((l) => l.id === user.id) + 1

  return (
    <div style={{ maxWidth: 900, margin: "24px auto" }}>
      <h1>Profile</h1>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 16 }}>
        <div>
          <Card title="User">
            <p style={{ fontWeight: 700 }}>{user.username}</p>
            <p>Level: {user.level}</p>
            <p>Reputation: {user.reputation}</p>
            <p>Tokens: {user.tokens}</p>
            <p>Badges: {(user.badges || []).join(", ")}</p>
            <div style={{ marginTop: 8 }}>
              <b>Weekly activity:</b> {Math.round(weekly)} — <b>Today:</b> {Math.round(daily)}
            </div>
            <div style={{ marginTop: 8 }}>
              <b>Reputation score:</b> {Math.round(scores.userScore)} — <b>Rank:</b> {rank || "-"}
            </div>
            <div style={{ marginTop: 8 }}>
              <b>Missions completed:</b> {stats.missionsCompleted || 0}
            </div>
            <div style={{ marginTop: 8 }}>
              <b>Governance actions:</b> {(stats.proposalsCreated || 0) + (stats.votesCast || 0)}
            </div>
          </Card>
          <Card title="Badges" style={{ marginTop: 12 }}>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {(user.badges || []).map((b: string) => {
                const meta = getBadgeById(b)
                return (
                  <div key={b} style={{ padding: 8, background: "#0b0b0b", borderRadius: 8 }}>
                    <div style={{ fontSize: 20 }}>{meta?.icon ?? "🔰"}</div>
                    <div style={{ fontSize: 13 }}>{meta?.name ?? b}</div>
                  </div>
                )
              })}
            </div>
          </Card>
        </div>

        <div>
          <Card title="Recent Activity">
            <ul>
              {feed.map((f) => (
                <li key={f.id}>{f.timestamp.split("T")[0]} — {f.type} — {JSON.stringify(f.data)}</li>
              ))}
            </ul>
          </Card>

          <Card title="Transactions" style={{ marginTop: 12 }}>
            <ul>
              {tx.map((t) => (
                <li key={t.id}>{t.timestamp} — {t.type} — {t.amount} — {t.reason}</li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  )
}
