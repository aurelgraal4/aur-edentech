import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { getSession } from "../../core/auth/session"
import ProfileHeader from "./ProfileHeader"
import ProfileCustomization from "./ProfileCustomization"
import ProfileEvolution from "./ProfileEvolution"
import ProfileActivity from "./ProfileActivity"
import ProfileWallet from "./ProfileWallet"

export default function ProfilePage() {
  const params = useParams()
  const sessionHash = getSession()
  const seq = (params.sequence_hash as string) ?? sessionHash

  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function loadProfile() {
    if (!seq) {
      setError("Sessione mancante")
      return
    }
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/profile", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ sequence_hash: seq, action: "get_profile" }) })
      const json = await res.json()
      setProfile(json)
    } catch (e: any) {
      console.error(e)
      setError(e?.message || String(e))
    } finally { setLoading(false) }
  }

  useEffect(() => {
    loadProfile()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seq])

  function onProfileChange(p: any) {
    // update UI instantly
    setProfile(p)
  }

  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth <= 768)
  useEffect(() => {
    function onResize() { setIsMobile(window.innerWidth <= 768) }
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [])

  if (loading) return <div style={{ padding: 24 }}>Loading profile...</div>
  if (error) return <div style={{ padding: 24, color: "#ff6b6b" }}>{error}</div>
  if (!profile) return <div style={{ padding: 24 }}>No profile</div>

  return (
    <div style={{ padding: 18 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr", gap: 12 }}>
          <div>
            <ProfileHeader profile={profile} onProfileChange={onProfileChange} />
            <div style={{ marginTop: 12 }}>
              <ProfileEvolution profile={profile} />
            </div>
          </div>

          <div>
            <ProfileCustomization profile={profile} onChange={(p)=>{ onProfileChange(p) }} />
            <div style={{ marginTop: 12 }}>
              <ProfileActivity profile={profile} />
            </div>
          </div>

          <div>
            <ProfileWallet />
          </div>
        </div>
      </div>
    </div>
  )
}
