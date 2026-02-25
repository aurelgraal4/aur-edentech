import React, { useState } from "react"
import { listProposals, voteProposal, closeProposal, createProposal, Proposal } from "../core/governance"
import { triggerReputationEvent } from "../core/reputationEvents"
import { logActivity } from "../core/activity"
import { useUser } from "../app/providers/UserProvider"

export default function Governance() {
  const [proposals, setProposals] = useState<Proposal[]>(() => listProposals())
  const [title, setTitle] = useState("")
  const [desc, setDesc] = useState("")
  const { user, addReputation } = useUser()

  function handleVote(id: string, support: boolean) {
    voteProposal(id, support)
    setProposals(listProposals())
    const delta = triggerReputationEvent("VOTE_CAST")
    if (user) addReputation(delta)
    logActivity("VOTE_CAST", `${user?.username ?? "anonymous"} voted on ${id}`)
  }

  function handleClose(id: string) {
    closeProposal(id)
    setProposals(listProposals())
    logActivity("PROPOSAL_CLOSED", `Proposal ${id} closed`)
  }

  function handleCreate() {
    if (!title) return
    const p = createProposal(title, desc)
    setProposals(listProposals())
    const delta = triggerReputationEvent("PROPOSAL_CREATED")
    if (user) addReputation(delta)
    logActivity("PROPOSAL_CREATED", `${user?.username ?? "anonymous"} created proposal ${p.id}`)
    setTitle("")
    setDesc("")
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Governance</h2>

      <div style={{ marginBottom: 12 }}>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Titolo proposta" style={{ width: "100%", marginBottom: 6 }} />
        <textarea value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Descrizione" style={{ width: "100%", marginBottom: 6 }} />
        <button onClick={handleCreate}>Crea Proposta</button>
      </div>

      <div style={{ display: "grid", gap: 12 }}>
        {proposals.map((p) => (
          <div key={p.id} style={{ padding: 12, border: "1px solid #222", borderRadius: 8 }}>
            <strong>{p.title}</strong>
            <p>{p.description}</p>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <span style={{ color: p.status === "open" ? "#50C878" : "#999" }}>{p.status}</span>
              <span>For: {p.votesFor}</span>
              <span>Against: {p.votesAgainst}</span>
              {p.status === "open" && (
                <>
                  <button onClick={() => handleVote(p.id, true)} style={{ marginLeft: "auto" }}>
                    Vote For
                  </button>
                  <button onClick={() => handleVote(p.id, false)}>Vote Against</button>
                  <button onClick={() => handleClose(p.id)}>Close</button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
