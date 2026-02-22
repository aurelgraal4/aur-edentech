import Sidebar from "../components/dashboard/Sidebar";
import Topbar from "../components/dashboard/Topbar";

import Identity from "../components/identity/Identity";
import Feed from "../components/forum/Feed";
import RightPanel from "../components/layout/RightPanel";

export default function Dashboard() {
  return (
      <div
            style={{
                    display: "grid",
                            gridTemplateColumns: "220px 1fr",
                                    height: "100vh",
                                            background: "#0a0a0a",
                                                    color: "white"
                                                          }}
                                                              >
                                                                    <Sidebar />

                                                                          <div style={{ display: "flex", flexDirection: "column" }}>
                                                                                  <Topbar />

                                                                                          <div
                                                                                                    style={{
                                                                                                                display: "grid",
                                                                                                                            gridTemplateColumns: "320px 1fr 320px",
                                                                                                                                        flex: 1,
                                                                                                                                                    overflow: "hidden"
                                                                                                                                                              }}
                                                                                                                                                                      >
                                                                                                                                                                                <Identity />
                                                                                                                                                                                          <Feed />
                                                                                                                                                                                                    <RightPanel />
                                                                                                                                                                                                            </div>
                                                                                                                                                                                                                  </div>
                                                                                                                                                                                                                      </div>
                                                                                                                                                                                                                        );
                                                                                                                                                                                                                        }