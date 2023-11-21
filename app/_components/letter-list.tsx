'use client'

import { useCallback, useEffect, useState } from 'react'

import { throttle } from 'lodash'

import { config } from '@/lib/config'
import { cn } from '@/lib/utils'

export function LetterList({ letters }: { letters: string[] }) {
	const [activeLetter, setActiveLetter] = useState('')

	const handleScroll = useCallback(
		throttle(() => {
			const letters = document.querySelectorAll('[data-letter]')
			let currentActiveLetter = ''

			letters.forEach((letter) => {
				const letterTop = letter.getBoundingClientRect().top

				if (letterTop <= config.headerHeight + 10) {
					currentActiveLetter = letter.id
				}
			})

			setActiveLetter(currentActiveLetter)
		}, 50),
		[],
	)

	useEffect(() => {
		window.addEventListener('scroll', handleScroll)

		return () => {
			window.removeEventListener('scroll', handleScroll)
		}
	}, [handleScroll])

	return (
		<>
			{letters.map((letter) => (
				<a
					href={`#${letter}`}
					key={letter}
					className={cn(
						'text-xs translate-x-0 uppercase text-muted-foreground hover:text-accent-foreground',
						letter === activeLetter &&
							'text-accent-foreground scale-150 translate-x-[2px]',
					)}
				>
					{letter}
				</a>
			))}
		</>
	)
}
