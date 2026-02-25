export const API_URL = "http://localhost:3000"

export async function api(path: string, options?: RequestInit) {
  const res = await fetch(`${API_URL}${path}`, options)

    if (!res.ok) {
        throw new Error("API error")
          }

            return res.json()
            }