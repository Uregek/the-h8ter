import { notFound } from 'next/navigation'

import { getChip } from '@/actions/get-chips'

import { ChipForm } from '../../_components/chip-form'

export default async function ChipPage({
	params,
}: {
	params: { plotSlug: string; chipSlug: string }
}) {
	const chip = await getChip(params.plotSlug, params.chipSlug)

	if (!chip) {
		notFound()
	}

	return (
		<div className="max-w-screen-md w-full flex grow items-center justify-center mx-auto py-[50px]">
			<ChipForm plotSlug={params.plotSlug} chip={chip} type="edit" />
		</div>
	)
}
