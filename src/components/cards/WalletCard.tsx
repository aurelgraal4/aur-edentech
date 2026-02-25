import React from "react"
import Card from "../../shared/components/ui/Card"
import { useWalletStore } from "../../state/walletStore"

export default function WalletCard() {
  const wallet = useWalletStore()

  return (
    <Card title="Wallet Snapshot">
      <div>
        <div><b>Connected:</b> {wallet.connected ? "Yes" : "No"}</div>
        <div><b>Network:</b> {wallet.network ?? "-"} {wallet.isCorrectNetwork ? "(Base)" : ""}</div>
        <div><b>Address:</b> {wallet.address ?? "-"}</div>
        <div style={{ marginTop: 8 }}><b>Balance:</b> {wallet.balance ?? 0} ETH</div>
      </div>
    </Card>
  )
}
