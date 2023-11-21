import { notFound } from 'next/navigation'

import { getChip } from '@/actions/get-chips'

import { ChipModal } from '../../../_components/chip-modal'

export default async function PlotPage({
	params,
}: {
	params: { plotSlug: string; chipSlug: string }
}) {
	const chip = await getChip(params.plotSlug, params.chipSlug)

	if (!chip) {
		notFound()
	}

	return <ChipModal plotSlug={params.plotSlug} chip={chip} />
}
