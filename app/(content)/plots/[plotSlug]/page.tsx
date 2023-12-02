import { notFound } from 'next/navigation'

import { getPlotWithChips } from '@/actions/get-plots'
import { Breadcrumbs } from '@/components/ui/breadcrumbs'
import { ImageHeader } from '@/components/ui/image-header'
import { Plot } from '@/components/ui/plot'

import { ChipList } from '../_components/chip-list'

export default async function PlotPage({
	params,
}: {
	params: { plotSlug: string }
}) {
	const plot = await getPlotWithChips(params.plotSlug, true)

	if (!plot) {
		notFound()
	}

	return (
		<>
			{plot.previewUrl !== null && <ImageHeader imageSrc={plot.previewUrl} />}
			<h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl relative">
				<p className="absolute uppercase top-0 mr-[15px] right-full text-sm text-muted-foreground font-normal">
					Plot:
				</p>
				<Plot>{plot.title}</Plot>
			</h1>

			<p className="text-center max-w-screen-md">{plot.description}</p>

			<div className="max-w-screen-md w-full">
				<Breadcrumbs
					links={[{ title: plot.title, href: `/plots/${params.plotSlug}` }]}
				/>
			</div>

			<ChipList plotSlug={params.plotSlug} chips={plot.chips} />
		</>
	)
}
