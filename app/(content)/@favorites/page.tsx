import { BookmarkFilledIcon } from '@radix-ui/react-icons'

import { getFavoritedPlotsWithChips } from '@/actions/get-plots'
import { config } from '@/lib/config'
import { getUser } from '@/lib/get-user'

import { Plot } from '../plots/_components/plot'

export default async function Favorites() {
	const user = await getUser()

	if (!user) {
		return null
	}

	const favoritedPlots = await getFavoritedPlotsWithChips(true, user.username)

	if (!favoritedPlots || !favoritedPlots.length) {
		return null
	}

	return (
		<div className="flex grow bg-popover gap-[30px] py-2 flex-col items-center justify-center">
			<div className="flex relative max-w-screen-md w-full flex-row mx-auto gap-[20px] pl-[30px]">
				<div
					className="flex flex-col justify-center items-center h-min gap-1 sticky"
					style={{ top: config.headerHeight + 10 }}
				>
					<BookmarkFilledIcon className="text-muted-foreground" />
				</div>
				<div className="flex grow flex-row flex-wrap pl-[20px]">
					{favoritedPlots.map((plot) => (
						<Plot
							key={plot.id}
							plot={plot}
							username={user.username}
							role={user.role}
							favorited
						/>
					))}
				</div>
			</div>
		</div>
	)
}
