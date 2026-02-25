import React, { useEffect, useState } from "react"
import eventsBus from "../core/events/eventBus"
import platformBus from "../core/eventBus"

type DebugEvent = {
  id: string
  name: string
  timestamp: number
  source: string
  payload: any
}

function shortPayload(p: any) {
  try {
    const s = typeof p === "string" ? p : JSON.stringify(p)
    return s.length > 200 ? s.slice(0, 200) + "…" : s
  } catch {
    return String(p)
  }
}

export default function EventDebugger(): JSX.Element {
  const [events, setEvents] = useState<DebugEvent[]>([])

  useEffect(() => {
    // capture originals
    const origEventsEmit = (eventsBus as any).emit
    const origPlatformEmit = (platformBus as any).emit

    function push(e: DebugEvent) {
      setEvents((prev) => {
        const next = [e, ...prev]
        if (next.length > 50) next.length = 50
        return next
      })
    }

    // wrap eventsBus.emit (string event, payload)
    try {
      ;(eventsBus as any).emit = (name: string, payload?: any) => {
        try {
          push({ id: `${name}_${Date.now()}_${Math.random()}`, name, timestamp: Date.now(), source: "eventsBus", payload })
        } catch {}
        return origEventsEmit.call(eventsBus, name, payload)
      }
    } catch {}

    // wrap platformBus.emit (PlatformEvent object)
    try {
      ;(platformBus as any).emit = (ev: any) => {
        try {
          const name = ev?.type || "(unknown)"
          const ts = ev?.timestamp ?? Date.now()
          const payload = ev?.payload ?? ev
          push({ id: `${name}_${ts}_${Math.random()}`, name, timestamp: ts, source: "platformBus", payload })
        } catch {}
        return origPlatformEmit.call(platformBus, ev)
      }
    } catch {}

    // also subscribe to common platform events as a fallback
    const unsubscribers: Array<() => void> = []
    try {
      const evNames = Object.values((platformBus as any).Events || {})
      evNames.forEach((n: string) => {
        const unsub = (platformBus as any).subscribe(n, (ev: any) => {
          try {
            push({ id: `${n}_${Date.now()}_${Math.random()}`, name: n, timestamp: ev?.timestamp ?? Date.now(), source: "platformSubscribe", payload: ev?.payload ?? ev })
          } catch {}
        })
        unsubscribers.push(unsub)
      })
    } catch {}

    return () => {
      // restore
      try { (eventsBus as any).emit = origEventsEmit } catch {}
      try { (platformBus as any).emit = origPlatformEmit } catch {}
      // unsubscribe
      unsubscribers.forEach((u) => { try { u() } catch {} })
    }
  }, [])

  return (
    <div style={{ fontFamily: "Inter, Arial, sans-serif", fontSize: 13, padding: 8 }}>
      <h3 style={{ margin: "4px 0 8px 0" }}>Event Debugger (last {events.length})</h3>
      <div style={{ maxHeight: 420, overflow: "auto", border: "1px solid #ddd", borderRadius: 6 }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ textAlign: "left", borderBottom: "1px solid #eee" }}>
              <th style={{ padding: 6 }}>Event</th>
              <th style={{ padding: 6, width: 140 }}>Timestamp</th>
              <th style={{ padding: 6, width: 120 }}>Source</th>
              <th style={{ padding: 6 }}>Payload</th>
            </tr>
          </thead>
          <tbody>
            {events.map((e) => (
              <tr key={e.id} style={{ borderBottom: "1px solid #fafafa" }}>
                <td style={{ padding: 6, verticalAlign: "top", fontWeight: 600 }}>{e.name}</td>
                <td style={{ padding: 6, verticalAlign: "top", color: "#666" }}>{new Date(e.timestamp).toLocaleString()}</td>
                <td style={{ padding: 6, verticalAlign: "top", color: "#444" }}>{e.source}</td>
                <td style={{ padding: 6, verticalAlign: "top", whiteSpace: "pre-wrap", wordBreak: "break-word", color: "#222" }}>{shortPayload(e.payload)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
