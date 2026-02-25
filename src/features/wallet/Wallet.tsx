import React, { useEffect, useState } from "react"
import { getBalance, getTransactionHistory, sendTokens, Transaction } from "../../core/wallet"
import { useUser } from "../../app/providers/UserProvider"
import { requestAccounts, getChainId, switchToBase, onAccountsChanged, onChainChanged } from "../../core/web3/web3Provider"
import { getEthBalance, readERC20Balance } from "../../core/web3/wallet"
import { useWalletStore } from "../../state/walletStore"

export default function WalletComp() {
  const { user } = useUser()
  const [balance, setBalance] = useState<number>(0)
  const [history, setHistory] = useState<Transaction[]>([])
  const wallet = useWalletStore()

  function refresh() {
    const id = user?.id
    setBalance(getBalance(id))
    setHistory(getTransactionHistory(id || ""))
    // web3 balances
    if (wallet.connected && wallet.address && (window as any).ethereum) {
      getEthBalance((window as any).ethereum, wallet.address).then((b) => wallet.setBalance(b)).catch(() => {})
    }
  }

  useEffect(() => {
    refresh()
    const offAccounts = onAccountsChanged((accounts: string[]) => {
      if (accounts && accounts.length > 0) {
        wallet.connect(accounts[0], "")
      } else {
        wallet.disconnect()
      }
    })

    const offChain = onChainChanged((chainId: string) => {
      wallet.setNetwork(chainId, chainId === "0x2105")
    })

    return () => {
      try { offAccounts() } catch {}
      try { offChain() } catch {}
    }
  }, [user])

  function handleSend() {
    if (!user) return
    sendTokens(user.id, "shop", 10, "Test send")
    refresh()
  }

  async function connectWallet() {
    try {
      const accounts = await requestAccounts()
      const addr = accounts[0]
      const chain = await getChainId()
      wallet.connect(addr, chain)
      wallet.setNetwork(chain, chain === "0x2105")
      // if not base, try switch
      if (chain !== "0x2105") {
        try { await switchToBase(); wallet.setNetwork("0x2105", true) } catch {}
      }
      // fetch ETH balance
      try {
        const eth = await getEthBalance((window as any).ethereum, addr)
        wallet.setBalance(eth)
      } catch {}
    } catch (e) {
      console.error(e)
    }
  }

  const weekAgo = Date.now() - 1000 * 60 * 60 * 24 * 7
  const tokensWeek = history.filter((t) => t.type === "earn" && new Date(t.timestamp).getTime() >= weekAgo).reduce((s, t) => s + t.amount, 0)

  return (
    <div style={{ background: "#111", padding: 20, borderRadius: 12, border: "1px solid #333", marginBottom: 20 }}>
      <h2>Wallet</h2>

      <div style={{ fontSize: 28, marginTop: 10 }}>{wallet.connected ? `${wallet.balance} ETH` : `${balance} ⛃`}</div>

      <div style={{ marginTop: 8 }}>
        {!wallet.connected ? (
          <button onClick={connectWallet}>Connect Wallet</button>
        ) : (
          <div>
            <div>Network: {wallet.network} {wallet.isCorrectNetwork ? "(Base)" : "(Wrong network)"}</div>
            <div>Address: {wallet.address}</div>
          </div>
        )}
      </div>

      <p style={{ opacity: 0.7, marginTop: 10 }}>Guadagnati completando missioni validate dalla community.</p>

      <div style={{ marginTop: 12 }}>
        <button onClick={handleSend}>Send 10</button>
      </div>

      <div style={{ marginTop: 16 }}>
        <h4>Recent Transactions</h4>
        <ul>
          {history.map((t) => (
            <li key={t.id}>{t.timestamp} — {t.type} — {t.amount} — {t.reason}</li>
          ))}
        </ul>
        <div style={{ marginTop: 8 }}><b>Tokens earned this week:</b> {tokensWeek}</div>
      </div>
    </div>
  )
}
