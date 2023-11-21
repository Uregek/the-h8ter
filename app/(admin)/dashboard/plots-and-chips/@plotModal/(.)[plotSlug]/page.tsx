import { notFound } from 'next/navigation'

import { getPlotWithChips } from '@/actions/get-plots'

import { PlotModal } from '../../_components/plot-modal'

export default async function PlotPage({
	params,
}: {
	params: { plotSlug: string }
}) {
	const plot = await getPlotWithChips(params.plotSlug)

	if (!plot) {
		notFound()
	}

	return <PlotModal plot={plot} />
}
