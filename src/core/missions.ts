import { logActivity } from "./activityEngine"
import { incrementMissionsCompleted } from "./platformStats"
import { earnTokens } from "./economy"

export type Mission = {
  id: string
  title: string
  description: string
  reward: number
  completed: boolean
}

let missions: Mission[] = [
  { id: "m1", title: "Onboard 3 users", description: "Help three new users join the platform.", reward: 50, completed: false },
  { id: "m2", title: "Publish mission", description: "Create a mission in the forum and gather validations.", reward: 30, completed: false },
  { id: "m3", title: "Validate a mission", description: "Validate another user's mission.", reward: 20, completed: false },
]

export function getActiveMissions() {
  return missions.filter((m) => !m.completed)
}

export function completeMission(id: string) {
  missions = missions.map((m) => (m.id === id ? { ...m, completed: true } : m))
  const mission = missions.find((m) => m.id === id) ?? null
  return mission
}

// complete mission for a user: reward tokens and reputation and log externally
export function completeMissionForUser(userId: string, id: string, earnTokensFn: (u: string, a: number, r?: string) => any) {
  const m = completeMission(id)
  if (!m) return null
  // reward
  if (earnTokensFn) earnTokensFn(userId, m.reward, `mission:${id}`)
  else {
    try { earnTokens(userId, m.reward, `mission:${id}`) } catch {}
  }
  logActivity("MISSION_COMPLETED", { missionId: id, reward: m.reward }, { id: userId, username: userId })
  incrementMissionsCompleted(1)

  return m
}
