import { Fragment } from 'react'

import { HeartFilledIcon } from '@radix-ui/react-icons'

import { Plot } from '@/components/ui/plot'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { config } from '@/lib/config'
import { cn, lorem, randomIntFromInterval } from '@/lib/utils'

export default function Loading() {
	const mockPromoted = [...Array(randomIntFromInterval(2, 4))].map((el) => ({
		title: lorem.generateWords(2),
		chips: [...Array(randomIntFromInterval(2, 4))].map((el) => ({
			title: lorem.generateWords(2),
		})),
	}))

	const mockData = [...Array(randomIntFromInterval(11, 40))].map((el) => ({
		title: lorem.generateWords(3),
		chips: [...Array(randomIntFromInterval(2, 11))].map((el) => ({
			title: lorem.generateWords(2),
		})),
	}))

	return (
		<section className="flex grow gap-[30px] my-[30px] flex-col items-center justify-center">
			<Skeleton className="h-[600px] w-full max-w-screen-lg" />
			<Skeleton>
				<h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
					<Plot>Plots</Plot>
					<span className="text-muted-foreground">{' & '}</span>
					Chips ✦
				</h1>
			</Skeleton>

			<div className="flex grow w-full bg-primary gap-[30px] py-2 flex-col items-center justify-center">
				<div className="flex relative max-w-screen-md w-full flex-row mx-auto gap-[20px] pl-[30px]">
					<div
						className="flex flex-col justify-center items-center h-min gap-1 sticky"
						style={{ top: config.headerHeight + 10 }}
					>
						<HeartFilledIcon className="text-primary-foreground" />
					</div>
					<div className="flex flex-col gap-[30px]">
						<div className="flex flex-row flex-wrap pl-[20px]">
							{mockPromoted.map(({ title, chips }, index) => (
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
													<p className="text-sm text-primary-foreground">✦</p>
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

			<div className="flex relative max-w-screen-md w-full flex-row mx-auto gap-[20px] pl-[30px]">
				<div
					className="flex flex-col justify-center items-center h-min gap-1 sticky"
					style={{ top: config.headerHeight + 10 }}
				>
					{[...Array(randomIntFromInterval(10, 15))].map((_, index) => (
						<Skeleton key={index}>A</Skeleton>
					))}
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
		</section>
	)
}
