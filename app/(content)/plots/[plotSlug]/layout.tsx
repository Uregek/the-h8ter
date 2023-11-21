import { ReactNode } from 'react'

import { notFound } from 'next/navigation'

import { getPlotWithChips } from '@/actions/get-plots'

export default async function PlotLayout({
	children,
	params,
}: {
	children: ReactNode
	params: { plotSlug: string }
}) {
	const plot = await getPlotWithChips(params.plotSlug, true)

	if (!plot) {
		notFound()
	}

	return (
		<section className="flex grow gap-[30px] my-[30px] flex-col items-center justify-center">
			{children}
		</section>
	)
}
