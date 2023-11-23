import { HeartFilledIcon } from '@radix-ui/react-icons'

import {
	getFavoritedPlotsWithChips,
	getPlotsWithChips,
	PlotsWithChips,
} from '@/actions/get-plots'
import { Plot as PlotWrapper } from '@/components/ui/plot'
import { Skeleton } from '@/components/ui/skeleton'
import { config } from '@/lib/config'
import { getUser } from '@/lib/get-user'

import { LetterList } from './plots/_components/letter-list'
import { Plot } from './plots/_components/plot'

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

	const user = await getUser()

	const favoritedPlots = await getFavoritedPlotsWithChips(true, user?.username)

	const groupedObjects = groupPlotsByFirstLetter(plots)

	return (
		<section className="flex grow gap-[30px] my-[30px] flex-col items-center justify-center">
			<Skeleton className="h-[600px] w-full max-w-screen-lg" />
			<h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
				<PlotWrapper>Plots</PlotWrapper>
				<span className="text-muted-foreground">{' & '}</span>
				Chips ✦
			</h1>

			<div className="flex w-full grow bg-primary gap-[30px] py-2 flex-col items-center justify-center">
				<div className="flex relative max-w-screen-md w-full flex-row mx-auto gap-[20px] pl-[30px]">
					<div
						className="flex flex-col justify-center items-center h-min gap-1 sticky"
						style={{ top: config.headerHeight + 10 }}
					>
						<HeartFilledIcon className="text-primary-foreground" />
					</div>
					<div className="flex grow flex-row flex-wrap pl-[20px]">
						{plots
							.filter((plot) => plot.promoted)
							.map((plot) => (
								<Plot
									key={plot.id}
									plot={plot}
									username={user?.username}
									role={user?.role}
									favorited={favoritedPlots.some(
										(favoritedPlot) => favoritedPlot.id === plot.id,
									)}
									promoted
								/>
							))}
					</div>
				</div>
			</div>

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
								{objectsArray.map((plot) => (
									<Plot
										key={plot.id}
										plot={plot}
										username={user?.username}
										role={user?.role}
										favorited={favoritedPlots.some(
											(favoritedPlot) => favoritedPlot.id === plot.id,
										)}
									/>
								))}
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	)
}
