import { create } from "zustand"

type User = {
  id: string
    username: string
      level: number
        points: number
          avatar?: string
          }

          type UserStore = {
            user: User | null
              setUser: (user: User) => void
                logout: () => void
                }

                export const useUserStore = create<UserStore>((set) => ({
                  user: null,

                    setUser: (user) =>
                        set(() => ({
                              user,
                                  })),

                                    logout: () =>
                                        set(() => ({
                                              user: null,
                                                  })),
                                                  }))