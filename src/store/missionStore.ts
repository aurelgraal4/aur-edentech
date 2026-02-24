import { create } from "zustand"

export type Mission = {
  id: number
    title: string
      description: string
        impact: string
          reward: number
          }

          type MissionState = {
            missions: Mission[]
              activeMissions: Mission[]
                completedMissions: Mission[]

                  startMission: (mission: Mission) => void
                    completeMission: (id: number) => void
                    }

                    export const useMissionStore = create<MissionState>((set, get) => ({
                      missions: [
                          {
                                id: 1,
                                      title: "Aiuta una persona",
                                            description: "Fai qualcosa di concreto per qualcuno.",
                                                  impact: "Sociale",
                                                        reward: 10
                                                            },
                                                                {
                                                                      id: 2,
                                                                            title: "Riduci uno spreco",
                                                                                  description: "Individua uno spreco nella tua vita e cambialo.",
                                                                                        impact: "Ambientale",
                                                                                              reward: 12
                                                                                                  },
                                                                                                      {
                                                                                                            id: 3,
                                                                                                                  title: "Condividi conoscenza",
                                                                                                                        description: "Insegna qualcosa di utile.",
                                                                                                                              impact: "Culturale",
                                                                                                                                    reward: 14
                                                                                                                                        },
                                                                                                                                            {
                                                                                                                                                  id: 4,
                                                                                                                                                        title: "Migliora uno spazio",
                                                                                                                                                              description: "Sistema o pulisci uno spazio comune.",
                                                                                                                                                                    impact: "Comunità",
                                                                                                                                                                          reward: 18
                                                                                                                                                                              },
                                                                                                                                                                                  {
                                                                                                                                                                                        id: 5,
                                                                                                                                                                                              title: "Supporta progetto locale",
                                                                                                                                                                                                    description: "Aiuta o promuovi un progetto positivo.",
                                                                                                                                                                                                          impact: "Sociale",
                                                                                                                                                                                                                reward: 20
                                                                                                                                                                                                                    }
                                                                                                                                                                                                                      ],

                                                                                                                                                                                                                        activeMissions: [],
                                                                                                                                                                                                                          completedMissions: [],

                                                                                                                                                                                                                            startMission: (mission) =>
                                                                                                                                                                                                                                set((state) => ({
                                                                                                                                                                                                                                      activeMissions: [...state.activeMissions, mission]
                                                                                                                                                                                                                                          })),

                                                                                                                                                                                                                                            completeMission: (id) => {
                                                                                                                                                                                                                                                const mission = get().activeMissions.find((m) => m.id === id)

                                                                                                                                                                                                                                                    if (!mission) return

                                                                                                                                                                                                                                                        set((state) => ({
                                                                                                                                                                                                                                                              activeMissions: state.activeMissions.filter((m) => m.id !== id),
                                                                                                                                                                                                                                                                    completedMissions: [...state.completedMissions, mission]
                                                                                                                                                                                                                                                                        }))
                                                                                                                                                                                                                                                                          }
                                                                                                                                                                                                                                                                          }))