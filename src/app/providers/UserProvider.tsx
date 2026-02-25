import React, { createContext, useContext, useEffect, useState } from "react"
import type { ReactNode } from "react"
import { useUserStore } from "../../state/userStore"
import { getLevelFromReputation } from "../../core/reputation"
import { logActivity, registerUser } from "../../core/activityEngine"
import { registerNewUser } from "../../core/platformStats"
import { useRef } from "react"
import { checkBadges } from "../../core/badges"

export type User = {
  id: string
  username: string
  role?: string
  reputation: number
  level: number
  tokens: number
  completedMissions: string[]
  badges: string[]
}

type UserContextValue = {
  user: User | null
  setUser: (u: User | null) => void
  addReputation: (amount: number) => void
  addTokens: (amount: number) => void
  completeMission: (id: string, reward?: number) => void
}

const KEY = "aur-user"

const UserContext = createContext<UserContextValue | undefined>(undefined)

function fromZustand(z: any): User | null {
  if (!z) return null
  return {
    id: z.id,
    username: z.username,
    role: "member",
    reputation: (z.points ?? 0) * 10,
    level: z.level ?? 1,
    tokens: 0,
    completedMissions: [],
    badges: [],
  }
}

export function UserProvider({ children }: { children: ReactNode }) {
  const zustand = useUserStore()
  const initialHadSaved = useRef<boolean | null>(null)
  const [user, setUserState] = useState<User | null>(() => {
    const saved = localStorage.getItem(KEY)
    initialHadSaved.current = !!saved
    if (saved) {
      try {
        return JSON.parse(saved) as User
      } catch {
        // ignore
      }
    }
    return fromZustand(zustand.user)
  })

  useEffect(() => {
    if (user) {
      zustand.setUser({ id: user.id, username: user.username, level: user.level, points: Math.floor(user.reputation / 10) })
      // register user for leaderboard/activity tracking
      registerUser(user)
      // if user was not present in storage before, count as new registration
      if (initialHadSaved.current === false) {
        try {
          registerNewUser()
        } catch {}
      }
      localStorage.setItem(KEY, JSON.stringify(user))
    } else {
      localStorage.removeItem(KEY)
    }
  }, [user])

  function setUser(u: User | null) {
    setUserState(u)
    if (!u) {
      zustand.logout()
    }
  }

  function addReputation(amount: number) {
    setUserState((prev) => {
      if (!prev) return prev
      const newRep = Math.max(0, prev.reputation + amount)
      const newLevelInfo = getLevelFromReputation(newRep)
      const updated = { ...prev, reputation: newRep, level: newLevelInfo.level }
      logActivity("REPUTATION_GAIN", { amount, newReputation: newRep }, { id: prev.id, username: prev.username })

      // level up
      if (newLevelInfo.level > prev.level) {
        logActivity("LEVEL_UP", { from: prev.level, to: newLevelInfo.level }, { id: prev.id, username: prev.username })
      }

      // badges
      const newBadges = checkBadges(updated)
      if (newBadges.length > 0) {
        updated.badges = Array.from(new Set([...(updated.badges || []), ...newBadges]))
        newBadges.forEach((b) => logActivity("BADGE_EARNED", { badge: b }, { id: prev.id, username: prev.username }))
      }

      registerUser(updated)
      return updated
    })
  }

  function addTokens(amount: number) {
    setUserState((prev) => {
      if (!prev) return prev
      const updated = { ...prev, tokens: prev.tokens + amount }
      logActivity("TOKENS_EARNED", { amount, newTokens: updated.tokens }, { id: prev.id, username: prev.username })

      const newBadges = checkBadges(updated)
      if (newBadges.length > 0) {
        updated.badges = Array.from(new Set([...(updated.badges || []), ...newBadges]))
        newBadges.forEach((b) => logActivity("BADGE_EARNED", { badge: b }, { id: prev.id, username: prev.username }))
      }

      registerUser(updated)
      return updated
    })
  }

  function completeMission(id: string, reward = 50) {
    setUserState((prev) => {
      if (!prev) return prev
      if (prev.completedMissions.includes(id)) return prev
      const updated = { ...prev, completedMissions: [...prev.completedMissions, id], tokens: prev.tokens + reward }
      // reputation for mission
      const newRep = Math.max(0, updated.reputation + 20)
      const lvl = getLevelFromReputation(newRep)
      const final = { ...updated, reputation: newRep, level: lvl.level }
      logActivity("MISSION_COMPLETED", { missionId: id, reward }, { id: prev.id, username: prev.username })

      const newBadges = checkBadges(final)
      if (newBadges.length > 0) {
        final.badges = Array.from(new Set([...(final.badges || []), ...newBadges]))
        newBadges.forEach((b) => logActivity("BADGE_EARNED", { badge: b }, { id: prev.id, username: prev.username }))
      }

      registerUser(final)
      return final
    })
  }

  return <UserContext.Provider value={{ user, setUser, addReputation, addTokens, completeMission }}>{children}</UserContext.Provider>
}

export function useUser() {
  const ctx = useContext(UserContext)
  if (!ctx) throw new Error("useUser must be used within UserProvider")
  return ctx
}
