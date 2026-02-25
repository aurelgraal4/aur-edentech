import React from "react"
import Card from "../../shared/components/ui/Card"
import { getBadgeById } from "../../core/badges"

type Props = { profile: any }

export default function ProfileEvolution({ profile }: Props) {
  const progress = profile?.level_progress ?? 0
  const total = profile?.total_cancellieri ?? 0
  const forum = profile?.forum_posts_count ?? 0
  const journey = profile?.journey_steps_count ?? 0
  const earned: string[] = profile?.earned_badges ?? []
  const locked: string[] = profile?.locked_badges ?? []

  return (
    <Card title="Evoluzione">
      <div>
        <div style={{ marginBottom: 8 }}>
          <div style={{ fontSize: 12, color: "#bbb" }}>Level Progress</div>
          <div style={{ height: 10, background: "#111", borderRadius: 6, overflow: "hidden", border: "1px solid #6b4f12" }}>
            <div style={{ width: `${Math.min(100, Math.max(0, progress))}%`, height: "100%", background: "linear-gradient(90deg,#ffd166,#b6f1c1)" }} />
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
          <div style={{ flex: 1 }}>
            <div style={{ color: "#bbb", fontSize: 12 }}>Cancellieri</div>
            <div style={{ fontWeight: 700 }}>{total}</div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ color: "#bbb", fontSize: 12 }}>Forum posts</div>
            <div style={{ fontWeight: 700 }}>{forum}</div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ color: "#bbb", fontSize: 12 }}>Journey steps</div>
            <div style={{ fontWeight: 700 }}>{journey}</div>
          </div>
        </div>

        <div style={{ marginTop: 12 }}>
          <div style={{ color: "#bbb", marginBottom: 8 }}>Badges</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {earned.map((b) => {
              const meta = getBadgeById(b)
              return (
                <div key={b} title={meta?.description || ""} style={{ padding: 8, background: "#0b0b0b", border: "1px solid #6b4f12", borderRadius: 8, boxShadow: "0 0 8px rgba(255,215,0,0.06)" }}>
                  <div style={{ fontSize: 18 }}>{meta?.icon ?? "🔰"}</div>
                  <div style={{ fontSize: 12 }}>{meta?.name ?? b}</div>
                </div>
              )
            })}

            {locked.map((b) => {
              const meta = getBadgeById(b)
              return (
                <div key={b} title={meta?.description || "Locked"} style={{ padding: 8, background: "#050505", border: "1px dashed #333", borderRadius: 8, opacity: 0.6 }}>
                  <div style={{ fontSize: 18 }}>🔒</div>
                  <div style={{ fontSize: 12 }}>{meta?.name ?? b}</div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </Card>
  )
}
import React from "react"
import Card from "../../shared/components/ui/Card"

type Props = { profile: any }

export default function ProfileEvolution({ profile }: Props) {
  const progress = profile?.level_progress ?? 0
  const total = profile?.cancellieri_total ?? 0
  const posts = profile?.forum_posts_count ?? 0
  const steps = profile?.journey_steps_count ?? 0
  const badges = profile?.badges || []

  return (
    <Card title="Evolution">
      <div>
        <div style={{ height: 10, background: "#111", borderRadius: 6, margin: "8px 0" }}>
          <div style={{ width: `${Math.round(progress*100)}%`, height: 10, background: "var(--aur-green)", borderRadius: 6 }} />
        </div>
        <div>Progress towards next level: {Math.round(progress*100)}%</div>
        <div style={{ marginTop: 8 }}>Cancellieri total: {total}</div>
        <div>Forum posts: {posts}</div>
        <div>Journey steps: {steps}</div>
        <div style={{ marginTop: 8 }}>
          <b>Badges</b>
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            {badges.map((b:any) => <div key={b.id} title={b.description} style={{ padding: 6, borderRadius: 6 }}>{b.name}</div>)}
          </div>
        </div>
      </div>
    </Card>
  )
}
