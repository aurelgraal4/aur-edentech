export default function Topbar() {
      return (
          <div style={{
                height: "60px",
                      borderBottom: "1px solid #eee",
                            display: "flex",
                                  alignItems: "center",
                                        justifyContent: "space-between",
                                              padding: "0 20px"
                                                  }}>
                                                        <h3>Dashboard</h3>

                                                              <button
                                                                      onClick={()=>{
                                                                                localStorage.removeItem("auth")
                                                                                          window.location.href="/"
                                                                                                  }}
                                                                                                        >
                                                                                                                Logout
                                                                                                                      </button>
                                                                                                                          </div>
                                                                                                                            )
                                                                                                                            }