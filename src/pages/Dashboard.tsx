import Sidebar from "../components/dashboard/Sidebar"
import Topbar from "../components/dashboard/Topbar"
import Stats from "../components/dashboard/Stats"
import Activity from "../components/dashboard/Activity"

export default function Dashboard() {
  return (
      <div style={{ display: "flex", height: "100vh", background: "#0f172a", color: "white" }}>
            
                  <Sidebar />

                        <div style={{ flex: 1, padding: "20px" }}>
                                <Topbar />

                                        <div style={{ marginTop: "20px" }}>
                                                  <Stats />
                                                          </div>

                                                                  <div style={{ marginTop: "20px" }}>
                                                                            <Activity />
                                                                                    </div>
                                                                                          </div>

                                                                                              </div>
                                                                                                )
                                                                                                }