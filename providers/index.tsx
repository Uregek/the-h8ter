'use client'

import { ReactNode } from 'react'

import { TooltipProvider } from '@/components/ui/tooltip'
import { ClerkProvider } from '@/providers/clerk-provider'
import { ReactQueryProvider } from '@/providers/react-query-provider'
import { ThemeProvider } from '@/providers/theme-provider'

export function Providers({ children }: { children: ReactNode }) {
	return (
		<ThemeProvider>
			<ClerkProvider>
				<ReactQueryProvider>
					<TooltipProvider>{children}</TooltipProvider>
				</ReactQueryProvider>
			</ClerkProvider>
		</ThemeProvider>
	)
}
