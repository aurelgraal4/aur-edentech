import { Link, useNavigate } from "react-router-dom"
import React, { useEffect, useState } from "react"
import { clearSession } from "../../core/auth/session"
import useDebounce from "../../shared/hooks/useDebounce"
import { useUser } from "../providers/UserProvider"

export default function Navbar() {
      const navigate = useNavigate()
      const [q, setQ] = useState("")
      const debounced = useDebounce(q, 300)
      const { user } = useUser()

      function logout() {
            clearSession()
            navigate("/login")
      }

      function onSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
            setQ(e.target.value)
      }

      useEffect(() => {
            // trigger a global search by navigating to the forum with a query param
            if (debounced && debounced.length > 0) {
                  navigate(`/forum?q=${encodeURIComponent(debounced)}`)
            }
            // when debounced is empty we simply do nothing (user cleared search)
      }, [debounced, navigate])

      return (
            <nav style={{ backdropFilter: "blur(6px)", boxShadow: "0 6px 20px rgba(0,0,0,0.6)" }} className="flex items-center justify-between px-6 py-4">
                  <div className="flex items-center gap-3">
                        <div style={{ width: 40, height: 40, background: "var(--aur-gold)", borderRadius: 8 }} />
                        <div style={{ color: "var(--aur-gold)", fontWeight: 700 }}>AUR EdenTech</div>
                        {user && (
                              <div style={{ marginLeft: 12, fontSize: 13, color: "#ddd" }}>
                                    <div style={{ fontWeight: 700 }}>{user.username}</div>
                                    <div style={{ fontSize: 12 }}>Lv. {user.level} • {user.tokens} ⛃</div>
                              </div>
                        )}
                  </div>

                  <div className="flex-1 max-w-xl mx-6">
                        <input aria-label="search" value={q} onChange={onSearchChange} placeholder="Cerca nella piattaforma..." className="w-full px-3 py-2 rounded-md" />
                  </div>

                  <div className="flex items-center gap-6">
                        <Link to="/totalita">Totalità</Link>
                        <Link to="/dashboard">Dashboard</Link>
                        <Link to="/forum">Forum</Link>
                        <Link to="/journey">Journey</Link>
                        <Link to="/governance">Governance</Link>
                        <Link to="/premi">Premi</Link>
                        <Link to="/wallet">Wallet</Link>
                        <Link to="/leaderboard">Leaderboard</Link>
                        <Link to="/profile">Profile</Link>

                        <button onClick={logout} style={{ padding: "6px 10px", borderRadius: 6, background: "transparent", border: "1px solid var(--aur-gold)" }}>
                              Esci
                        </button>
                  </div>
            </nav>
      )
}