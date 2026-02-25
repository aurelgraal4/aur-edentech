import { getRegisteredUsers } from "./activityEngine"

export type LeaderboardEntry = {
  id: string
  username: string
  reputation: number
  tokens: number
  completedMissions: number
  score: number
}

function scoreFor(u: any) {
  const rep = u.reputation ?? 0
  const tokens = u.tokens ?? 0
  const missions = (u.completedMissions && u.completedMissions.length) || 0
  // Weighted score: reputation weight 3, tokens weight 0.01, missions weight 50
  return rep * 3 + tokens * 0.01 + missions * 50
}

export function getLeaderboard(): LeaderboardEntry[] {
  const users = getRegisteredUsers()
  const entries = users.map((u: any) => ({
    id: u.id,
    username: u.username,
    reputation: u.reputation ?? 0,
    tokens: u.tokens ?? 0,
    completedMissions: (u.completedMissions && u.completedMissions.length) || 0,
    score: scoreFor(u),
  }))

  return entries.sort((a, b) => b.score - a.score)
}
