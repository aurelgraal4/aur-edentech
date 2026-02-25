import { Link, useLocation } from "react-router-dom"
import React from "react"

function Icon({ name }: { name: string }) {
        switch (name) {
                case "dashboard":
                        return <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="8" height="8" stroke="currentColor"/><rect x="13" y="3" width="8" height="5" stroke="currentColor"/><rect x="13" y="10" width="8" height="11" stroke="currentColor"/></svg>
                case "forum":
                        return <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor"/></svg>
                case "journey":
                        return <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 2v20" stroke="currentColor"/><circle cx="12" cy="7" r="2" stroke="currentColor"/><circle cx="12" cy="17" r="2" stroke="currentColor"/></svg>
                case "governance":
                        return <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 2l9 4.5v9L12 22 3 15.5v-9L12 2z" stroke="currentColor"/></svg>
                case "wallet":
                        return <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="2" y="6" width="20" height="12" rx="2" stroke="currentColor"/><circle cx="18" cy="12" r="1" fill="currentColor"/></svg>
                case "premi":
                        return <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 2l2.5 6L21 10l-5 3.6L17 21l-5-3-5 3 1-7.4L3 10l6.5-2L12 2z" stroke="currentColor"/></svg>
                case "totalita":
                        return <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor"/></svg>
                default:
                        return null
        }
}

export default function Sidebar() {
        const loc = useLocation()

        const items = [
                { to: "/dashboard", label: "Dashboard", icon: "dashboard" },
                { to: "/forum", label: "Forum", icon: "forum" },
                { to: "/journey", label: "Journey", icon: "journey" },
                { to: "/governance", label: "Governance", icon: "governance" },
                { to: "/wallet", label: "Wallet", icon: "wallet" },
                { to: "/leaderboard", label: "Leaderboard", icon: "dashboard" },
                { to: "/profile", label: "Profile", icon: "dashboard" },
                { to: "/premi", label: "Premi", icon: "premi" },
                { to: "/totalita", label: "Totalità", icon: "totalita" },
        ]

        return (
                <aside className="w-64 border-r border-neutral-800 p-6 bg-black" style={{ minHeight: "100%" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
                                <div style={{ width: 36, height: 36, background: "var(--aur-gold)", borderRadius: 6 }} />
                                <div className="text-lg font-bold" style={{ color: "var(--aur-gold)" }}>AUR</div>
                        </div>

                        <nav style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                                {items.map((it) => {
                                        const active = loc.pathname === it.to
                                        return (
                                                <Link key={it.to} to={it.to} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", borderRadius: 6, background: active ? "rgba(255,215,0,0.06)" : "transparent", color: active ? "var(--aur-gold)" : "#ccc", textDecoration: "none" }}>
                                                        <Icon name={it.icon} />
                                                        <span>{it.label}</span>
                                                </Link>
                                        )
                                })}
                        </nav>
                </aside>
        )
}