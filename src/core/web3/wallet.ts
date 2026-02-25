import { isBaseChain } from "./network"

function strip0x(input: string) {
  if (!input) return input
  return input.startsWith("0x") ? input.slice(2) : input
}

function pad32(hex: string) {
  return hex.padStart(64, "0")
}

function encodeAddressParam(address: string) {
  return pad32(strip0x(address).toLowerCase())
}

export async function readERC20Balance(provider: any, tokenAddress: string, userAddress: string) {
  // use eth_call with balanceOf selector
  const selector = "0x70a08231"
  const data = selector + encodeAddressParam(userAddress)
  const call = await provider.request({ method: "eth_call", params: [{ to: tokenAddress, data }, "latest"] })
  if (!call) return { raw: "0x0", formatted: "0", decimals: 18 }
  const raw = call as string
  const value = BigInt(raw)
  // read decimals
  let decimals = 18
  try {
    const decSel = "0x313ce567"
    const decCall = await provider.request({ method: "eth_call", params: [{ to: tokenAddress, data: decSel }, "latest"] })
    if (decCall) decimals = Number(BigInt(decCall))
  } catch {}
  const denom = BigInt(10) ** BigInt(decimals)
  const formatted = (Number(value) / Number(denom)).toString()
  return { raw, formatted, decimals }
}

export async function getEthBalance(provider: any, address: string) {
  const b = await provider.request({ method: "eth_getBalance", params: [address, "latest"] })
  const v = BigInt(b)
  const eth = Number(v) / Number(BigInt(10) ** BigInt(18))
  return eth
}

export async function ensureBaseNetwork(provider: any) {
  const chainId = await provider.request({ method: "eth_chainId" })
  return isBaseChain(chainId)
}
