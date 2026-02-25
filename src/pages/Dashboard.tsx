import React from "react"
import Card from "../shared/components/ui/Card"
import { useUser } from "../app/providers/UserProvider"
import { getActiveMissions } from "../core/missions"
import { getBalance } from "../core/wallet"
import { getLevelFromReputation } from "../core/reputation"
import { getGlobalFeed, getUserFeed } from "../core/activityEngine"
import { getLeaderboard } from "../core/leaderboard"
import { getPlatformStats } from "../core/platformStats"
import { getTransactionHistory, getBalance as getUserBalance } from "../core/wallet"

export default function Dashboard() {
      const { user } = useUser()
      const missions = getActiveMissions()
      const balance = getBalance()

      const levelInfo = user ? getLevelFromReputation(user.reputation) : null
      const activities = getGlobalFeed().slice(0, 6)
      const leaderboard = getLeaderboard().slice(0, 3)
      const stats = getPlatformStats()
      const myRank = user ? getLeaderboard().findIndex((l) => l.id === user.id) + 1 : null
      const myBalance = user ? getUserBalance(user.id) : 0
      const tx = user ? getTransactionHistory(user.id) : []
      const today = Date.now() - 1000 * 60 * 60 * 24
      const tokensToday = tx.filter((t) => t.type === "earn" && new Date(t.timestamp).getTime() >= today).reduce((s, t) => s + t.amount, 0)
      const week = Date.now() - 1000 * 60 * 60 * 24 * 7
      const tokensWeek = tx.filter((t) => t.type === "earn" && new Date(t.timestamp).getTime() >= week).reduce((s, t) => s + t.amount, 0)

      return (
            <div>
                  <h1>Dashboard</h1>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 20 }}>
                        <div>
                              <Card title="Profilo">
                                    {!user && <p>Caricamento utente...</p>}
                                    {user && (
                                          <div>
                                                <p style={{ fontWeight: 700 }}>{user.username}</p>
                                                <p>Livello: {user.level} — {levelInfo?.title}</p>
                                                <div style={{ height: 10, background: "#111", borderRadius: 6, margin: "8px 0" }}>
                                                      <div style={{ width: `${Math.round((levelInfo?.progress ?? 0) * 100)}%`, height: 10, background: "var(--aur-green)", borderRadius: 6 }} />
                                                </div>
                                                <p>Reputazione: {user.reputation}</p>
                                                <p>Tokens: {user.tokens} • Balance: {myBalance}</p>
                                                <p>Completed missions: {user.completedMissions.length}</p>
                                          </div>
                                    )}
                              </Card>

                              <Card title="Quick Navigation" style={{ marginTop: 12 }}>
                                    <div style={{ display: "flex", gap: 8 }}>
                                          <a href="/forum">Forum</a>
                                          <a href="/journey">Journey</a>
                                          <a href="/wallet">Wallet</a>
                                    </div>
                              </Card>
                        </div>

                        <div>
                              <Card title="Activity Overview">
                                    <p>Active missions: {missions.length}</p>
                                    <div style={{ marginTop: 8 }}>
                                          <h4>Recent Activity</h4>
                                          <ul>
                                                {activities.map((a) => (
                                                      <li key={a.id} style={{ fontSize: 13 }}>{a.timestamp.split("T")[0]} — {a.type} — {JSON.stringify(a.data)}</li>
                                                ))}
                                          </ul>
                                    </div>
                              </Card>

                                    <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
                                    <Card title="Platform Stats">
                                          <p>Utenti registrati: {stats.totalUsers}</p>
                                          <p>Missioni completate: {stats.missionsCompleted}</p>
                                          <p>Tokens distribuiti: {stats.tokensDistributed}</p>
                                          <p>Proposte create: {stats.proposalsCreated}</p>
                                    </Card>

                                    <Card title="Economy" style={{ marginLeft: 12 }}>
                                          <p>Balance: {myBalance} ⛃</p>
                                          <p>Oggi: {tokensToday} ⛃</p>
                                          <p>Questa settimana: {tokensWeek} ⛃</p>
                                    </Card>

                                          <Card title="Badges">
                                                <p>Badge ottenuti: {user ? (user.badges || []).join(", ") : "-"}</p>
                                          </Card>
                              </div>

                                    <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
                                          <Card title="Leaderboard Preview">
                                                <ol>
                                                      {leaderboard.map((l) => (
                                                            <li key={l.id} style={{ marginBottom: 6 }}>
                                                                  <b>{l.username}</b> — {l.reputation} • {Math.round(l.tokens)} ⛃
                                                            </li>
                                                      ))}
                                                </ol>
                                                <div style={{ marginTop: 8 }}>
                                                      <b>Your rank:</b> {myRank ?? "-"}
                                                </div>
                                          </Card>
                                    </div>
                        </div>
                  </div>
            </div>
      )
}