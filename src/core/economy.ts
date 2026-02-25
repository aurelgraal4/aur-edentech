import { earnTokens as walletEarn, spendTokens as walletSpend, getBalance as walletBalance, getTransactionHistory as walletHistory } from "./wallet"

export function earnTokens(userId: string, amount: number, reason?: string) {
  return walletEarn(userId, amount, reason)
}

export function spendTokens(userId: string, amount: number, reason?: string) {
  return walletSpend(userId, amount, reason)
}

export function getUserBalance(userId: string) {
  return walletBalance(userId)
}

export function getTransactionHistory(userId: string) {
  return walletHistory(userId)
}
