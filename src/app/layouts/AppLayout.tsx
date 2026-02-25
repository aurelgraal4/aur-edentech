import type { ReactNode } from "react"
import Navbar from "./Navbar"
import Sidebar from "./Sidebar"

type Props = {
  children: ReactNode
  }

  export default function AppLayout({ children }: Props) {
    return (
        <div style={{ display: "flex", height: "100vh" }}>
              
                    <Sidebar />

                          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                                  <Navbar />

                                          <main style={{ flex: 1, padding: "20px" }}>
                                                    {children}
                                                            </main>
                                                                  </div>

                                                                      </div>
                                                                        )
                                                                        }