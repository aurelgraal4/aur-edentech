import { earnTokens as walletEarn, spendTokens as walletSpend, getBalance as walletBalance } from "./wallet"
import { logActivity as simpleLog } from "./activity"

export type LevelName = "newcomer" | "citizen" | "senator" | "chancellor" | "sovereign"

const LEVEL_THRESHOLDS: Array<{ threshold: number; name: LevelName }> = [
  { threshold: 5000, name: "sovereign" },
  { threshold: 1500, name: "chancellor" },
  { threshold: 500, name: "senator" },
  { threshold: 100, name: "citizen" },
  { threshold: 0, name: "newcomer" },
]

export function earn(userId: string, amount: number, reason?: string) {
  const t = walletEarn(userId, amount, reason)
  try {
    simpleLog("TOKENS_EARNED", `${userId} earned ${amount} Cancelliere (${reason || "reward"})`)
  } catch {}
  return t
}

export function spend(userId: string, amount: number, context?: string) {
  const t = walletSpend(userId, amount, context)
  try {
    simpleLog("TOKENS_SPENT", `${userId} spent ${amount} Cancelliere (${context || "action"})`)
  } catch {}
  return t
}

export function getPowerSync(userReputation: number, userTokens: number) {
  return userReputation + userTokens * 0.5
}

// getPower attempts to read reputation from activityEngine at runtime to avoid circular imports
export async function getPower(userId: string) {
  let rep = 0
  try {
    const mod = await import("./activityEngine")
    const users = mod.getRegisteredUsers()
    const u = users.find((x: any) => x.id === userId)
    rep = u?.reputation ?? 0
  } catch {
    rep = 0
  }
  const tokens = walletBalance(userId)
  return getPowerSync(rep, tokens)
}

export async function getLevel(userId: string) {
  const power = await getPower(userId)
  for (const entry of LEVEL_THRESHOLDS) {
    if (power >= entry.threshold) return entry.name
  }
  return "newcomer"
}
