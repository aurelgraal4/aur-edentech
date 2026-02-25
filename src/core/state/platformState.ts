type Subscriber = (state: any) => void

let state: any = {
  user: null,
  reputation: 0,
  tokenBalance: 0,
  missions: [],
  activityScore: 0,
  governancePower: 0,
}

const subs: Set<Subscriber> = new Set()

export function getState() {
  return { ...state }
}

export function updateState(patch: Partial<typeof state>) {
  state = { ...state, ...patch }
  subs.forEach((s) => {
    try { s(state) } catch {}
  })
}

export function subscribe(fn: Subscriber) {
  subs.add(fn)
  return () => subs.delete(fn)
}

export default { getState, updateState, subscribe }
