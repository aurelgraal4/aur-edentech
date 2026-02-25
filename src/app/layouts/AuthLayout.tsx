import type { ReactNode } from "react"

type Props = {
  children: ReactNode
  }

  export default function AuthLayout({ children }: Props) {
    return (
        <div
              style={{
                      minHeight: "100vh",
                              display: "flex",
                                      alignItems: "center",
                                              justifyContent: "center",
                                                      background: "#0f172a"
                                                            }}
                                                                >
                                                                      {children}
                                                                          </div>
                                                                            )
                                                                            }