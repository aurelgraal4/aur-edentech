import React, { useEffect, useState } from "react"
import { getFeed, subscribeFeed } from "../../core/activityFeed"
import type { UnifiedActivity } from "../../core/activityFeed"
import ActivityCard from "./ActivityCard"

export default function ActivityFeed({ max = 50, userId }: { max?: number; userId?: string }) {
  const [items, setItems] = useState<UnifiedActivity[]>(() => getFeed(max))

  useEffect(() => {
    const unsub = subscribeFeed((list) => {
      let out = list
      if (userId) out = out.filter((i) => i.user?.id === userId)
      setItems(out.slice(0, max))
    })
    return () => unsub()
  }, [max, userId])

  if (!items || items.length === 0) return <div style={{ color: "#777", padding: 12 }}>Nessuna attività</div>

  return (
    <div style={{ display: "grid", gap: 8 }}>
      {items.map((a) => (
        <ActivityCard key={a.id} a={a} />
      ))}
    </div>
  )
}
