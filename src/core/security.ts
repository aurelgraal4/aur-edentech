const lastPost: Record<string, number> = {}
const lastVote: Record<string, number> = {}
const dailyRewards: Record<string, { date: string; total: number }> = {}

const POST_COOLDOWN_MS = 1000 * 30 // 30s
const VOTE_COOLDOWN_MS = 1000 * 10 // 10s
const DAILY_REWARD_CAP = 1000

function todayKey() {
  return new Date().toISOString().slice(0, 10)
}

export function canPost(userId: string) {
  const now = Date.now()
  const last = lastPost[userId] || 0
  if (now - last < POST_COOLDOWN_MS) return { ok: false, wait: POST_COOLDOWN_MS - (now - last) }
  return { ok: true }
}

export function recordPost(userId: string, tokensGiven = 0) {
  lastPost[userId] = Date.now()
  const key = todayKey()
  const rec = dailyRewards[userId] || { date: key, total: 0 }
  if (rec.date !== key) {
    rec.date = key
    rec.total = 0
  }
  rec.total += tokensGiven
  dailyRewards[userId] = rec
  return rec.total
}

export function canVote(userId: string) {
  const now = Date.now()
  const last = lastVote[userId] || 0
  if (now - last < VOTE_COOLDOWN_MS) return { ok: false, wait: VOTE_COOLDOWN_MS - (now - last) }
  return { ok: true }
}

export function recordVote(userId: string) {
  lastVote[userId] = Date.now()
}

export function getDailyRewardTotal(userId: string) {
  const rec = dailyRewards[userId]
  if (!rec) return 0
  if (rec.date !== todayKey()) return 0
  return rec.total
}

export function canGiveReward(userId: string, amount: number) {
  const total = getDailyRewardTotal(userId)
  return total + amount <= DAILY_REWARD_CAP
}
