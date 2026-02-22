export default function Topbar() {
      return (
          <div style={{
                display: "flex",
                      justifyContent: "space-between",
                            alignItems: "center",
                                  borderBottom: "1px solid #1e293b",
                                        paddingBottom: "10px"
                                            }}>
                                                  <h1>Dashboard</h1>

                                                        <button
                                                                onClick={() => {
                                                                          localStorage.removeItem("auth")
                                                                                    window.location.href = "/"
                                                                                            }}
                                                                                                  >
                                                                                                          Logout
                                                                                                                </button>
                                                                                                                    </div>
                                                                                                                      )
                                                                                                                      }