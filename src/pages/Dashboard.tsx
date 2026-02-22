import { useNavigate } from "react-router-dom"

export default function Dashboard() {
  const navigate = useNavigate()

    const logout = () => {
        localStorage.removeItem("session")
            navigate("/")
              }

                return (
                    <div style={{ display: "flex", height: "100vh", fontFamily: "sans-serif" }}>
                          
                                {/* Sidebar */}
                                      <div style={{
                                              width: "220px",
                                                      background: "#111",
                                                              color: "white",
                                                                      padding: "20px"
                                                                            }}>
                                                                                    <h2>AUR</h2>

                                                                                            <p>Overview</p>
                                                                                                    <p>Sequenze</p>
                                                                                                            <p>Utenti</p>
                                                                                                                    <p>Logs</p>
                                                                                                                            <p>Settings</p>

                                                                                                                                    <button onClick={logout} style={{ marginTop: 20 }}>
                                                                                                                                              Logout
                                                                                                                                                      </button>
                                                                                                                                                            </div>

                                                                                                                                                                  {/* Content */}
                                                                                                                                                                        <div style={{ flex: 1, padding: "40px" }}>
                                                                                                                                                                                <h1>Dashboard</h1>
                                                                                                                                                                                        <p>Sistema operativo.</p>
                                                                                                                                                                                              </div>

                                                                                                                                                                                                  </div>
                                                                                                                                                                                                    )
                                                                                                                                                                                                    }