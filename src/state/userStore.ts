import { create } from 'zustand'

interface AuthState {
  userId: string | null
    logged: boolean
      setUser: (id: string) => void
        logout: () => void
        }

        export const useAuthStore = create<AuthState>((set) => ({
          userId: localStorage.getItem('aur_id'),
            logged: !!localStorage.getItem('aur_id'),

              setUser: (id: string) => {
                  localStorage.setItem('aur_id', id)
                      set({ userId: id, logged: true })
                        },

                          logout: () => {
                              localStorage.removeItem('aur_id')
                                  set({ userId: null, logged: false })
                                    },
                                    }))