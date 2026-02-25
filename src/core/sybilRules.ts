export type Signals = {
  accountAgeDays?: number
  walletAgeDays?: number
  txPatternScore?: number // 0..100
  activityFreqPerHour?: number
  duplicateWallets?: boolean
  duplicateIpHash?: boolean
  governanceSpamScore?: number // 0..100
  rewardFarmingScore?: number // 0..100
}

export function assessRisk(signals: Signals) {
  // base 0..100
  let score = 0
  const flags: string[] = []

  // account age: young accounts increase risk
  const age = signals.accountAgeDays ?? 365
  if (age < 7) { score += 25; flags.push("young_account") }
  else if (age < 30) { score += 10 }

  // wallet age
  const wAge = signals.walletAgeDays ?? 365
  if (wAge < 7) { score += 20; flags.push("young_wallet") }

  // tx pattern score: higher is more suspicious
  score += Math.min(100, signals.txPatternScore ?? 0) * 0.3
  if ((signals.txPatternScore ?? 0) > 60) flags.push("suspicious_tx_pattern")

  // activity frequency: many actions/hour
  const freq = signals.activityFreqPerHour ?? 0
  if (freq > 50) { score += 30; flags.push("high_activity_freq") }
  else if (freq > 10) { score += 8 }

  // duplicates
  if (signals.duplicateWallets) { score += 25; flags.push("duplicate_wallets") }
  if (signals.duplicateIpHash) { score += 20; flags.push("duplicate_ip") }

  // governance spam
  score += (signals.governanceSpamScore ?? 0) * 0.4
  if ((signals.governanceSpamScore ?? 0) > 50) flags.push("governance_spam")

  // reward farming
  score += (signals.rewardFarmingScore ?? 0) * 0.5
  if ((signals.rewardFarmingScore ?? 0) > 50) flags.push("reward_farming")

  // clamp
  score = Math.max(0, Math.min(100, Math.round(score)))

  return { score, flags }
}

export default { assessRisk }
