'use client'

import { ReactNode, useEffect, useState } from 'react'

import { ClerkProvider as NextClerkProvider } from '@clerk/nextjs'
import { dark } from '@clerk/themes'
import { useTheme } from 'next-themes'

export function ClerkProvider({ children }: { children: ReactNode }) {
	const [prefersDark, setPrefersDark] = useState<boolean | null>(null)
	const { theme } = useTheme()

	useEffect(() => {
		setPrefersDark(window.matchMedia('(prefers-color-scheme: dark)').matches)
	})

	let calculatedTheme =
		theme === 'system' ? (prefersDark ? 'dark' : 'light') : theme

	return (
		<NextClerkProvider
			appearance={{
				baseTheme: calculatedTheme === 'dark' ? dark : undefined,
			}}
		>
			{children}
		</NextClerkProvider>
	)
}
