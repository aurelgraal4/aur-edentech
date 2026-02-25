import * as TP from "./tokenProtocol"
import { getTransactionHistory as walletHistory, getBalance as walletBalance } from "./wallet"

export function earnTokens(userId: string, amount: number, reason?: string) {
  return TP.earn(userId, amount, reason)
}

export function spendTokens(userId: string, amount: number, reason?: string) {
  return TP.spend(userId, amount, reason)
}

export function getUserBalance(userId: string) {
  // wallet balance is authoritative
  return walletBalance(userId)
}

export function getTransactionHistory(userId: string) {
  return walletHistory(userId)
}
