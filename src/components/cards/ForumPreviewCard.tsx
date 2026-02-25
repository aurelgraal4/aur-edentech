import React, { useEffect, useState } from "react"
import Card from "../../shared/components/ui/Card"
import { supabase } from "../../supabase"

type Post = { id: number; problem: string; intention: string }

export default function ForumPreviewCard() {
  const [posts, setPosts] = useState<Post[]>([])

  async function load() {
    const { data } = await supabase.from("missions").select("id, problem, intention").order("id", { ascending: false }).limit(5)
    if (data) setPosts(data)
  }

  useEffect(() => { load() }, [])

  return (
    <Card title="Forum Preview">
      <ul>
        {posts.map((p) => (
          <li key={p.id} style={{ fontSize: 13 }}>{p.problem} — {p.intention}</li>
        ))}
      </ul>
    </Card>
  )
}
