import Navbar from "./Navbar"
import { Outlet } from "react-router-dom"
import Sidebar from "../../layout/Sidebar"

export default function AppLayout() {
      return (
            <div style={{ background: "#000", color: "white", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
                  <Navbar />

                  <div style={{ display: "flex", flex: 1 }}>
                        <Sidebar />

                        <main style={{ flex: 1, padding: 30 }}>
                              <Outlet />
                        </main>
                  </div>
            </div>
      )
}