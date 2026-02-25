export type ProposalAction = {
  type: string
  targetUser?: string
  amount?: number
  params?: any
}

export type Proposal = {
  id: string
  title: string
  description: string
  proposer: string
  actions: ProposalAction[]
  votesFor: number
  votesAgainst: number
  status: "draft" | "active" | "passed" | "rejected" | "executed"
  createdAt: number
  executedAt?: number | null
}

let proposals: Proposal[] = []

function makeId() {
  return Date.now().toString() + Math.random().toString(36).slice(2, 8)
}

export function createProposal(title: string, description: string, proposer: string, actions: ProposalAction[] = []) {
  const p: Proposal = { id: makeId(), title, description, proposer, actions, votesFor: 0, votesAgainst: 0, status: "active", createdAt: Date.now(), executedAt: null }
  proposals = [p, ...proposals]
  return p
}

export function voteProposal(id: string, support: boolean) {
  proposals = proposals.map((p) => (p.id === id ? { ...p, votesFor: support ? p.votesFor + 1 : p.votesFor, votesAgainst: support ? p.votesAgainst : p.votesAgainst + 1 } : p))
  return proposals.find((p) => p.id === id) ?? null
}

export function executeProposal(id: string) {
  proposals = proposals.map((p) => (p.id === id ? { ...p, status: "executed", executedAt: Date.now() } : p))
  return proposals.find((p) => p.id === id) ?? null
}

export function listProposals() {
  return proposals
}

export default { createProposal, voteProposal, executeProposal, listProposals }
