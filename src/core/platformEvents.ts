export const Events = {
  USER_LOGIN: "USER_LOGIN",
  POST_CREATED: "POST_CREATED",
  MISSION_COMPLETED: "MISSION_COMPLETED",
  TOKEN_TRANSFER: "TOKEN_TRANSFER",
  REPUTATION_GAIN: "REPUTATION_GAIN",
  PROPOSAL_CREATED: "PROPOSAL_CREATED",
  VOTE_CAST: "VOTE_CAST",
  REWARD_GRANTED: "REWARD_GRANTED",
} as const

export type EventsType = typeof Events[keyof typeof Events]

// Payload definitions
export type UserLoginPayload = {
  userId: string
  username?: string
  timestamp?: number
}

export type PostCreatedPayload = {
  postId: string
  userId: string
  content?: string
  timestamp?: number
}

export type MissionCompletedPayload = {
  missionId: string
  userId: string
  reward?: number
  reputationDelta?: number
  timestamp?: number
}

export type TokenTransferPayload = {
  from?: string
  to?: string
  amount: number
  reason?: string
  timestamp?: number
}

export type ReputationGainPayload = {
  userId: string
  delta: number
  source?: string
  timestamp?: number
}

export type ProposalCreatedPayload = {
  proposalId: string
  proposerId: string
  title?: string
  description?: string
  timestamp?: number
}

export type VoteCastPayload = {
  proposalId: string
  voterId: string
  support: boolean
  weight?: number
  timestamp?: number
}

export type RewardGrantedPayload = {
  userId: string
  amount?: number
  reputation?: number
  reason?: string
  timestamp?: number
}

export type PlatformEventMap = {
  USER_LOGIN: UserLoginPayload
  POST_CREATED: PostCreatedPayload
  MISSION_COMPLETED: MissionCompletedPayload
  TOKEN_TRANSFER: TokenTransferPayload
  REPUTATION_GAIN: ReputationGainPayload
  PROPOSAL_CREATED: ProposalCreatedPayload
  VOTE_CAST: VoteCastPayload
  REWARD_GRANTED: RewardGrantedPayload
}

export type PlatformEvent<K extends keyof PlatformEventMap = keyof PlatformEventMap> = {
  type: K
  payload: PlatformEventMap[K]
}

export default { Events }
