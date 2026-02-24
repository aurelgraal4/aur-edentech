import { create } from "zustand"

export type Mission = {
  id: string
    title: string
      description: string
        impact: string
          reward: number
            status: "available" | "review" | "completed"
            }

            type MissionState = {
              wallet: number
                missions: Mission[]
                  completeMission: (id: string) => void
                  }

                  export const useMissionStore = create<MissionState>((set) => ({
                    wallet: 120,

                      missions: [
                          {
                                id: "1",
                                      title: "Aiuta una persona oggi",
                                            description:
                                                    "Fai qualcosa di concreto per aiutare qualcuno nella vita reale e raccontalo alla community.",
                                                          impact: "Sociale",
                                                                reward: 10,
                                                                      status: "completed"
                                                                          },
                                                                              {
                                                                                    id: "2",
                                                                                          title: "Riduci uno spreco",
                                                                                                description:
                                                                                                        "Individua uno spreco nella tua vita quotidiana e cambialo realmente.",
                                                                                                              impact: "Ambientale",
                                                                                                                    reward: 12,
                                                                                                                          status: "completed"
                                                                                                                              },
                                                                                                                                  {
                                                                                                                                        id: "3",
                                                                                                                                              title: "Condividi conoscenza utile",
                                                                                                                                                    description:
                                                                                                                                                            "Spiega qualcosa che sai fare e che può aiutare altre persone.",
                                                                                                                                                                  impact: "Culturale",
                                                                                                                                                                        reward: 15,
                                                                                                                                                                              status: "available"
                                                                                                                                                                                  },
                                                                                                                                                                                      {
                                                                                                                                                                                            id: "4",
                                                                                                                                                                                                  title: "Migliora uno spazio",
                                                                                                                                                                                                        description:
                                                                                                                                                                                                                "Sistema, pulisci o migliora uno spazio attorno a te.",
                                                                                                                                                                                                                      impact: "Ambientale",
                                                                                                                                                                                                                            reward: 20,
                                                                                                                                                                                                                                  status: "available"
                                                                                                                                                                                                                                      },
                                                                                                                                                                                                                                          {
                                                                                                                                                                                                                                                id: "5",
                                                                                                                                                                                                                                                      title: "Supporta un progetto locale",
                                                                                                                                                                                                                                                            description:
                                                                                                                                                                                                                                                                    "Dai visibilità o aiuto concreto a un progetto della tua zona.",
                                                                                                                                                                                                                                                                          impact: "Sociale",
                                                                                                                                                                                                                                                                                reward: 25,
                                                                                                                                                                                                                                                                                      status: "available"
                                                                                                                                                                                                                                                                                          }
                                                                                                                                                                                                                                                                                            ],

                                                                                                                                                                                                                                                                                              completeMission: (id) =>
                                                                                                                                                                                                                                                                                                  set((state) => {
                                                                                                                                                                                                                                                                                                        const mission = state.missions.find((m) => m.id === id)

                                                                                                                                                                                                                                                                                                              if (!mission || mission.status !== "available") return state

                                                                                                                                                                                                                                                                                                                    return {
                                                                                                                                                                                                                                                                                                                            wallet: state.wallet + mission.reward,
                                                                                                                                                                                                                                                                                                                                    missions: state.missions.map((m) =>
                                                                                                                                                                                                                                                                                                                                              m.id === id
                                                                                                                                                                                                                                                                                                                                                          ? { ...m, status: "completed" }
                                                                                                                                                                                                                                                                                                                                                                      : m
                                                                                                                                                                                                                                                                                                                                                                              )
                                                                                                                                                                                                                                                                                                                                                                                    }
                                                                                                                                                                                                                                                                                                                                                                                        })
                                                                                                                                                                                                                                                                                                                                                                                        }))