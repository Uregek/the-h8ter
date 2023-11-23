import { Fragment } from 'react'

import { BookmarkFilledIcon } from '@radix-ui/react-icons'

import { Plot } from '@/components/ui/plot'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { config } from '@/lib/config'
import { cn, lorem, randomIntFromInterval } from '@/lib/utils'

export default function Loading() {
	const mockData = [...Array(randomIntFromInterval(2, 4))].map((el) => ({
		title: lorem.generateWords(2),
		chips: [...Array(randomIntFromInterval(2, 4))].map((el) => ({
			title: lorem.generateWords(2),
		})),
	}))

	return (
		<div className="flex grow bg-popover gap-[30px] py-2 flex-col items-center justify-center">
			<div className="flex relative max-w-screen-md w-full flex-row mx-auto gap-[20px] pl-[30px]">
				<div
					className="flex flex-col justify-center items-center h-min gap-1 sticky"
					style={{ top: config.headerHeight + 10 }}
				>
					<BookmarkFilledIcon className="text-muted-foreground" />
				</div>
				<div className="flex flex-col gap-[30px]">
					<div className="flex flex-row flex-wrap pl-[20px]">
						{mockData.map(({ title, chips }, index) => (
							<div
								key={index}
								className={cn('flex basis-1/4 flex-col p-3', {
									'basis-1/2': chips.length >= 10,
									'basis-full': chips.length >= 15,
								})}
							>
								<Skeleton>
									<div className="leading-7 hover:underline max-w-fit text-primary">
										<Plot>{title}</Plot>
									</div>
								</Skeleton>
								<Separator className="my-2" />
								<div className="flex items-center flex-wrap gap-1 text-sm">
									{chips.map(({ title }, index) => (
										<Fragment key={index}>
											{index !== 0 && (
												<p className="text-sm text-muted-foreground">✦</p>
											)}
											<Skeleton>
												<span className="text-sm text-muted-foreground hover:underline hover:text-accent-foreground">
													{title}
												</span>
											</Skeleton>
										</Fragment>
									))}
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	)
}
