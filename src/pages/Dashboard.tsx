import Sidebar from "../components/dashboard/Sidebar";
import Activity from "../components/dashboard/Activity";
import Stats from "../components/dashboard/Stats";
import Topbar from "../components/dashboard/Topbar";

export default function Dashboard() {
  return (
      <div style={{ display: "grid", gridTemplateColumns: "250px 1fr 300px", height: "100vh" }}>
            
                  <Sidebar />

                        <div style={{ padding: "20px" }}>
                                <Topbar />
                                        <Activity />
                                              </div>

                                                    <Stats />

                                                        </div>
                                                          );
                                                          }