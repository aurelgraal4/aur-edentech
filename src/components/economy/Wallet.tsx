import { useMissionStore } from "../../store/missionStore"

export default function Wallet() {
  const wallet = useMissionStore((s) => s.wallet)

    return (
        <div className="bg-zinc-900 p-5 rounded-xl border border-zinc-800">
              <h2 className="text-lg mb-1">Wallet</h2>

                    <p className="text-3xl font-bold text-yellow-400">
                            {wallet} CANCELLIERE
                                  </p>

                                        <p className="text-sm text-zinc-400 mt-2">
                                                Guadagnati completando missioni validate dalla community.
                                                      </p>
                                                          </div>
                                                            )
                                                            }