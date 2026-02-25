import type { ReactNode } from "react"
import React, { useEffect } from "react"

export const theme = {
	colors: {
		background: "#000000",
		gold: "#FFD700",
		green: "#50C878",
		text: "#ffffff",
	},
	transition: "250ms",
}

type Props = {
	children: ReactNode
}

export default function ThemeProvider({ children }: Props) {
	useEffect(() => {
		const d = document.documentElement
		d.style.setProperty("--aur-bg", theme.colors.background)
		d.style.setProperty("--aur-gold", theme.colors.gold)
		d.style.setProperty("--aur-green", theme.colors.green)
		d.style.setProperty("--aur-text", theme.colors.text)
		d.style.setProperty("--aur-transition", theme.transition)
		// also apply to body for consistency
		if (document.body) {
			document.body.style.background = theme.colors.background
			document.body.style.color = theme.colors.text
		}
	}, [])

	return (
		<div style={{ background: "var(--aur-bg)", color: "var(--aur-text)", minHeight: "100%" }}>
			{children}
		</div>
	)
}