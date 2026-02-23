import Sidebar from "../components/dashboard/Sidebar"
import Topbar from "../components/dashboard/Topbar"
import Stats from "../components/dashboard/Stats"
import Activity from "../components/dashboard/Activity"

import Feed from "../components/forum/Feed"
import Missions from "../components/activity/activity/Missions"

import RightPanel from "../components/layout/RightPanel"

export default function Dashboard() {
  return (
      <div style={{ display: "flex", height: "100vh", background: "#0a0a0a", color: "white" }}>
            
                  {/* Sidebar */}
                        <Sidebar />

                              {/* Main */}
                                    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                                            
                                                    <Topbar />

                                                            <div style={{ display: "flex", flex: 1 }}>

                                                                      {/* Centro */}
                                                                                <div style={{ flex: 2, padding: 30, overflowY: "auto" }}>
                                                                                            
                                                                                                        <h1 style={{ marginBottom: 30 }}>Dashboard</h1>

                                                                                                                    <Stats />

                                                                                                                                <Activity />

                                                                                                                                            {/* Forum Evolutivo */}
                                                                                                                                                        <div style={{ marginTop: 40 }}>
                                                                                                                                                                      <Feed />
                                                                                                                                                                                  </div>

                                                                                                                                                                                              {/* Missioni */}
                                                                                                                                                                                                          <div style={{ marginTop: 40 }}>
                                                                                                                                                                                                                        <Missions />
                                                                                                                                                                                                                                    </div>

                                                                                                                                                                                                                                              </div>

                                                                                                                                                                                                                                                        {/* Destra */}
                                                                                                                                                                                                                                                                  <RightPanel />

                                                                                                                                                                                                                                                                          </div>
                                                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                                                    </div>
                                                                                                                                                                                                                                                                                      )
                                                                                                                                                                                                                                                                                      }