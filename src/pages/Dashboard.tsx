import Sidebar from "../components/dashboard/Sidebar"
import Topbar from "../components/dashboard/Topbar"
import Missions from "../components/activity/activity/Missions"
import Feed from "../components/forum/Feed"
import Activity from "../components/dashboard/Activity"
import RightPanel from "../components/layout/RightPanel"
import Wallet from "../components/economy/Wallet"

export default function Dashboard() {
  return (
      <div
            style={{
                    display: "flex",
                            background: "#0b0b0b",
                                    minHeight: "100vh",
                                            color: "white"
                                                  }}
                                                      >
                                                            {/* Sidebar sinistra */}
                                                                  <Sidebar />

                                                                        {/* Contenuto centrale */}
                                                                              <div
                                                                                      style={{
                                                                                                flex: 1,
                                                                                                          padding: 30,
                                                                                                                    maxWidth: 900,
                                                                                                                              margin: "0 auto"
                                                                                                                                      }}
                                                                                                                                            >
                                                                                                                                                    <Topbar title="EdenTech" />

                                                                                                                                                            <Wallet />

                                                                                                                                                                    <Missions />

                                                                                                                                                                            <Feed />

                                                                                                                                                                                    <Activity />
                                                                                                                                                                                          </div>

                                                                                                                                                                                                {/* Pannello destro */}
                                                                                                                                                                                                      <RightPanel />
                                                                                                                                                                                                          </div>
                                                                                                                                                                                                            )
                                                                                                                                                                                                            }