import React, { useEffect, useState } from "react"
import { supabase } from "../../supabase"
import { useUser } from "../../app/providers/UserProvider"
import { triggerReputationEvent } from "../../core/reputationEvents"
import { logActivity, getGlobalFeed } from "../../core/activityEngine"
import { rankPosts } from "../../core/contentRanking"
import { getTrendingPosts } from "../../core/trending"

type Post = {
  id: number
  problem: string
  intention: string
  context: string
  media_url?: string
  validations: number
}

export default function Feed() {
  const [posts, setPosts] = useState<Post[]>([])

  const [problem, setProblem] = useState("")
  const [intention, setIntention] = useState("")
  const [context, setContext] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const { user, addReputation } = useUser()

  async function loadPosts() {
    const { data } = await supabase.from("missions").select("*").order("id", { ascending: false })
    if (data) setPosts(data)
  }

  useEffect(() => {
    loadPosts()
  }, [])

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return
    setFile(e.target.files[0])
  }

  async function createPost() {
    if (!problem || !intention) return

    let media_url = ""

    if (file) {
      const fileName = Date.now() + "-" + file.name
      await supabase.storage.from("missions").upload(fileName, file)
      const { data } = supabase.storage.from("missions").getPublicUrl(fileName)
      media_url = data.publicUrl
    }

    const { data: inserted } = await supabase.from("missions").insert({
      problem,
      intention,
      context,
      media_url,
      validations: 0,
    }).select().single()

    // reward reputation for creating a post (UI-only)
    const delta = triggerReputationEvent("POST_CREATED")
    if (user) addReputation(delta)
    const postId = inserted?.id ?? null
    logActivity("POST_CREATED", { postId, problem, intention }, user ? { id: user.id, username: user.username } : undefined)

    setProblem("")
    setIntention("")
    setContext("")
    setFile(null)

    loadPosts()
  }

  async function validate(id: number, current: number) {
    await supabase.from("missions").update({ validations: current + 1 }).eq("id", id)
    loadPosts()
  }

  const activities = getGlobalFeed()

  return (
    <div style={{ maxWidth: 720, margin: "40px auto", padding: 20 }}>
      <h2>Forum Evolutivo</h2>

      <div style={{ marginBottom: 18 }}>
        <h4>Trending</h4>
        {posts.length > 0 && (
          <div>
            {getTrendingPosts(posts).slice(0, 3).map((p) => (
              <div key={p.id} style={{ padding: 8, border: "1px solid #222", marginBottom: 8 }}>
                <b>{p.title || p.problem || `Post ${p.id}`}</b>
                <div style={{ fontSize: 12, opacity: 0.8 }}>Score: {Math.round(p.score)}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ marginBottom: 30 }}>
        <input placeholder="Problema reale" value={problem} onChange={(e) => setProblem(e.target.value)} style={{ width: "100%", marginBottom: 10, padding: 10 }} />

        <input placeholder="Intenzione di soluzione" value={intention} onChange={(e) => setIntention(e.target.value)} style={{ width: "100%", marginBottom: 10, padding: 10 }} />

        <textarea placeholder="Contesto" value={context} onChange={(e) => setContext(e.target.value)} style={{ width: "100%", marginBottom: 10, padding: 10 }} />

        <input type="file" accept="image/*,video/*" onChange={handleFile} />

        <br />

        <button onClick={createPost} style={{ marginTop: 10 }}>Pubblica Missione</button>
      </div>

      {activities.map((a) => (
        <div key={a.id} style={{ border: "1px solid #444", padding: 12, marginBottom: 12, borderRadius: 8, background: "#0b0b0b" }}>
          <div style={{ fontSize: 12, color: "#bbb" }}>{a.timestamp.split("T")[0]} • {a.user.username}</div>
          <div style={{ marginTop: 6 }}>{a.type}</div>
          <div style={{ fontSize: 13, marginTop: 6 }}>{JSON.stringify(a.data)}</div>
        </div>
      ))}

      {posts.map((p) => (
        <div key={p.id} style={{ border: "1px solid #222", padding: 20, marginBottom: 20, borderRadius: 10 }}>
          <b>Problema</b>
          <p>{p.problem}</p>

          <b>Intenzione</b>
          <p>{p.intention}</p>

          <b>Contesto</b>
          <p>{p.context}</p>

          {p.media_url && (
            <>
              {p.media_url.match(/video/) ? <video src={p.media_url} controls style={{ width: "100%" }} /> : <img src={p.media_url} style={{ width: "100%" }} />}
            </>
          )}

          <button onClick={() => validate(p.id, p.validations)}>Riconosci contributo</button>

          <span style={{ marginLeft: 10 }}>{p.validations} validazioni</span>
        </div>
      ))}
    </div>
  )
}
