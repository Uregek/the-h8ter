'use client'

import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { useMutation } from '@tanstack/react-query'
import { Row } from '@tanstack/react-table'
import { Loader2 } from 'lucide-react'
import { useAuth } from '@clerk/nextjs'
import axios from 'axios'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { Plot } from '@/actions/get-plots'
import { InputType } from '@/app/api/plots/[plotSlug]/route'
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { config } from '@/lib/config'
import { useToast } from '@/lib/use-toast'

interface DataTableRowActionsProps {
	row: Row<Plot>
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
	const router = useRouter()

	const { toast } = useToast()
	const onError = () => {
		toast({
			variant: 'destructive',
			title: 'Uh oh! Something went wrong.',
			description: 'There was a problem with your request.',
		})
	}

	const { mutate, isPending: isUpdatePlotPending } = useMutation({
		mutationFn: (data: InputType) => {
			return axios.patch(`/api/plots/${row.original.slug}`, data)
		},
		onSuccess: () => {
			router.refresh()
		},
		onError,
	})

	const { mutate: deletePlot, isPending: isDeletePlotPending } = useMutation({
		mutationFn: () => {
			return axios.delete(`/api/plots/${row.original.slug}`)
		},
		onSuccess: () => {
			router.refresh()
		},
		onError,
	})

	const isPending = isUpdatePlotPending || isDeletePlotPending

	return (
		<AlertDialog>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						variant="ghost"
						className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
						disabled={isPending}
					>
						{isPending ? (
							<Loader2 className="animate-spin w-4 h-4" />
						) : (
							<DotsHorizontalIcon className="h-4 w-4" />
						)}
						<span className="sr-only">Open menu</span>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end" className="w-[160px]">
					<DropdownMenuItem asChild>
						<Link href={`/dashboard/plots-and-chips/${row.original.slug}`}>
							Edit
						</Link>
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuSub>
						<DropdownMenuSubTrigger>Visibiliy</DropdownMenuSubTrigger>
						<DropdownMenuSubContent>
							<DropdownMenuRadioGroup value={row.original.visible.toString()}>
								{config.visibilityMap.map((visible) => (
									<DropdownMenuRadioItem
										onClick={() => mutate({ visible: visible.value })}
										key={visible.label}
										value={visible.value.toString()}
									>
										{visible.label}
									</DropdownMenuRadioItem>
								))}
							</DropdownMenuRadioGroup>
						</DropdownMenuSubContent>
					</DropdownMenuSub>
					<div className="relative my-1">
						<div className="absolute inset-0 flex items-center">
							<span className="w-full border-t border-destructive" />
						</div>
						<div className="relative flex justify-center text-xs">
							<span className="bg-popover px-2 text-destructive">
								Danger zone
							</span>
						</div>
					</div>
					<DropdownMenuItem className="bg-destructive !text-destructive-foreground hover:!bg-destructive/90">
						<AlertDialogTrigger className="w-full">Delete</AlertDialogTrigger>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
					<AlertDialogDescription>
						This action cannot be undone. This will permanently delete
						{<span className="font-bold">{` ${row.original.title} `}</span>}
						plot and remove your data from our servers.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction asChild>
						<Button variant="destructive" onClick={() => deletePlot()}>
							Continue
						</Button>
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}
