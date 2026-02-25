export type Activity = {
  id: string
  type: string
  description: string
  timestamp: string
}

let activities: Activity[] = []

export function logActivity(type: string, description: string) {
  const a: Activity = { id: Date.now().toString(), type, description, timestamp: new Date().toISOString() }
  activities = [a, ...activities].slice(0, 100)
  return a
}

export function getRecentActivities(limit = 10) {
  return activities.slice(0, limit)
}
