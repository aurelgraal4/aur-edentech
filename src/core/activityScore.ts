import { getUserFeed, getGlobalFeed, getUserStats } from "./activityEngine"

function weightFor(type: string) {
  switch (type) {
    case "POST_CREATED":
      return 5
    case "MISSION_COMPLETED":
      return 50
    case "PROPOSAL_CREATED":
      return 20
    case "PROPOSAL_VOTE":
      return 2
    case "TOKENS_EARNED":
      return 0.01
    default:
      return 0
  }
}

function sumActivities(activities: any[]) {
  return activities.reduce((s, a) => s + weightFor(a.type) * (a.data?.amount ?? 1), 0)
}

export function getUserScore(userId: string) {
  const feed = getUserFeed(userId)
  const userScore = sumActivities(feed)
  return { userScore }
}

export function getDailyScore(userId: string) {
  const since = Date.now() - 1000 * 60 * 60 * 24
  const feed = getUserFeed(userId).filter((a) => new Date(a.timestamp).getTime() >= since)
  return { dailyScore: sumActivities(feed) }
}

export function getWeeklyScore(userId: string) {
  const since = Date.now() - 1000 * 60 * 60 * 24 * 7
  const feed = getUserFeed(userId).filter((a) => new Date(a.timestamp).getTime() >= since)
  return { weeklyScore: sumActivities(feed) }
}

export function getAllScores() {
  const users: any[] = []
  const feed = getGlobalFeed()
  // collect unique user ids
  const ids = Array.from(new Set(feed.map((f) => f.user.id)))
  ids.forEach((id) => {
    const { userScore } = getUserScore(id)
    const { dailyScore } = getDailyScore(id)
    const { weeklyScore } = getWeeklyScore(id)
    const stats = getUserStats(id)
    users.push({ id, userScore, dailyScore, weeklyScore, stats })
  })
  return users
}
