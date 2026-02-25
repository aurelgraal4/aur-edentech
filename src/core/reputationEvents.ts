import { gainReputation } from "./reputation"

export type ReputationEvent = "POST_CREATED" | "MISSION_COMPLETED" | "PROPOSAL_CREATED" | "VOTE_CAST"

const MAP: Record<ReputationEvent, number> = {
  POST_CREATED: 5,
  MISSION_COMPLETED: 20,
  PROPOSAL_CREATED: 15,
  VOTE_CAST: 2,
}

export function triggerReputationEvent(ev: ReputationEvent) {
  const points = MAP[ev] ?? 0
  gainReputation(points)
  return points
}
