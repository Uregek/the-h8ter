'use client'

import Lottie, { LottieComponentProps } from 'lottie-react'
import { flatten } from 'lottie-colorify'
import { useTheme } from 'next-themes'

export function LottieLoader({
	animationData,
	colors = { dark: '#F9FAFB', light: '#030712' },
	...props
}: LottieComponentProps & { colors?: { dark: string; light: string } }) {
	const { theme } = useTheme()
	const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

	let calculatedTheme =
		theme === 'system' ? (prefersDark ? 'dark' : 'light') : theme

	const data = flatten(
		colors[calculatedTheme as keyof typeof colors],
		animationData,
	)
	return <Lottie {...props} animationData={data} />
}
