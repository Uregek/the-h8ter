'use client'

import { useEffect, useState } from 'react'

import { Cross2Icon, PlusCircledIcon } from '@radix-ui/react-icons'
import { Table } from '@tanstack/react-table'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { config } from '@/lib/config'

import { DataTableFacetedFilter } from './data-table-faceted-filter'
import { DataTableViewOptions } from './data-table-view-options'
import { PlotForm } from './plot-form'

interface DataTableToolbarProps<TData> {
	table: Table<TData>
	letters: { value: string; label: string }[]
}

export function DataTableToolbar<TData>({
	table,
	letters,
}: DataTableToolbarProps<TData>) {
	const router = useRouter()
	const [isCreatePlotModalOpened, setIsCreatePlotModalOpened] = useState<
		boolean | null
	>(null)

	useEffect(() => {
		if (!isCreatePlotModalOpened && isCreatePlotModalOpened !== null) {
			setTimeout(() => {
				router.refresh()
			}, 3000)
		}
	}, [isCreatePlotModalOpened, router])

	const isFiltered = table.getState().columnFilters.length > 0

	return (
		<Dialog
			open={isCreatePlotModalOpened === null ? false : isCreatePlotModalOpened}
			onOpenChange={setIsCreatePlotModalOpened}
		>
			<div className="flex items-center justify-between">
				<div className="flex flex-1 items-center mr-2 space-x-2">
					<Input
						placeholder="Filter plots..."
						value={(table.getColumn('title')?.getFilterValue() as string) ?? ''}
						onChange={(event) =>
							table.getColumn('title')?.setFilterValue(event.target.value)
						}
						className="h-8 w-[150px] lg:w-[250px]"
					/>
					{table.getColumn('letter') && (
						<DataTableFacetedFilter
							column={table.getColumn('letter')}
							title="Letter"
							options={letters}
						/>
					)}
					{table.getColumn('visible') && (
						<DataTableFacetedFilter
							column={table.getColumn('visible')}
							title="Visibility"
							options={config.visibilityMap}
						/>
					)}
					{isFiltered && (
						<Button
							variant="ghost"
							onClick={() => table.resetColumnFilters()}
							className="h-8 px-2 lg:px-3"
						>
							Reset
							<Cross2Icon className="ml-2 h-4 w-4" />
						</Button>
					)}
				</div>
				<DataTableViewOptions table={table} />
				<DialogTrigger asChild>
					<Button size="sm" className="h-8 ml-2">
						<PlusCircledIcon className="mr-2 h-4 w-4" />
						Create Plot
					</Button>
				</DialogTrigger>
			</div>

			<DialogContent>
				<DialogHeader>
					<DialogTitle>Create Plot</DialogTitle>
					<DialogDescription>
						Make changes to your profile here. Click save when you are done.
					</DialogDescription>
				</DialogHeader>
				<PlotForm
					asModal
					type="create"
					handleClose={() => {
						setIsCreatePlotModalOpened(false)
						router.refresh()
					}}
				/>
			</DialogContent>
		</Dialog>
	)
}
