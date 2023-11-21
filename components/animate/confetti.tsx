'use client'

import { useEffect, useState } from 'react'
import NextConfetti, { Props } from 'react-confetti'
import { createPortal } from 'react-dom'

import { useWindowSize } from '@uidotdev/usehooks'

export function Confetti({
	full,
	inPortal = true,
	...props
}: Props & { full?: boolean; inPortal?: boolean }) {
	const [isDomReady, setIsDomReady] = useState(false)

	useEffect(() => {
		setIsDomReady(true)
	}, [])

	const { width, height } = useWindowSize()

	const component = (
		<NextConfetti
			width={full ? width! : undefined}
			height={full ? height! : undefined}
			{...props}
		/>
	)
	return inPortal
		? isDomReady
			? createPortal(
					component,
					document.getElementById('confetti-portal')!,
					'conf',
			  )
			: null
		: component
}
