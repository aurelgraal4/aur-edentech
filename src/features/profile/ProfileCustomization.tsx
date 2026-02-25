import React, { useState } from "react"
import Card from "../../shared/components/ui/Card"
import { supabase } from "../../supabase"

type Props = { profile: any, onChange: (p:any)=>void }

export default function ProfileCustomization({ profile, onChange }: Props) {
  const [bio, setBio] = useState(profile?.bio || "")
  const [frame, setFrame] = useState(profile?.avatar_frame || "gold")
  const [theme, setTheme] = useState(profile?.theme_choice || "gold circuits")
  const [saving, setSaving] = useState(false)

  async function save() {
    setSaving(true)
    try {
      const res = await fetch("/profile", { method: "POST", headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sequence_hash: profile.sequence_hash, action: "update_profile", name: profile.public_name, bio, avatar_url: profile.avatar_url, avatar_frame: frame, theme_choice: theme }) })
      const json = await res.json()
      onChange(json)
    } catch (e) {
      console.error(e)
    } finally { setSaving(false) }
  }

  return (
    <Card title="Customization">
      <div>
        <div>
          <label>Bio</label>
          <textarea value={bio} onChange={(e)=>setBio(e.target.value)} style={{ width: '100%', minHeight: 80 }} />
        </div>

        <div style={{ marginTop: 8 }}>
          <label>Avatar Frame</label>
          <select value={frame} onChange={(e)=>setFrame(e.target.value)}>
            <option value="gold">gold</option>
            <option value="emerald">emerald</option>
            <option value="black-gold">black-gold</option>
          </select>
        </div>

        <div style={{ marginTop: 8 }}>
          <label>Theme</label>
          <select value={theme} onChange={(e)=>setTheme(e.target.value)}>
            <option>gold circuits</option>
            <option>emerald circuits</option>
            <option>hybrid circuits</option>
          </select>
        </div>

        <div style={{ marginTop: 10 }}>
          <button onClick={save} disabled={saving}>{saving? 'Saving...': 'Save'}</button>
        </div>
      </div>
    </Card>
  )
}
