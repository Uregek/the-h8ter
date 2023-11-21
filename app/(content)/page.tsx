import { Fragment } from 'react'

import Link from 'next/link'

import { getPlotsWithChips, PlotsWithChips } from '@/actions/get-plots'
import { Plot } from '@/components/ui/plot'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { config } from '@/lib/config'
import { cn } from '@/lib/utils'

import { LetterList } from '../_components/letter-list'

function groupPlotsByFirstLetter(plots: PlotsWithChips) {
	const grouped: Record<string, PlotsWithChips> = {}

	plots.forEach((plot) => {
		const firstLetter = plot.title.charAt(0).toUpperCase()
		if (!grouped[firstLetter]) {
			grouped[firstLetter] = []
		}
		grouped[firstLetter].push(plot)
	})

	return grouped
}

export default async function Page() {
	const plots = await getPlotsWithChips(true)

	const groupedObjects = groupPlotsByFirstLetter(plots)

	return (
		<section className="flex grow gap-[30px] my-[30px] flex-col items-center justify-center">
			<Skeleton className="h-[600px] w-full max-w-screen-lg" />
			<h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
				<Plot>Plots</Plot>
				<span className="text-muted-foreground">{' & '}</span>
				Chips ✦
			</h1>
			<div className="flex relative max-w-screen-md w-full flex-row mx-auto gap-[20px] pl-[30px]">
				<div
					className="flex flex-col justify-center items-center h-min gap-1 sticky"
					style={{ top: config.headerHeight + 10 }}
				>
					<LetterList letters={Object.keys(groupedObjects)} />
				</div>
				<div className="flex flex-col gap-[30px]">
					{Object.entries(groupedObjects).map(([letter, objectsArray]) => (
						<div className="flex flex-col relative" key={letter}>
							<span
								id={letter}
								style={{ scrollMarginTop: config.headerHeight + 10 }}
								data-letter
							/>
							<a
								href={`#${letter}`}
								className="text-sm uppercase w-min text-muted-foreground h-min hover:text-accent-foreground sticky"
								style={{ top: config.headerHeight + 10 }}
							>
								{letter}
							</a>
							<div className="flex flex-row flex-wrap pl-[20px]">
								{objectsArray.map(({ id, title, slug, chips }) => (
									<div
										key={id}
										className={cn('flex basis-1/4 flex-col p-3', {
											'basis-1/2': chips.length >= 10,
											'basis-full': chips.length >= 15,
										})}
									>
										<Link
											prefetch={false}
											href={`/plots/${slug}`}
											className="leading-7 hover:underline max-w-fit text-primary"
											id={slug}
											style={{ scrollMarginTop: config.headerHeight + 10 }}
										>
											<Plot>{title}</Plot>
										</Link>
										<Separator className="my-2" />
										<div className="flex items-center flex-wrap gap-1 text-sm">
											{chips.map(({ id, title, ...other }, index) => (
												<Fragment key={id}>
													{index !== 0 && (
														<p className="text-sm text-muted-foreground">✦</p>
													)}
													<Link
														prefetch={false}
														href={`/plots/${slug}/${other.slug}`}
														className="text-sm text-muted-foreground hover:underline hover:text-accent-foreground"
													>
														{title}
													</Link>
												</Fragment>
											))}
										</div>
									</div>
								))}
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	)
}
