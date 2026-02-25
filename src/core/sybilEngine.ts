import { subscribe, emit, Events } from "./eventBus"
import { getUserFeed, getUserStats, getRegisteredUsers } from "./activityEngine"
import { getTransactionHistory } from "./wallet"
import rules from "./sybilRules"
import { updateRisk, flagUser } from "../state/sybilStore"

// assess and maintain risk profiles
const processed = new Set<string>()

function makeKey(e: any) {
  return e.id || e.payload?.id || `${e.type}:${e.timestamp || Date.now()}`
}

function analyzeUserSignals(userId: string) {
  // gather signals
  const feed = getUserFeed(userId)
  const stats = getUserStats(userId)
  const tx = getTransactionHistory(userId)

  const now = Date.now()
  // approximate account age if provided in user registration data (not available here) - default 365
  const accountAgeDays = 365
  // wallet age approximate from first tx
  const walletAgeDays = tx.length ? Math.max(0, Math.floor((now - new Date(tx[tx.length - 1].timestamp).getTime()) / (1000 * 60 * 60 * 24))) : 365

  // tx pattern score: many small txs in last 24h
  const last24 = tx.filter((t) => new Date(t.timestamp).getTime() >= now - 1000 * 60 * 60 * 24)
  const smallTxs = last24.filter((t) => Math.abs(t.amount) <= 5).length
  const txPatternScore = Math.min(100, Math.floor((smallTxs / Math.max(1, last24.length)) * 100))

  // activity frequency: actions per hour (last 1 hour)
  const lastHour = feed.filter((a) => new Date(a.timestamp).getTime() >= now - 1000 * 60 * 60)
  const activityFreqPerHour = lastHour.length

  // duplicate wallets / ip - best-effort from payloads in feed
  const walletIds = new Set<string>()
  const ipHashes = new Set<string>()
  feed.forEach((a: any) => {
    if (a.data?.walletId) walletIds.add(a.data.walletId)
    if (a.data?.ipHash) ipHashes.add(a.data.ipHash)
  })
  const duplicateWallets = walletIds.size > 1
  const duplicateIpHash = ipHashes.size > 1

  // governance spam & reward farming approximations
  const governanceSpamScore = (stats.votesCast || 0) > 50 ? 80 : (stats.votesCast || 0) > 10 ? 30 : 0
  // reward farming: many token earns in short time
  const tokensEarnedEvents = feed.filter((a) => a.type === "TOKENS_EARNED" || a.type === "TOKENS_EARNED")
  const recentEarns = tokensEarnedEvents.filter((a) => new Date(a.timestamp).getTime() >= now - 1000 * 60 * 60 * 24).length
  const rewardFarmingScore = recentEarns > 20 ? 80 : recentEarns > 5 ? 30 : 0

  const signals = {
    accountAgeDays,
    walletAgeDays,
    txPatternScore,
    activityFreqPerHour,
    duplicateWallets,
    duplicateIpHash,
    governanceSpamScore,
    rewardFarmingScore,
  }

  const res = rules.assessRisk(signals)
  const profile = updateRisk(userId, res.score, res.flags)

  if (profile.score > 70) {
    // emit sybil alert
    try { emit({ type: "SYBIL_ALERT", userId, payload: { score: profile.score, flags: profile.flags } }) } catch {}
    try { flagUser(userId, "sybil_alert") } catch {}
  }

  return profile
}

// subscribe to event bus
const watched = [
  Events.POST_CREATED,
  Events.POST_VOTED,
  Events.MISSION_COMPLETED,
  Events.TOKEN_EARNED,
]

watched.forEach((ev) => subscribe(ev, (e) => {
  try {
    const key = makeKey(e)
    if (processed.has(key)) return
    processed.add(key)
    const uid = e.userId || e.payload?.userId || e.payload?.user?.id || e.payload?.authorId || e.payload?.actorId
    if (!uid) return
    analyzeUserSignals(uid)
  } catch {}
}))

// also listen to common lower-case names
subscribe("activity_created", (e) => {
  const uid = e.userId || e.payload?.userId || e.payload?.user?.id
  if (!uid) return
  analyzeUserSignals(uid)
})

subscribe("reward_received", (e) => {
  const uid = e.userId || e.payload?.userId || e.payload?.toUserId
  if (!uid) return
  analyzeUserSignals(uid)
})

subscribe("wallet_connected", (e) => {
  const uid = e.userId || e.payload?.userId
  if (!uid) return
  analyzeUserSignals(uid)
})

subscribe("vote_cast", (e) => {
  const uid = e.userId || e.payload?.userId || e.payload?.voterId
  if (!uid) return
  analyzeUserSignals(uid)
})

export default { analyzeUserSignals }
