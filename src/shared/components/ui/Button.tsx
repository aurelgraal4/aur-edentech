import React from "react"

type Props = {
	children: React.ReactNode
	onClick?: () => void
	className?: string
}

export default function Button({ children, onClick, className = "" }: Props) {
	return (
		<button onClick={onClick} className={className} style={{ background: "var(--aur-gold)", color: "#000", padding: "8px 12px", borderRadius: 6, border: "none" }}>
			{children}
		</button>
	)
}
