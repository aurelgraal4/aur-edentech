type Mission = {
      id: number
        problem: string
          intention: string
            context: string
            }

            export default function MissionCard({ mission }: { mission: Mission }) {
              return (
                  <div className="bg-black border border-emerald-700 rounded-xl p-4 mb-4">
                        <h3 className="text-emerald-400 font-bold mb-2">
                                Missione #{mission.id}
                                      </h3>

                                            <p className="text-white mb-1">
                                                    <span className="text-emerald-500">Problema:</span> {mission.problem}
                                                          </p>

                                                                <p className="text-white mb-1">
                                                                        <span className="text-emerald-500">Intenzione:</span> {mission.intention}
                                                                              </p>

                                                                                    <p className="text-gray-300 text-sm">
                                                                                            <span className="text-emerald-500">Contesto:</span> {mission.context}
                                                                                                  </p>

                                                                                                        <div className="flex gap-3 mt-3">
                                                                                                                <button className="bg-emerald-700 px-3 py-1 rounded">
                                                                                                                          Presente
                                                                                                                                  </button>

                                                                                                                                          <button className="bg-yellow-600 px-3 py-1 rounded">
                                                                                                                                                    Risuona
                                                                                                                                                            </button>
                                                                                                                                                                  </div>
                                                                                                                                                                      </div>
                                                                                                                                                                        )
                                                                                                                                                                        }