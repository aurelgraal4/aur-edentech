import type { ReactNode } from "react"
import React from "react"
import GlobalProvider from "../../state/GlobalProvider"

type Props = {
	children: ReactNode
}

export default function StoreProvider({ children }: Props) {
	return <GlobalProvider>{children}</GlobalProvider>
}

