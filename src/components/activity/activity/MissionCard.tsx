import type { Mission } from "../../../store/missionStore"
import { useMissionStore } from "../../../store/missionStore"

type Props = {
  mission: Mission
  }

  export default function MissionCard({ mission }: Props) {
    const completeMission = useMissionStore((state) => state.completeMission)

      const handleComplete = () => {
          completeMission(mission.id)
            }

              return (
                  <div className="bg-zinc-900 p-4 rounded-2xl border border-zinc-800 mb-4">
                        <h3 className="text-lg font-semibold text-white">
                                {mission.title}
                                      </h3>

                                            <p className="text-sm text-zinc-400 mt-2">
                                                    {mission.description}
                                                          </p>

                                                                <div className="flex justify-between items-center mt-4">
                                                                        <div className="text-sm text-zinc-300">
                                                                                  Impatto: {mission.impact}
                                                                                          </div>

                                                                                                  <div className="text-yellow-400 font-semibold">
                                                                                                            +{mission.reward} CANCELLIERE
                                                                                                                    </div>
                                                                                                                          </div>

                                                                                                                                {!mission.completed && (
                                                                                                                                        <button
                                                                                                                                                  onClick={handleComplete}
                                                                                                                                                            className="mt-4 w-full bg-emerald-600 hover:bg-emerald-500 text-white py-2 rounded-xl transition"
                                                                                                                                                                    >
                                                                                                                                                                              Completa missione
                                                                                                                                                                                      </button>
                                                                                                                                                                                            )}

                                                                                                                                                                                                  {mission.completed && (
                                                                                                                                                                                                          <div className="mt-4 text-emerald-400 text-sm">
                                                                                                                                                                                                                    Missione completata ✓
                                                                                                                                                                                                                            </div>
                                                                                                                                                                                                                                  )}
                                                                                                                                                                                                                                      </div>
                                                                                                                                                                                                                                        )
                                                                                                                                                                                                                                        }MissionCard