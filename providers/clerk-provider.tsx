'use client'

import { ReactNode } from 'react'

import { ClerkProvider as NextClerkProvider } from '@clerk/nextjs'
import { dark } from '@clerk/themes'
import { useTheme } from 'next-themes'

export function ClerkProvider({ children }: { children: ReactNode }) {
	const { theme } = useTheme()

	return (
		<NextClerkProvider
			appearance={{
				baseTheme: theme === 'dark' ? dark : undefined,
			}}
		>
			{children}
		</NextClerkProvider>
	)
}
