import React from "react"
import Card from "../../shared/components/ui/Card"
import { useUser } from "../../app/providers/UserProvider"
import { getTransactionHistory, getBalance } from "../../core/wallet"

export default function CoinCard() {
  const { user } = useUser()
  const balance = user ? getBalance(user.id) : 0
  const tx = user ? getTransactionHistory(user.id).slice(0, 4) : []

  return (
    <Card title="Coin Snapshot">
      <div>
        <div><b>Token balance:</b> {balance}</div>
        <div style={{ marginTop: 8 }}>
          <b>Recent:</b>
          <ul>
            {tx.map((t) => (
              <li key={t.id} style={{ fontSize: 13 }}>{t.timestamp} — {t.type} — {t.amount}</li>
            ))}
          </ul>
        </div>
      </div>
    </Card>
  )
}
