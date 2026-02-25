import { incrementTokensDistributed } from "./platformStats"

export type Transaction = {
  id: string
  type: "earn" | "spend" | "send" | "receive"
  amount: number
  reason?: string
  timestamp: string
}

const userBalances: Record<string, number> = {}
const userTransactions: Record<string, Transaction[]> = {}

function makeId() {
  return Date.now().toString() + Math.random().toString(36).slice(2, 8)
}

export function getBalance(userId?: string) {
  if (!userId) return Object.values(userBalances).reduce((s, v) => s + v, 0)
  return userBalances[userId] ?? 0
}

export function getTransactionHistory(userId: string) {
  return (userTransactions[userId] || []).slice().sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1))
}

export function earnTokens(userId: string, amount: number, reason?: string) {
  userBalances[userId] = (userBalances[userId] || 0) + amount
  const t: Transaction = { id: makeId(), type: "earn", amount, reason, timestamp: new Date().toISOString() }
  userTransactions[userId] = [t, ...(userTransactions[userId] || [])]
  incrementTokensDistributed(amount)
  return t
}

export function spendTokens(userId: string, amount: number, reason?: string) {
  userBalances[userId] = Math.max(0, (userBalances[userId] || 0) - amount)
  const t: Transaction = { id: makeId(), type: "spend", amount: -Math.abs(amount), reason, timestamp: new Date().toISOString() }
  userTransactions[userId] = [t, ...(userTransactions[userId] || [])]
  return t
}

export function sendTokens(fromUserId: string, toUserId: string, amount: number, reason?: string) {
  spendTokens(fromUserId, amount, `send:${reason || "transfer"}`)
  const t = earnTokens(toUserId, amount, `receive:${reason || "transfer"}`)
  return t
}

