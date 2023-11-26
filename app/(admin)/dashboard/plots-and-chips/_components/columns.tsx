'use client'

import { ColumnDef } from '@tanstack/react-table'
import Link from 'next/link'

import { Plot } from '@/actions/get-plots'
import { Badge } from '@/components/ui/badge'
import { CopyToClipboard } from '@/components/ui/copy-to-clipboard'
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@/components/ui/tooltip'
import { config } from '@/lib/config'

import { DataTableColumnHeader } from './data-table-column-header'
import { DataTableRowActions } from './data-table-row-actions'

export const columns: ColumnDef<Plot>[] = [
	{
		accessorKey: 'id',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Id" />
		),
		cell: ({ row }) => (
			<div className="flex gap-1 flex-col">
				<span className="flex items-center gap-2">
					<CopyToClipboard valueToCopy={row.getValue('id')}>
						<Tooltip>
							<TooltipTrigger>
								{`${(row.getValue('id') as string).substr(0, 3)}...${(
									row.getValue('id') as string
								).substr(-3, 3)}`}
							</TooltipTrigger>
							<TooltipContent>
								<p>{row.getValue('id')}</p>
							</TooltipContent>
						</Tooltip>
					</CopyToClipboard>
				</span>
			</div>
		),
		enableSorting: false,
		enableHiding: true,
	},
	{
		accessorKey: 'title',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Title" />
		),
		cell: ({ row }) => {
			return (
				<div className="flex space-x-2">
					<span className="max-w-[500px] flex text-primary items-center gap-2 font-medium">
						<CopyToClipboard valueToCopy={row.original!.slug}>
							<Tooltip>
								<TooltipTrigger asChild>
									<Link
										href={`/plots/${row.original!.slug}`}
										className="hover:underline line-clamp-3"
									>
										{row.getValue('title')}
									</Link>
								</TooltipTrigger>
								<TooltipContent>
									<p>{row.original!.slug}</p>
								</TooltipContent>
							</Tooltip>
						</CopyToClipboard>
					</span>
				</div>
			)
		},
	},
	{
		accessorKey: 'description',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Description" />
		),
		cell: ({ row }) => {
			return (
				<div className="flex space-x-2">
					<span className="max-w-[500px] line-clamp-3 text-xs">
						{row.getValue('description')}
					</span>
				</div>
			)
		},
	},
	{
		accessorKey: '_count.chips',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Chips" />
		),
		cell: ({ row }) => {
			return (
				<div className="flex space-x-2">
					<span className="max-w-[500px] truncate">
						{`${row.original?._count.chips} pcs`}
					</span>
				</div>
			)
		},
	},
	{
		accessorKey: 'letter',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Letter" />
		),
		cell: ({ row }) => {
			return (
				<div className="flex items-center">
					<Badge variant="secondary" className="rounded-sm px-1 font-normal">
						{row.getValue('letter')}
					</Badge>
				</div>
			)
		},
		filterFn: (row, id, value) => {
			return value.includes(row.getValue(id))
		},
	},
	{
		accessorKey: 'promoted',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Promoted" />
		),
		cell: ({ row }) => {
			const promoted = config.promotedMap.find(
				(promoted) => promoted.value === row.getValue('promoted'),
			)

			if (!promoted) {
				return null
			}

			return (
				<div className="flex items-center">
					{promoted.icon && (
						<promoted.icon className="mr-2 h-4 w-4 text-muted-foreground" />
					)}
					<span>{promoted.label}</span>
				</div>
			)
		},
		filterFn: (row, id, value) => {
			return value.includes(row.getValue(id))
		},
	},
	{
		accessorKey: 'visible',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Visibility" />
		),
		cell: ({ row }) => {
			const visible = config.visibilityMap.find(
				(visible) => visible.value === row.getValue('visible'),
			)

			if (!visible) {
				return null
			}

			return (
				<div className="flex items-center">
					{visible.icon && (
						<visible.icon className="mr-2 h-4 w-4 text-muted-foreground" />
					)}
					<span>{visible.label}</span>
				</div>
			)
		},
		filterFn: (row, id, value) => {
			return value.includes(row.getValue(id))
		},
	},
	{
		id: 'actions',
		cell: ({ row }) => <DataTableRowActions row={row} />,
	},
]
