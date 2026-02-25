import React from "react"
import Card from "../../shared/components/ui/Card"
import ActivityFeed from "../activity/ActivityFeed"

type Props = { profile: any }

export default function ProfileActivity({ profile }: Props) {
  const userId = profile?.sequence_hash || profile?.id
  return (
    <Card title="Recent Activity">
      <ActivityFeed max={10} userId={userId} />
    </Card>
  )
}
