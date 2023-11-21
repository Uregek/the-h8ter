import { notFound } from 'next/navigation'

import { getChip } from '@/actions/get-chips'
import { getPlotWithChips } from '@/actions/get-plots'
import { Breadcrumbs } from '@/components/ui/breadcrumbs'
import { Plot } from '@/components/ui/plot'

import { ChipList } from '../../_components/chip-list'

export default async function ChipPage({
	params,
}: {
	params: { plotSlug: string; chipSlug: string }
}) {
	const plot = await getPlotWithChips(params.plotSlug, true)

	if (!plot) {
		notFound()
	}

	const chip = await getChip(params.plotSlug, params.chipSlug)

	if (!chip || !chip.visible) {
		notFound()
	}

	return (
		<>
			<h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl relative">
				<p className="absolute uppercase top-0 mr-[15px] right-full text-sm text-muted-foreground font-normal">
					Plot:
				</p>
				<Plot>{plot.title}</Plot>
			</h1>

			{plot.description && (
				<p className="text-center max-w-screen-md">{plot.description}</p>
			)}

			<ChipList
				plotSlug={params.plotSlug}
				chipSlug={params.chipSlug}
				chips={plot.chips}
			/>

			<div className="max-w-screen-md w-full">
				<Breadcrumbs
					links={[
						{ title: plot.title, href: `/plots/${params.plotSlug}` },
						{
							title: plot.chips.find(({ slug }) => slug === params.chipSlug)!
								.title,
							href: `/plots/${params.plotSlug}/${params.chipSlug}`,
						},
					]}
				/>
			</div>
		</>
	)
}
