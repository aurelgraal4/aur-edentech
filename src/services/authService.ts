import { api } from "../core/api/api"
import { saveSession, clearSession, getSession } from "../core/auth/session"

type Credentials = { id: string; sequence: string }

export async function login(credentials: Credentials) {
	const res = await api("/auth/login", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(credentials),
	})

	if (res?.sessionId) {
		saveSession(res.sessionId)
	}

	return res
}

export async function logout() {
	clearSession()
}

export function currentSession() {
	return getSession()
}
