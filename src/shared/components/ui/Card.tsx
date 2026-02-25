import React from "react"

type Props = {
	children: React.ReactNode
	title?: string
	className?: string
	style?: React.CSSProperties
}

export default function Card({ children, title, className = "", style }: Props) {
	return (
		<div className={`aur-card ${className}`} style={{ background: "#0b0b0b", padding: 16, borderRadius: 8, border: "1px solid rgba(255,215,0,0.06)", ...style }}>
			{title && <h3 style={{ marginTop: 0 }}>{title}</h3>}
			<div>{children}</div>
		</div>
	)
}
