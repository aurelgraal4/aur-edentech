import { getGlobalFeed } from "./activityEngine"
import { getRegisteredUsers } from "./activityEngine"

// Rank posts by author reputation, engagement and recency
export function rankPosts(posts: any[]) {
  const feed = getGlobalFeed()
  const users = getRegisteredUsers()

  function authorReputation(userId: string) {
    const u = users.find((x: any) => x.id === userId)
    return u?.reputation ?? 0
  }

  return posts
    .map((p) => {
      const postActivities = feed.filter((f) => f.type === "POST_CREATED" && (f.data?.postId ?? String(f.data?.id)) == p.id)
      const related = feed.filter((f) => f.data?.postId == p.id || f.data?.missionId == p.id)
      const engagement = (p.validations ?? 0) + related.length
      const author = p.userId ?? postActivities[0]?.user?.id
      const rep = author ? authorReputation(author) : 0
      const ageMs = Date.now() - (new Date(postActivities[0]?.timestamp ?? Date.now()).getTime())
      const recencyScore = Math.max(0, 1 - ageMs / (1000 * 60 * 60 * 24 * 7)) // 7 days window
      const score = rep * 0.6 + engagement * 10 + recencyScore * 100
      return { ...p, score, rep, engagement, recencyScore }
    })
    .sort((a, b) => b.score - a.score)
}
