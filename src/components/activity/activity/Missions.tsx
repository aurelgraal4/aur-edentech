import { useEffect, useState } from "react"

type Mission = {
  id: number
    title: string
      description: string
        impact: string
        }

        export default function Missions() {
          const [missions, setMissions] = useState<Mission[]>([])

            useEffect(() => {
                // missioni temporanee finché non colleghiamo il backend
                    setMissions([
                          {
                                  id: 1,
                                          title: "Pulizia Parco",
                                                  description: "Organizzare pulizia collettiva",
                                                          impact: "Ambiente"
                                                                },
                                                                      {
                                                                              id: 2,
                                                                                      title: "Aiuto Anziani",
                                                                                              description: "Supporto spesa settimanale",
                                                                                                      impact: "Comunità"
                                                                                                            }
                                                                                                                ])
                                                                                                                  }, [])

                                                                                                                    return (
                                                                                                                        <div style={{ padding: 20 }}>
                                                                                                                              <h2>Missioni Attive</h2>

                                                                                                                                    {missions.map(m => (
                                                                                                                                            <div
                                                                                                                                                      key={m.id}
                                                                                                                                                                style={{
                                                                                                                                                                            border: "1px solid #333",
                                                                                                                                                                                        padding: 15,
                                                                                                                                                                                                    marginBottom: 10,
                                                                                                                                                                                                                borderRadius: 8
                                                                                                                                                                                                                          }}
                                                                                                                                                                                                                                  >
                                                                                                                                                                                                                                            <h3>{m.title}</h3>
                                                                                                                                                                                                                                                      <p>{m.description}</p>
                                                                                                                                                                                                                                                                <small>Impatto: {m.impact}</small>
                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                                              ))}
                                                                                                                                                                                                                                                                                  </div>
                                                                                                                                                                                                                                                                                    )
                                                                                                                                                                                                                                                                                }