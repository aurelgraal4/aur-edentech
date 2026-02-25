export function saveSession(id: string) {
      localStorage.setItem("aur-session", id)
      }

      export function getSession() {
        return localStorage.getItem("aur-session")
        }

        export function clearSession() {
          localStorage.removeItem("aur-session")
          }