import Sidebar from "../components/dashboard/Sidebar"
import Topbar from "../components/dashboard/Topbar"
import Stats from "../components/dashboard/Stats"
import Activity from "../components/dashboard/Activity"

export default function Dashboard() {
  return (
      <div style={{display:"flex"}}>

            <Sidebar />

                  <div style={{flex:1}}>

                          <Topbar />

                                  <div style={{padding:20}}>
                                            <Stats />
                                                      <Activity />
                                                              </div>

                                                                    </div>

                                                                        </div>
                                                                          )
                                                                          }