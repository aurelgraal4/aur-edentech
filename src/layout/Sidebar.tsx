import { Link } from "react-router-dom"
import React from "react"

export default function Sidebar() {
  return (
    <aside style={{ width: 240, padding: 16, borderRight: "1px solid rgba(255,215,0,0.06)" }}>
      <div style={{ marginBottom: 16, color: "var(--aur-gold)", fontWeight: 700 }}>AUR Menu</div>

      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 8 }}>Platform</div>
        <ul style={{ listStyle: "none", padding: 0 }}>
          <li><Link to="/dashboard">Dashboard</Link></li>
          <li><Link to="/journey">Journey</Link></li>
        </ul>
      </div>

      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 8 }}>Community</div>
        <ul style={{ listStyle: "none", padding: 0 }}>
          <li><Link to="/forum">Forum</Link></li>
        </ul>
      </div>

      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 8 }}>Economy</div>
        <ul style={{ listStyle: "none", padding: 0 }}>
          <li><Link to="/wallet">Wallet</Link></li>
          <li><Link to="/premi">Premi</Link></li>
        </ul>
      </div>

      <div>
        <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 8 }}>Governance</div>
        <ul style={{ listStyle: "none", padding: 0 }}>
          <li><Link to="/governance">Governance</Link></li>
        </ul>
      </div>
    </aside>
  )
}
