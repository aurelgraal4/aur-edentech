export type Proposal = {
  id: string
  title: string
  description: string
  votesFor: number
  votesAgainst: number
  status: "open" | "closed"
}

import { logActivity } from "./activityEngine"
import { incrementProposalsCreated } from "./platformStats"
import { earnTokens } from "./economy"

let proposals: Proposal[] = [
  { id: "p1", title: "Improve rewards", description: "Proposal to increase mission rewards.", votesFor: 12, votesAgainst: 3, status: "open" },
  { id: "p2", title: "New forum rules", description: "Proposal to refine forum guidelines.", votesFor: 8, votesAgainst: 2, status: "open" },
]

export function listProposals() {
  return proposals
}

export function createProposal(title: string, description: string, user?: { id: string; username: string }, reward?: (u: string, a: number, r?: string) => any) {
  const p: Proposal = { id: Date.now().toString(), title, description, votesFor: 0, votesAgainst: 0, status: "open" }
  proposals = [p, ...proposals]
  // log + reward
  if (user) {
    try {
      if (reward) reward(user.id, 10, `proposal:${p.id}`)
      try { earnTokens(user.id, 15, `proposal:${p.id}`) } catch {}
      logActivity("PROPOSAL_CREATED", { proposalId: p.id, title }, { id: user.id, username: user.username })
      incrementProposalsCreated(1)
    } catch {}
  } else {
    incrementProposalsCreated(1)
  }
  return p
}

export function voteProposal(id: string, support: boolean, user?: { id: string; username: string }, reward?: (u: string, a: number, r?: string) => any) {
  proposals = proposals.map((p) => (p.id === id ? { ...p, votesFor: support ? p.votesFor + 1 : p.votesFor, votesAgainst: support ? p.votesAgainst : p.votesAgainst + 1 } : p))
  if (user && reward) {
    try {
      reward(user.id, 2, `vote:${id}`)
    } catch {}
  }
  const p = proposals.find((p) => p.id === id) ?? null
  if (user && p) logActivity("PROPOSAL_VOTE", { proposalId: id, support }, { id: user.id, username: user.username })
  return p
}

export function closeProposal(id: string, reward?: (u: string, a: number, r?: string) => any) {
  proposals = proposals.map((p) => (p.id === id ? { ...p, status: "closed" } : p))
  const p = proposals.find((p) => p.id === id) ?? null
  if (p && p.votesFor > p.votesAgainst) {
    // accepted: log acceptance
    logActivity("PROPOSAL_ACCEPTED", { proposalId: id })
    if (reward) {
      // caller may reward contributors
    }
  }
  return p
}
