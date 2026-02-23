import { useEffect, useState } from "react"

export default function Wallet() {
  const [balance, setBalance] = useState(0)

    useEffect(() => {
        // simulazione saldo utente
            setBalance(120)
              }, [])

                return (
                    <div
                          style={{
                                  background: "#111",
                                          padding: 20,
                                                  borderRadius: 12,
                                                          border: "1px solid #333",
                                                                  marginBottom: 20
                                                                        }}
                                                                            >
                                                                                  <h2>Wallet</h2>

                                                                                        <div style={{ fontSize: 28, marginTop: 10 }}>
                                                                                                {balance} CANCELLIERE
                                                                                                      </div>

                                                                                                            <p style={{ opacity: 0.7, marginTop: 10 }}>
                                                                                                                    Guadagnati completando missioni validate dalla community.
                                                                                                                          </p>
                                                                                                                              </div>
                                                                                                                                )
                                                                                                                                }