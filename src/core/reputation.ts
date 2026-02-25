export type LevelResult = {
  level: number
  title: string
  nextLevel: number | null
  progress: number // 0..1
}

const THRESHOLDS = [0, 100, 300, 700, 1500]
const TITLES = ["Newborn", "Explorer", "Builder", "Architect", "Guardian"]

let reputation = 0

export function gainReputation(points: number) {
  reputation = Math.max(0, reputation + points)
  return reputation
}

export function loseReputation(points: number) {
  reputation = Math.max(0, reputation - points)
  return reputation
}

export function getReputation() {
  return reputation
}

export function getLevelFromReputation(rep: number): LevelResult {
  let idx = 0
  for (let i = 0; i < THRESHOLDS.length; i++) {
    if (rep >= THRESHOLDS[i]) idx = i
  }

  const title = TITLES[idx] ?? TITLES[TITLES.length - 1]
  const level = idx + 1

  const nextThreshold = THRESHOLDS[idx + 1] ?? null
  const progress = nextThreshold ? Math.min(1, (rep - THRESHOLDS[idx]) / (nextThreshold - THRESHOLDS[idx])) : 1

  return { level, title, nextLevel: nextThreshold, progress }
}

import { getUserStats, getRegisteredUsers } from "./activityEngine"
import { getLeaderboard } from "./leaderboard"

export function calculateUserScore(userId: string) {
  const stats = getUserStats(userId)
  // weights
  const postCreated = (stats.posts || 0) * 2
  const // postLiked placeholder = 0
    postLiked = 0
  const missionCompleted = (stats.missionsCompleted || 0) * 10
  const proposalCreated = (stats.proposalsCreated || 0) * 8
  const voteCast = (stats.votesCast || 0) * 2

  const user = getRegisteredUsers().find((u: any) => u.id === userId)
  const reputation = user?.reputation ?? 0

  const userScore = postCreated + postLiked + missionCompleted + proposalCreated + voteCast + reputation * 0.5

  // simple daily/weekly placeholders: sum of recent activities weights
  const dailyScore = userScore * 0.1
  const weeklyScore = userScore * 0.3

  return { userScore, dailyScore, weeklyScore }
}
