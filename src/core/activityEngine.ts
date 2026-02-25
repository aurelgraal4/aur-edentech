export type Activity = {
  id: string
  type: string
  user: { id: string; username: string }
  timestamp: string
  data: any
}

const activities: Activity[] = []
const usersMap: Record<string, any> = {}

import { checkBadges } from "./badges"
import { earnTokens } from "./economy"

function ensureUser(u: { id: string; username: string }) {
  if (!usersMap[u.id]) {
    usersMap[u.id] = { id: u.id, username: u.username, reputation: 0, tokens: 0, completedMissions: [], badges: [], counters: { posts: 0, missionsCompleted: 0, proposalsCreated: 0, votesCast: 0, tokensEarned: 0 } }
  }
  return usersMap[u.id]
}

function makeId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export function registerUser(u: { id: string; username: string; reputation?: number; tokens?: number; completedMissions?: string[]; badges?: string[] }) {
  usersMap[u.id] = { ...(usersMap[u.id] || {}), ...u, counters: { ...(usersMap[u.id]?.counters || {}), posts: usersMap[u.id]?.counters?.posts || 0, missionsCompleted: usersMap[u.id]?.counters?.missionsCompleted || 0, proposalsCreated: usersMap[u.id]?.counters?.proposalsCreated || 0, votesCast: usersMap[u.id]?.counters?.votesCast || 0, tokensEarned: usersMap[u.id]?.counters?.tokensEarned || 0 } }
}

export function getRegisteredUsers() {
  return Object.values(usersMap)
}

export function logActivity(type: string, data: any, user?: { id: string; username: string }) {
  const actor = user ?? { id: "anon", username: "anonymous" }
  const a: Activity = { id: makeId(), type, user: actor, timestamp: new Date().toISOString(), data }
  activities.unshift(a)
  // update user counters and possibly assign badges
  if (user && user.id && usersMap) {
    const u = ensureUser(user)
    switch (type) {
      case "POST_CREATED":
        u.counters.posts = (u.counters.posts || 0) + 1
        // reward author with tokens
        try { earnTokens(user.id, 5, 'post_created') } catch {}
        break
      case "MISSION_COMPLETED":
        u.counters.missionsCompleted = (u.counters.missionsCompleted || 0) + 1
        try { earnTokens(user.id, 20, 'mission_completed') } catch {}
        break
      case "PROPOSAL_CREATED":
        u.counters.proposalsCreated = (u.counters.proposalsCreated || 0) + 1
        try { earnTokens(user.id, 15, 'proposal_created') } catch {}
        break
      case "PROPOSAL_VOTE":
        u.counters.votesCast = (u.counters.votesCast || 0) + 1
        try { earnTokens(user.id, 3, 'vote_cast') } catch {}
        break
      case "TOKENS_EARNED":
        try {
          const amount = data?.amount ?? 0
          u.counters.tokensEarned = (u.counters.tokensEarned || 0) + amount
        } catch {}
        break
    }

    // evaluate badges
    try {
      const newBadges = checkBadges(u, u.counters)
      if (newBadges && newBadges.length) {
        newBadges.forEach((b: string) => assignBadge(u.id, b))
      }
    } catch {}
  }

  return a
}

export function assignBadge(userId: string, badgeId: string) {
  const u = usersMap[userId]
  if (!u) return null
  u.badges = Array.from(new Set([...(u.badges || []), badgeId]))
  const badgeLog: Activity = { id: makeId(), type: "BADGE_EARNED", user: { id: u.id, username: u.username }, timestamp: new Date().toISOString(), data: { badgeId } }
  activities.unshift(badgeLog)
  return badgeLog
}

export function getUserStats(userId: string) {
  return usersMap[userId]?.counters || { posts: 0, missionsCompleted: 0, proposalsCreated: 0, votesCast: 0, tokensEarned: 0 }
}

export function getGlobalFeed() {
  return activities.slice().sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1))
}

export function getUserFeed(userId: string) {
  return activities.filter((a) => a.user?.id === userId).slice().sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1))
}

export function getRecentActivities(limit = 10) {
  return getGlobalFeed().slice(0, limit)
}
