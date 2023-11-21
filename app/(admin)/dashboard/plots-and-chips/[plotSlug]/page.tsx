import { notFound } from 'next/navigation'

import { getPlotWithChips } from '@/actions/get-plots'

import { PlotForm } from '../_components/plot-form'

export default async function PlotPage({
	params,
}: {
	params: { plotSlug: string }
}) {
	const plot = await getPlotWithChips(params.plotSlug)

	if (!plot) {
		notFound()
	}

	return (
		<div className="max-w-screen-md w-full flex grow items-center justify-center mx-auto py-[50px]">
			<PlotForm plot={plot} type="edit" />
		</div>
	)
}
