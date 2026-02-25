import React from "react"
import Card from "../../shared/components/ui/Card"
import { getUserFeed } from "../../core/activityEngine"
import { useUser } from "../../app/providers/UserProvider"

export default function ActivityCard() {
  const { user } = useUser()
  const feed = user ? getUserFeed(user.id).slice(0, 6) : []

  return (
    <Card title="Recent Activity">
      <ul>
        {feed.map((f) => (
          <li key={f.id} style={{ fontSize: 13 }}>{f.timestamp.split("T")[0]} — {f.type} — {JSON.stringify(f.data)}</li>
        ))}
      </ul>
    </Card>
  )
}
