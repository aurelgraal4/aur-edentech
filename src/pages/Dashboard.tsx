import React from "react"
import Card from "../shared/components/ui/Card"
import { useUser } from "../app/providers/UserProvider"
import usePlatform, { PlatformState as PlatformStateType } from "../hooks/usePlatform"
import type { Activity } from "../core/activityEngine"
import type { LeaderboardEntry } from "../core/leaderboard"
import type { Transaction } from "../core/wallet"
import { getBalance } from "../core/wallet"
import { getLevelFromReputation } from "../core/reputation"
import { getGlobalFeed } from "../core/activityEngine"
import ActivityFeed from "../features/activity/ActivityFeed"
import { getLeaderboard } from "../core/leaderboard"
import { getTransactionHistory, getBalance as getUserBalance } from "../core/wallet"
import { getPower, getLevel } from "../core/tokenProtocol"

export default function Dashboard() {
      const { user } = useUser()
      const { state: pState } = usePlatform()
      type MissionShape = { missionId: string; completedBy: string[]; lastCompleted?: number }
      const missions: MissionShape[] = Object.keys(pState.missions.byId || {}).map((k) => pState.missions.byId[k])
      const balance = getBalance()

      const levelInfo = user ? getLevelFromReputation(user.reputation) : null
      const activities: Activity[] = getGlobalFeed().slice(0, 6)
      const leaderboard: LeaderboardEntry[] = getLeaderboard().slice(0, 3)
      const stats: {
            totalUsers: number
            missionsCompleted: number
            tokensDistributed: number
            proposalsCreated: number
            activeSessions: number
            totalReputation: number
      } = {
            totalUsers: Object.keys(pState.users || {}).length,
            missionsCompleted: Object.values(pState.missions.byId || {}).reduce((s, m) => s + (m.completedBy?.length || 0), 0),
            tokensDistributed: pState.economy?.totalDistributed || 0,
            proposalsCreated: Object.keys(pState.governance.proposals || {}).length,
            activeSessions: Object.keys(pState.activeSessions || {}).length,
            totalReputation: Object.values(pState.reputation || {}).reduce((s, v) => s + (Number(v) || 0), 0),
      }
      const myRank = user ? getLeaderboard().findIndex((l) => l.id === user.id) + 1 : null
      const myBalance = user ? getUserBalance(user.id) : 0
      const tx: Transaction[] = user ? getTransactionHistory(user.id) : []
      const today = Date.now() - 1000 * 60 * 60 * 24
      const tokensToday = tx.filter((t) => t.type === "earn" && new Date(t.timestamp).getTime() >= today).reduce((s, t) => s + t.amount, 0)
      const week = Date.now() - 1000 * 60 * 60 * 24 * 7
      const tokensWeek = tx.filter((t) => t.type === "earn" && new Date(t.timestamp).getTime() >= week).reduce((s, t) => s + t.amount, 0)

      const [power, level] = user ? [null, null] : [null, null]

                  const [powerVal, setPowerVal] = React.useState<number | null>(null)
                  const [levelVal, setLevelVal] = React.useState<string | null>(null)

                  React.useEffect(() => {
                        let mounted = true
                        if (user) {
                              (async () => {
                                    try {
                                          const p = await getPower(user.id)
                                          const l = await getLevel(user.id)
                                          if (!mounted) return
                                          setPowerVal(p)
                                          setLevelVal(l)
                                    } catch (e) {
                                          console.error(e)
                                    }
                              })()
                        }
                        return () => { mounted = false }
                  }, [user])

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
                                                <p>Power: {powerVal ?? "-"} • Level: {levelVal ?? "-"}</p>
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
                                          <div style={{ marginTop: 8 }}>
                                                <ActivityFeed max={6} />
                                          </div>
                                    </div>
                              </Card>

                                    <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
                                    <Card title="Platform Stats">
                                          <p>Utenti registrati: {stats.totalUsers}</p>
                                          <p>Active sessions: {stats.activeSessions}</p>
                                          <p>Totale reputazione: {stats.totalReputation}</p>
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