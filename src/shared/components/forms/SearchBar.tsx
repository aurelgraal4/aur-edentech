import React, { useState } from "react"
import useDebounce from "../../hooks/useDebounce"

type Props = {
	placeholder?: string
	onSearch?: (q: string) => void
}

export default function SearchBar({ placeholder = "Cerca...", onSearch }: Props) {
	const [q, setQ] = useState("")
	const debounced = useDebounce(q, 300)

	React.useEffect(() => {
		if (onSearch) onSearch(debounced)
	}, [debounced])

	return (
		<input
			aria-label="search"
			value={q}
			onChange={(e) => setQ(e.target.value)}
			placeholder={placeholder}
			className="px-3 py-2 rounded-md w-full"
		/>
	)
}
