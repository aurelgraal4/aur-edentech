import React, { useState } from "react"
import Card from "../../shared/components/ui/Card"
import { useUser } from "../../app/providers/UserProvider"
import { getSession } from "../../core/auth/session"
import { supabase } from "../../supabase"

type Props = {
  profile: any
  onProfileChange: (p: any) => void
}

export default function ProfileHeader({ profile, onProfileChange }: Props) {
  const { user } = useUser()
  const sessionHash = getSession()
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(profile?.public_name || "")
  const [error, setError] = useState<string | null>(null)

  function shortAddress(addr?: string) {
    if (!addr) return "-"
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  function validateName(n: string) {
    return /^[A-Za-z0-9_]{3,24}$/.test(n)
  }

  async function saveName() {
    setError(null)
    if (!validateName(name)) return setError("Nome non valido (3-24 chars, lettere, numeri, underscore)")
    try {
      // use supabase rpc to update public name
      const { data, error: rpcErr } = await supabase.rpc("update_public_name", { sequence_hash: profile.sequence_hash, new_name: name })
      if (rpcErr) {
        setError(rpcErr.message || "Errore aggiornamento")
        return
      }
      onProfileChange({ ...profile, public_name: name })
      setEditing(false)
    } catch (e: any) {
      setError(e?.message || String(e))
    }
  }

  return (
    <Card title="Identità">
      <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
        <div style={{ width: 96, height: 96, borderRadius: 12, background: "linear-gradient(135deg,#ffd166,#b6f1c1)", flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {!editing ? (
              <h2 style={{ margin: 0 }}>{profile.public_name || "Unnamed"}</h2>
            ) : (
              <input value={name} onChange={(e) => setName(e.target.value)} style={{ padding: 8, borderRadius: 6 }} />
            )}

            <button onClick={() => setEditing(!editing)} style={{ marginLeft: 8 }}>{editing ? "Cancel" : "Edit"}</button>
            {editing && <button onClick={saveName} style={{ marginLeft: 8 }}>Save</button>}
          </div>
          {error && <div style={{ color: "#ff6b6b" }}>{error}</div>}
          <div style={{ marginTop: 8, color: "#bbb" }}>Sequence: {profile.sequence_hash}</div>
          <div style={{ marginTop: 4 }}>Wallet: {shortAddress(profile.connected_wallet)}</div>
          <div style={{ marginTop: 4 }}>Level: {profile.level} — {profile.honor_title}</div>
        </div>
      </div>
    </Card>
  )
}
