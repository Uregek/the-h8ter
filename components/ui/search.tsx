'use client'

import { Fragment, useEffect, useState } from 'react'

import { Crosshair2Icon } from '@radix-ui/react-icons'
import { SearchIcon } from 'lucide-react'
import Fuse, { IFuseOptions } from 'fuse.js'
import Link from 'next/link'

import { PlotsWithChips } from '@/actions/get-plots'
import { Button } from '@/components/ui/button'
import { Command, CommandInput } from '@/components/ui/command'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'

import { Plot } from './plot'

const renderPlotsAndChips = (data: PlotsWithChips) => {
	return data.map(({ id, title, slug, chips }) => (
		<div
			key={id}
			className={cn('flex basis-1/4 flex-col p-3', {
				'basis-1/2': chips.length >= 10,
				'basis-full': chips.length >= 15,
			})}
		>
			<div className="flex flex-row items-center gap-2">
				<DialogTrigger asChild>
					<Link
						prefetch={false}
						href={`/plots/${slug}`}
						className="leading-7 hover:underline max-w-fit text-primary"
					>
						<Plot>{title}</Plot>
					</Link>
				</DialogTrigger>
				<DialogTrigger asChild>
					<a
						href={`/#${slug}`}
						className="text-muted-foreground hover:text-accent-foreground"
					>
						<Crosshair2Icon />
					</a>
				</DialogTrigger>
			</div>
			<div className="flex items-center flex-wrap gap-1 text-sm">
				{chips.map(({ id, title, ...other }, index) => (
					<Fragment key={id}>
						{index !== 0 && <p className="text-sm text-muted-foreground">✦</p>}
						<DialogTrigger asChild>
							<Link
								prefetch={false}
								href={`/plots/${slug}/${other.slug}`}
								className="text-sm text-muted-foreground hover:underline hover:text-accent-foreground"
							>
								{title}
							</Link>
						</DialogTrigger>
					</Fragment>
				))}
			</div>
		</div>
	))
}

export interface SearchProps<T> {
	data: T[]
	searchOptions: IFuseOptions<T>
	type: 'plots&chips'
}

const Search = <T,>({ data, searchOptions, type }: SearchProps<T>) => {
	const [searchedData, setSearchedData] = useState<typeof data>([])
	const [search, setSearch] = useState('')

	const fuse = new Fuse(data, searchOptions)

	useEffect(() => {
		if (!search) {
			setSearchedData([])
		}
		setSearchedData(fuse.search(search).map((result) => result.item))
	}, [search])

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant="ghost" className="flex gap-2">
					Search by Plots
					<SearchIcon className="h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Are you sure absolutely sure?</DialogTitle>
					<DialogDescription>
						This action cannot be undone. This will permanently delete your
						account and remove your data from our servers.
					</DialogDescription>
				</DialogHeader>

				<Command>
					<CommandInput
						value={search}
						onValueChange={setSearch}
						placeholder="Type what to search..."
					/>
					<ScrollArea className="max-h-[300px]">
						{type === 'plots&chips' &&
							renderPlotsAndChips(searchedData as PlotsWithChips)}
					</ScrollArea>
				</Command>
			</DialogContent>
		</Dialog>
	)
}
Search.displayName = 'Search'

export { Search }
