'use client'

import { ColumnDef } from '@tanstack/react-table'
import { Profile } from '@prisma/client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { CopyToClipboard } from '@/components/ui/copy-to-clipboard'
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@/components/ui/tooltip'
import { config } from '@/lib/config'

import { DataTableColumnHeader } from './data-table-column-header'
import { DataTableRowActions } from './data-table-row-actions'

export const columns: ColumnDef<Profile>[] = [
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
				<span className="flex items-center gap-2">
					<CopyToClipboard valueToCopy={row.original.userId}>
						<Tooltip>
							<TooltipTrigger>
								{`${row.original.userId.substr(
									0,
									3,
								)}...${row.original.userId.substr(-3, 3)}`}
							</TooltipTrigger>
							<TooltipContent>
								<p>{row.original.userId}</p>
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
		accessorKey: 'imageUrl',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Avatar" />
		),
		cell: ({ row }) => (
			<Avatar>
				<AvatarImage src={row.getValue('imageUrl')} />
				<AvatarFallback>
					{(row.getValue('username') as string)[0]}
				</AvatarFallback>
			</Avatar>
		),
		enableSorting: false,
		enableHiding: false,
	},
	{
		accessorKey: 'username',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Username" />
		),
		cell: ({ row }) => {
			return (
				<div className="flex space-x-2">
					<span className="max-w-[500px] truncate text-primary font-medium">
						{row.getValue('username')}
					</span>
				</div>
			)
		},
	},
	{
		accessorKey: 'email',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Email" />
		),
		cell: ({ row }) => {
			return (
				<div className="flex space-x-2">
					<span className="max-w-[500px] flex items-center gap-2 truncate">
						<CopyToClipboard valueToCopy={row.getValue('email')}>
							{row.getValue('email')}
						</CopyToClipboard>
					</span>
				</div>
			)
		},
	},
	{
		accessorKey: 'role',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Role" />
		),
		cell: ({ row }) => {
			const role = config.rolesMap.find(
				(role) => role.value === row.getValue('role'),
			)

			if (!role) {
				return null
			}

			return (
				<div className="flex items-center">
					{role.icon && (
						<role.icon className="mr-2 h-4 w-4 text-muted-foreground" />
					)}
					<span>{role.label}</span>
				</div>
			)
		},
		filterFn: (row, id, value) => {
			return value.includes(row.getValue(id))
		},
	},
	{
		accessorKey: 'active',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Active" />
		),
		cell: ({ row }) => {
			const active = config.activitiesMap.find(
				(active) => active.value === row.getValue('active'),
			)

			if (!active) {
				return null
			}

			return (
				<div className="flex items-center">
					{active.icon && (
						<active.icon className="mr-2 h-4 w-4 text-muted-foreground" />
					)}
					<span>{active.label}</span>
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
