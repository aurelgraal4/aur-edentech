import type { ReactNode } from "react"
import React from "react"
import ThemeProvider from "./ThemeProvider"
import StoreProvider from "./StoreProvider"
import { UserProvider } from "./UserProvider"

type Props = {
	children: ReactNode
}

export default function AppProvider({ children }: Props) {
	return (
		<ThemeProvider>
			<StoreProvider>
				<UserProvider>{children}</UserProvider>
			</StoreProvider>
		</ThemeProvider>
	)
}

