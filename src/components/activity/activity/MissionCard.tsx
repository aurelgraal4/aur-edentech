import { Mission, useMissionStore } from "../../../store/missionStore"

type Props = {
  mission: Mission
  }

  export default function MissionCard({ mission }: Props) {
    const completeMission = useMissionStore((state) => state.completeMission)

      const isCompleted = mission.status === "completed"
        const isAvailable = mission.status === "available"

          return (
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 mb-4">
                    <h3 className="text-lg font-semibold text-white mb-1">
                            {mission.title}
                                  </h3>

                                        <p className="text-sm text-zinc-400 mb-3">
                                                {mission.description}
                                                      </p>

                                                            <div className="text-sm text-zinc-500 mb-2">
                                                                    Impatto: {mission.impact}
                                                                          </div>

                                                                                <div className="text-emerald-400 font-semibold mb-3">
                                                                                        +{mission.reward} CANCELLlERE
                                                                                              </div>

                                                                                                    {isCompleted && (
                                                                                                            <div className="text-emerald-400 text-sm">
                                                                                                                      Missione completata ✓
                                                                                                                              </div>
                                                                                                                                    )}

                                                                                                                                          {isAvailable && (
                                                                                                                                                  <button
                                                                                                                                                            onClick={() => completeMission(mission.id)}
                                                                                                                                                                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm px-4 py-2 rounded-lg transition"
                                                                                                                                                                              >
                                                                                                                                                                                        Completa missione
                                                                                                                                                                                                </button>
                                                                                                                                                                                                      )}
                                                                                                                                                                                                          </div>
                                                                                                                                                                                                            )
                                                                                                                                                                                                            }