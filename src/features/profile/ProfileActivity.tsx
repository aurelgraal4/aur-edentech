import React from "react"
import Card from "../../shared/components/ui/Card"

type Props = { profile: any }

export default function ProfileActivity({ profile }: Props) {
  const posts = profile?.recent_forum_posts ?? []
  const journey = profile?.recent_journey_entries ?? []
  const badges = profile?.recent_badges ?? []

  function renderList(title: string, items: any[], renderItem: (it: any) => React.ReactNode) {
    return (
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontWeight: 700, marginBottom: 6 }}>{title}</div>
        {items.length === 0 ? (
          <div style={{ color: "#777", fontStyle: "italic" }}>Nessuna attività recente</div>
        ) : (
          <ul style={{ margin: 0, paddingLeft: 16 }}>
            {items.slice(0, 5).map((it: any, idx: number) => (
              <li key={idx} style={{ marginBottom: 6 }}>{renderItem(it)}</li>
            ))}
          </ul>
        )}
      </div>
    )
  }

  return (
    <Card title="Recent Activity">
      <div>
        {renderList("Forum posts", posts, (p) => (
          <div>
            <div style={{ fontSize: 13, color: "#ddd" }}>{p.title ?? p.subject ?? "Untitled"}</div>
            <div style={{ fontSize: 12, color: "#888" }}>{p.timestamp ? p.timestamp.split("T")[0] : "-"}</div>
          </div>
        ))}

        {renderList("Journey entries", journey, (j) => (
          <div>
            <div style={{ fontSize: 13, color: "#ddd" }}>{j.title ?? j.summary ?? "Entry"}</div>
            <div style={{ fontSize: 12, color: "#888" }}>{j.timestamp ? j.timestamp.split("T")[0] : "-"}</div>
          </div>
        ))}

        {renderList("Badges earned", badges, (b) => (
          <div>
            <div style={{ fontSize: 13, color: "#ddd" }}>{b.name ?? b}</div>
            <div style={{ fontSize: 12, color: "#888" }}>{b.timestamp ? b.timestamp.split("T")[0] : "-"}</div>
          </div>
        ))}
      </div>
    </Card>
  )
}
import React from "react"
import Card from "../../shared/components/ui/Card"

type Props = { profile: any }

export default function ProfileActivity({ profile }: Props) {
  const posts = profile?.recent_posts || []
  const journey = profile?.recent_journey || []
  const badges = profile?.recent_badges || []

  return (
    <Card title="Recent Activity">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div>
          <h4>Forum</h4>
          {posts.length === 0 ? <div>No posts yet</div> : (
            <ul>{posts.slice(0,5).map((p: any) => <li key={p.id}>{p.title || p.problem}</li>)}</ul>
          )}
        </div>
        <div>
          <h4>Journey</h4>
          {journey.length === 0 ? <div>No journey entries</div> : (
            <ul>{journey.slice(0,5).map((j: any, i:number) => <li key={i}>{j.step}</li>)}</ul>
          )}
          <h4 style={{ marginTop: 12 }}>Badges</h4>
          {badges.length === 0 ? <div>No badges yet</div> : (
            <ul>{badges.slice(0,5).map((b: any, i:number) => <li key={i}>{b.name}</li>)}</ul>
          )}
        </div>
      </div>
    </Card>
  )
}
