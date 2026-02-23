import Sidebar from "../components/dashboard/Sidebar"
import Topbar from "../components/dashboard/Topbar"
import Stats from "../components/dashboard/Stats"
import Activity from "../components/dashboard/Activity"

import Missions from "../components/activity/activity/Missions"
import Feed from "../components/forum/Feed"
import RightPanel from "../components/layout/RightPanel"

export default function Dashboard() {
  return (
      <div
            style={{
                    display: "grid",
                            gridTemplateColumns: "220px 1fr 260px",
                                    minHeight: "100vh",
                                            background: "#0b0b0b",
                                                    color: "white"
                                                          }}
                                                              >
                                                                    
                                                                          {/* SIDEBAR */}
                                                                                <Sidebar />

                                                                                      {/* CENTRO */}
                                                                                            <div style={{ padding: 30 }}>

                                                                                                    <Topbar />

                                                                                                            <Stats />

                                                                                                                    <Activity />

                                                                                                                            <Missions />

                                                                                                                                    <Feed />

                                                                                                                                          </div>

                                                                                                                                                {/* DESTRA */}
                                                                                                                                                      <RightPanel />

                                                                                                                                                          </div>
                                                                                                                                                            )
                                                                                                                                                            }