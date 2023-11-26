import { cache } from 'react'

import { db } from '@/lib/db'

const getPlots = cache(
	async (visible?: boolean, favoritedByUsername?: string) => {
		const data = await db.plot.findMany({
			where: {
				visible,
				favoritedBy: {
					every: { username: favoritedByUsername },
				},
			},
			include: {
				_count: {
					select: {
						chips: true,
					},
				},
			},
			orderBy: { title: 'asc' },
		})
		return data
	},
)

type Plots = NonNullable<Awaited<ReturnType<typeof getPlots>>>

const getPlot = cache(async (slug: string) => {
	const plot = await db.plot.findUnique({
		where: {
			slug,
		},
		include: {
			_count: {
				select: {
					chips: true,
				},
			},
		},
	})

	return plot
})

type Plot = NonNullable<Awaited<ReturnType<typeof getPlot>>>

const getPlotsWithChips = cache(async (visible?: boolean) => {
	const data = await db.plot.findMany({
		where: {
			visible,
		},
		include: {
			chips: {
				where: { visible },
				orderBy: { title: 'asc' },
			},
		},
		orderBy: { title: 'asc' },
	})
	return data
})

type PlotsWithChips = NonNullable<Awaited<ReturnType<typeof getPlotsWithChips>>>

const getPlotWithChips = cache(async (slug: string, visible?: boolean) => {
	const plot = await db.plot.findUnique({
		where: {
			slug,
			visible,
		},
		include: {
			chips: {
				where: { visible },
				orderBy: { title: 'asc' },
			},
		},
	})

	return plot
})

type PlotWithChips = NonNullable<Awaited<ReturnType<typeof getPlotWithChips>>>

const getFavoritedPlotsWithChips = async (
	visible: boolean = false,
	favoritedByUsername?: string,
) => {
	const data = await db.plot.findMany({
		where: {
			AND: {
				visible,
				favoritedBy: {
					some: { username: favoritedByUsername },
				},
			},
		},
		include: {
			chips: {
				where: { visible },
				orderBy: { title: 'asc' },
			},
		},
		orderBy: { title: 'asc' },
	})
	return data
}

export {
	getFavoritedPlotsWithChips,
	getPlot,
	getPlots,
	getPlotsWithChips,
	getPlotWithChips,
}
export type { Plot, Plots, PlotsWithChips, PlotWithChips }
