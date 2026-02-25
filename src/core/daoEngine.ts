import { subscribe, emit, Events } from "./eventBus"
import * as daoStore from "../state/daoStore"
import { rewardUser } from "./rewardEngine"
import { earn as mintTokens, spend as burnTokens } from "./tokenProtocol"
import { completeMissionForUser } from "./missions"
import * as governance from "./governance"
import { logActivity } from "./activityEngine"

// process proposals when closed
function evaluateProposal(p: daoStore.Proposal) {
  if (!p) return
  if (p.votesFor > p.votesAgainst) {
    // passed
    try { emit({ type: "PROPOSAL_PASSED", userId: p.proposer, payload: { proposalId: p.id } }) } catch {}
    // queue execution immediately for now
    executeProposal(p.id)
  } else {
    // rejected
    try { emit({ type: "PROPOSAL_REJECTED", userId: p.proposer, payload: { proposalId: p.id } }) } catch {}
  }
}

export function executeProposal(proposalId: string) {
  const p = daoStore.listProposals().find((x) => x.id === proposalId)
  if (!p) return null

  // mark passed if necessary
  if (!(p.votesFor > p.votesAgainst)) return null

  // execute actions
  for (const a of p.actions) {
    try {
      switch ((a.type || "").toLowerCase()) {
        case "mint_reward":
          if (a.targetUser && a.amount) {
            try { mintTokens(a.targetUser, a.amount, `proposal:${p.id}`) } catch {}
            try { rewardUser(a.targetUser, { tokens: a.amount }) } catch {}
          }
          break
        case "burn_tokens":
          if (a.targetUser && a.amount) {
            try { burnTokens(a.targetUser, a.amount, `proposal_burn:${p.id}`) } catch {}
          }
          break
        case "grant_role":
          // best-effort: log role grant
          try { logActivity("ROLE_GRANTED", { to: a.targetUser, params: a.params }, { id: p.proposer, username: p.proposer }) } catch {}
          break
        case "trigger_mission":
          if (a.targetUser && a.params?.missionId) {
            try { completeMissionForUser(a.targetUser, a.params.missionId, mintTokens) } catch {}
          }
          break
        case "update_parameter":
        case "update_protocol":
          try { logActivity("PROTOCOL_UPDATE", { action: a, proposalId: p.id }) } catch {}
          break
        default:
          try { logActivity("PROPOSAL_ACTION_UNKNOWN", { action: a, proposalId: p.id }) } catch {}
          break
      }
    } catch (e) {
      // swallow per-action errors
    }
  }

  // mark executed in store
  daoStore.executeProposal(p.id)
  try { emit({ type: "PROPOSAL_EXECUTED", userId: p.proposer, payload: { proposalId: p.id } }) } catch {}
  return p
}

// subscribe to events
subscribe(Events.GOV_PROPOSAL_CREATED, (e) => {
  // ensure proposal exists in governance module; also record into daoStore if payload contains proposal
  const pid = e.payload?.proposalId || e.payload?.id
  if (pid) {
    // nothing: governance already has it; daoStore can create mirror if needed
  }
})

subscribe(Events.GOV_VOTE_CAST, (e) => {
  // map vote events to daoStore votes if proposal id available
  const pid = e.payload?.proposalId || e.payload?.id
  const support = e.payload?.support ?? true
  const uid = e.userId || e.payload?.userId
  if (!pid) return
  try { daoStore.voteProposal(pid, support) } catch {}
  const p = daoStore.listProposals().find((x) => x.id === pid)
  if (p && p.votesFor + p.votesAgainst > 0 && p.votesFor + p.votesAgainst >= 1) {
    // if closed condition is represented elsewhere, caller should emit proposal_closed
  }
})

// listen for proposal_closed events (common lowercase)
subscribe("proposal_closed", (e) => {
  const pid = e.payload?.proposalId || e.payload?.id
  if (!pid) return
  const p = daoStore.listProposals().find((x) => x.id === pid)
  if (!p) return
  evaluateProposal(p)
})

// expose create/vote API that also syncs with governance module
export function createProposal(title: string, description: string, proposer: string, actions: daoStore.ProposalAction[] = []) {
  const p = daoStore.createProposal(title, description, proposer, actions)
  try { governance.createProposal(title, description, { id: proposer, username: proposer }, undefined) } catch {}
  try { emit({ type: "PROPOSAL_CREATED", userId: proposer, payload: { proposalId: p.id } }) } catch {}
  return p
}

export function voteOnProposal(proposalId: string, support: boolean, userId?: string) {
  const p = daoStore.voteProposal(proposalId, support)
  try { governance.voteProposal(proposalId, support, userId ? { id: userId, username: userId } : undefined, undefined) } catch {}
  // if closing condition (external) then evaluate
  return p
}

export function listProposals() {
  return daoStore.listProposals()
}

export default { executeProposal, createProposal, voteOnProposal, listProposals }
