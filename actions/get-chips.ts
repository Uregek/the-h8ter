import { cache } from 'react'

import { db } from '@/lib/db'

const getChips = cache(async (visible?: boolean) => {
	const chips = await db.chip.findMany({
		where: {
			visible,
		},
		orderBy: { title: 'asc' },
	})
	return chips
})

type Chips = NonNullable<Awaited<ReturnType<typeof getChips>>>

const getChip = cache(async (plotSlug: string, chipSlug: string) => {
	const chip = await db.chip.findUnique({
		where: {
			uniqueSlugWithinPlot: {
				plotSlug,
				slug: chipSlug,
			},
		},
	})
	return chip
})

type Chip = NonNullable<Awaited<ReturnType<typeof getChip>>>

const getChipsByPlot = cache(async (plotSlug: string, visible?: boolean) => {
	const chips = await db.chip.findMany({
		where: {
			visible,
			plotSlug,
		},
		orderBy: { title: 'asc' },
	})
	return chips
})

type ChipsByPlot = NonNullable<Awaited<ReturnType<typeof getChipsByPlot>>>

export { getChip, getChips, getChipsByPlot }
export type { Chip, Chips, ChipsByPlot }
