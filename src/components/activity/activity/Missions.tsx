import MissionCard from "./MissionCard"
import { useMissionStore } from "../../../store/missionStore"

export default function Missions() {
  const missions = useMissionStore((state) => state.missions)

    return (
        <div className="mt-6">
              <h2 className="text-xl font-bold mb-4">
                      Missioni Correnti
                            </h2>

                                  {missions.map((mission) => (
                                          <MissionCard key={mission.id} mission={mission} />
                                                ))}
                                                    </div>
                                                      )
                                                      }