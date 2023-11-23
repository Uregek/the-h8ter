import { Fragment } from 'react'

import { LightningBoltIcon, Pencil1Icon } from '@radix-ui/react-icons'
import { Role } from '@prisma/client'
import Link from 'next/link'

import { PlotWithChips } from '@/actions/get-plots'
import { Plot as PlotWrapper } from '@/components/ui/plot'
import { Separator } from '@/components/ui/separator'
import { config } from '@/lib/config'
import { cn, isHaveRoleAccess } from '@/lib/utils'

import { FavoritePlot } from './favorite-plot'

export function Plot({
	plot,
	username,
	favorited,
	promoted,
	role,
}: {
	plot: PlotWithChips
	username?: string
	favorited?: boolean
	promoted?: boolean
	role?: Role
}) {
	const isCanEdit = isHaveRoleAccess(role || 'CONSUMER', '>=', 'ADMIN')

	const { id, chips, slug, title } = plot
	return (
		<div
			key={id}
			className={cn('flex basis-1/4 flex-col p-3', {
				'basis-1/2': chips.length >= 10,
				'basis-full': chips.length >= 15,
			})}
		>
			<div className="flex flex-row items-end justify-between">
				<Link
					prefetch={false}
					href={`/plots/${slug}`}
					className="leading-7 hover:underline max-w-fit text-primary"
					id={slug}
					style={{ scrollMarginTop: config.headerHeight + 10 }}
				>
					<PlotWrapper>{title}</PlotWrapper>
				</Link>

				<div
					className={cn(
						'flex flex-col mt-2 gap-1 justify-end items-center text-muted-foreground',
						promoted && 'text-primary-foreground',
					)}
				>
					{isCanEdit && (
						<a href={`/dashboard/plots-and-chips/${slug}`}>
							<Pencil1Icon
								className={cn(
									'hover:text-accent-foreground',
									promoted && 'hover:text-primary-foreground',
								)}
							/>
						</a>
					)}
					{plot.promoted && <LightningBoltIcon />}
					{favorited !== undefined && username && (
						<FavoritePlot
							plotSlug={plot.slug}
							username={username}
							favorited={favorited}
							promoted={promoted}
						/>
					)}
				</div>
			</div>

			<Separator className="my-2" />

			<div className="flex items-center flex-wrap gap-1 text-sm">
				{chips.map(({ id, title, ...other }, index) => (
					<Fragment key={id}>
						{index !== 0 && (
							<p
								className={cn(
									'text-sm text-muted-foreground',
									promoted && 'text-primary-foreground',
								)}
							>
								✦
							</p>
						)}
						<Link
							prefetch={false}
							href={`/plots/${slug}/${other.slug}`}
							className={cn(
								'text-sm text-muted-foreground hover:underline hover:text-accent-foreground',
								promoted &&
									'text-primary-foreground hover:text-primary-foreground',
							)}
						>
							{title}
						</Link>
					</Fragment>
				))}
			</div>
		</div>
	)
}
