import { create } from "zustand"

type WalletStore = {
  connected: boolean
  address: string | null
  network: string | null
  balance: number
  isCorrectNetwork: boolean

  connect: (address: string, network: string) => void
  disconnect: () => void
  setBalance: (b: number) => void
  setNetwork: (n: string | null, correct?: boolean) => void
}

export const useWalletStore = create<WalletStore>((set) => ({
  connected: false,
  address: null,
  network: null,
  balance: 0,
  isCorrectNetwork: false,

  connect: (address, network) =>
    set({ connected: true, address, network, isCorrectNetwork: network === "0x2105" }),

  disconnect: () =>
    set({ connected: false, address: null, network: null, balance: 0, isCorrectNetwork: false }),

  setBalance: (b) => set({ balance: b }),
  setNetwork: (n, correct = false) => set({ network: n, isCorrectNetwork: correct }),
}))