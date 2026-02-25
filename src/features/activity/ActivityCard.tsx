import React from "react"
import type { UnifiedActivity } from "../../core/activityFeed"

function niceTime(ts: string) {
  try { return new Date(ts).toLocaleString() } catch { return ts }
}

export default function ActivityCard({ a }: { a: UnifiedActivity }) {
  return (
    <div style={{ padding: 10, border: "1px solid #3b2a08", borderRadius: 8, background: "#030303", display: "flex", gap: 12, alignItems: "flex-start" }}>
      <div style={{ width: 48, height: 48, borderRadius: 10, background: "linear-gradient(135deg,#ffd166,#b6f1c1)", flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <div style={{ color: "#ddd", fontSize: 14 }}>
          <b style={{ color: "#ffd166" }}>{a.user?.username ?? "system"}</b> — <span style={{ color: "#fff" }}>{a.action}</span>
        </div>
        {a.context && <div style={{ color: "#9bd5b6", fontSize: 13, marginTop: 6 }}>{typeof a.context === "string" ? a.context : JSON.stringify(a.context)}</div>}
        <div style={{ marginTop: 8, display: "flex", gap: 12, alignItems: "center" }}>
          {a.reward !== undefined && <div style={{ color: "#ffd166" }}>+{a.reward} ⛃</div>}
          <div style={{ color: "#888", fontSize: 12 }}>{niceTime(a.timestamp)}</div>
        </div>
      </div>
    </div>
  )
}
