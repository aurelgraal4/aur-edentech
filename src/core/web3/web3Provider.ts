import { BASE_MAINNET } from "./network"

declare global {
  interface Window {
    ethereum?: any
  }
}

export function hasEthereum() {
  return typeof window !== "undefined" && !!window.ethereum
}

export async function requestAccounts() {
  if (!hasEthereum()) throw new Error("No ethereum provider")
  return await window.ethereum.request({ method: "eth_requestAccounts" })
}

export async function getAccounts() {
  if (!hasEthereum()) return []
  return await window.ethereum.request({ method: "eth_accounts" })
}

export async function getChainId() {
  if (!hasEthereum()) return null
  return await window.ethereum.request({ method: "eth_chainId" })
}

export async function switchToBase() {
  if (!hasEthereum()) throw new Error("No ethereum provider")
  try {
    await window.ethereum.request({ method: "wallet_switchEthereumChain", params: [{ chainId: BASE_MAINNET.chainId }] })
    return true
  } catch (switchError: any) {
    // 4902 -> chain not added
    if (switchError?.code === 4902 || switchError?.message?.includes("Unrecognized chain")) {
      try {
        await window.ethereum.request({ method: "wallet_addEthereumChain", params: [BASE_MAINNET] })
        return true
      } catch (addErr) {
        throw addErr
      }
    }
    throw switchError
  }
}

export function onAccountsChanged(cb: (accounts: string[]) => void) {
  if (!hasEthereum()) return () => {}
  window.ethereum.on("accountsChanged", cb)
  return () => window.ethereum.removeListener("accountsChanged", cb)
}

export function onChainChanged(cb: (chainId: string) => void) {
  if (!hasEthereum()) return () => {}
  window.ethereum.on("chainChanged", cb)
  return () => window.ethereum.removeListener("chainChanged", cb)
}
