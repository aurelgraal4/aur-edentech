export const BASE_MAINNET = {
  chainId: "0x2105",
  chainName: "Base Mainnet",
  rpcUrls: ["https://mainnet.base.org"],
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  blockExplorerUrls: ["https://base.blockscout.com"]
}

export function isBaseChain(chainIdHex: string | number) {
  if (!chainIdHex) return false
  const hex = typeof chainIdHex === "number" ? `0x${chainIdHex.toString(16)}` : String(chainIdHex)
  return hex.toLowerCase() === BASE_MAINNET.chainId.toLowerCase()
}
