import { getGlobalFeed, getRegisteredUsers } from "./activityEngine"
import { rankPosts } from "./contentRanking"

export function getTrendingPosts(posts: any[]) {
  // use rankPosts but filter to recent
  const ranked = rankPosts(posts)
  return ranked.slice(0, 10)
}

export function getTrendingUsers() {
  const feed = getGlobalFeed()
  const users = getRegisteredUsers()
  const since = Date.now() - 1000 * 60 * 60 * 24 * 7
  const recent = feed.filter((a) => new Date(a.timestamp).getTime() >= since)
  const counts: Record<string, number> = {}
  recent.forEach((r) => { counts[r.user.id] = (counts[r.user.id] || 0) + 1 })
  const list = Object.keys(counts).map((id) => ({ id, count: counts[id], user: users.find((u: any) => u.id === id) }))
  return list.sort((a, b) => b.count - a.count).slice(0, 10)
}
