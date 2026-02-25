import React from "react"
import Card from "../../shared/components/ui/Card"
import { useWalletStore } from "../../state/walletStore"
import { requestAccounts } from "../../core/web3/web3Provider"

export default function ProfileWallet() {
  const wallet = useWalletStore()

  async function connect() {
    try {
      const accounts = await requestAccounts()
      if (accounts && accounts.length) wallet.connect(accounts[0], "")
    } catch (e) { console.error(e) }
  }

  function disconnect() {
    wallet.disconnect()
  }

  return (
    <Card title="Wallet">
      <div>
        <div>MetaMask: {wallet.connected ? 'Connected' : 'Disconnected'}</div>
        {wallet.connected ? (
          <div>
            <div>Address: {wallet.address}</div>
            <div>Balance: {wallet.balance} ETH</div>
            <button onClick={disconnect}>Disconnect</button>
          </div>
        ) : (
          <button onClick={connect}>Connect</button>
        )}
      </div>
    </Card>
  )
}
