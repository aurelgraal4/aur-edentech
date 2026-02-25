let totalUsers = 0
let missionsCompleted = 0
let tokensDistributed = 0
let proposalsCreated = 0

import { getGlobalFeed } from "./activityEngine"
import { getTransactionHistory } from "./wallet"

export function registerNewUser() {
  totalUsers += 1
}

export function incrementMissionsCompleted(n = 1) {
  missionsCompleted += n
}

export function incrementTokensDistributed(n = 0) {
  tokensDistributed += n
}

export function incrementProposalsCreated(n = 1) {
  proposalsCreated += n
}

export function getPlatformStats() {
  return { totalUsers, missionsCompleted, tokensDistributed, proposalsCreated }
}

export function getActiveUsersToday() {
  const feed = getGlobalFeed()
  const since = Date.now() - 1000 * 60 * 60 * 24
  const recent = feed.filter((a) => new Date(a.timestamp).getTime() >= since)
  const uniq = new Set(recent.map((r) => r.user.id))
  return uniq.size
}

export function getPostsToday() {
  const feed = getGlobalFeed()
  const since = Date.now() - 1000 * 60 * 60 * 24
  return feed.filter((a) => a.type === "POST_CREATED" && new Date(a.timestamp).getTime() >= since).length
}

export function getTokensEarnedToday() {
  const since = Date.now() - 1000 * 60 * 60 * 24
  // aggregate from wallet transactions across users
  // as transactions are per-user, approximate by scanning known users (not tracked here) — fallback 0
  return 0
}
