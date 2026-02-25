import { getUserFeed } from "./activityEngine"

export type Badge = {
  id: string
  name: string
  description: string
  icon?: string
  requirement?: string
}

export const BADGES: Badge[] = [
  { id: "first_mission", name: "First Mission", description: "Completed your first mission", icon: "🏁", requirement: "missionsCompleted >= 1" },
  { id: "first_proposal", name: "First Proposal", description: "Created your first governance proposal", icon: "📜", requirement: "proposalsCreated >= 1" },
  { id: "community_voice", name: "Community Voice", description: "Cast many votes or published many posts", icon: "📣", requirement: "posts >= 10 || votesCast >= 30" },
  { id: "top_builder", name: "Top Builder", description: "Completed 10+ missions", icon: "🛠️", requirement: "missionsCompleted >= 10" },
  { id: "early_guardian", name: "Early Guardian", description: "Reached Guardian level early", icon: "🛡️", requirement: "reputation >= 1500" },
]

export function listBadges() {
  return BADGES
}

export function getBadgeById(id: string) {
  return BADGES.find((b) => b.id === id) ?? null
}

// checkBadges now accepts user counters to evaluate quickly
export function checkBadges(user: any, counters: any = {}) {
  if (!user) return []
  const existing = new Set(user.badges || [])
  const earned: string[] = []

  const feed = getUserFeed(user.id)
  const posts = counters.posts ?? feed.filter((a) => a.type === "POST_CREATED").length
  const proposals = counters.proposalsCreated ?? feed.filter((a) => a.type === "PROPOSAL_CREATED").length
  const missions = counters.missionsCompleted ?? (user.completedMissions || []).length
  const votes = counters.votesCast ?? feed.filter((a) => a.type === "PROPOSAL_VOTE").length
  const tokens = user.tokens ?? 0
  const reputation = user.reputation ?? 0

  if (missions >= 1 && !existing.has("first_mission")) earned.push("first_mission")
  if (proposals >= 1 && !existing.has("first_proposal")) earned.push("first_proposal")
  if ((posts >= 10 || votes >= 30) && !existing.has("community_voice")) earned.push("community_voice")
  if (missions >= 10 && !existing.has("top_builder")) earned.push("top_builder")
  if (reputation >= 1500 && !existing.has("early_guardian")) earned.push("early_guardian")

  return earned
}
