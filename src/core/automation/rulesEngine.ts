export type RuleHandler = (event: { type: string; payload?: any; userId?: string }) => Promise<void> | void

export type Rule = {
  name: string
  events: string[]
  handler: RuleHandler
}

const rules: Map<string, Rule> = new Map()

export function registerRule(r: Rule) {
  rules.set(r.name, r)
}

export function getRule(name: string) {
  return rules.get(name) ?? null
}

export function listRules() {
  return Array.from(rules.values())
}

export async function evaluateRulesForEvent(event: { type: string; payload?: any; userId?: string }) {
  const ev = event.type
  for (const r of rules.values()) {
    if (r.events.includes(ev)) {
      try { await r.handler(event) } catch {}
    }
  }
}

export default { registerRule, getRule, listRules, evaluateRulesForEvent }
