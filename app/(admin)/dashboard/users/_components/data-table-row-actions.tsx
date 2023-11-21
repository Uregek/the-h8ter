'use client'

import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { useMutation } from '@tanstack/react-query'
import { Row } from '@tanstack/react-table'
import { Loader2 } from 'lucide-react'
import { useAuth } from '@clerk/nextjs'
import { Profile } from '@prisma/client'
import axios from 'axios'
import { useRouter } from 'next/navigation'

import { InputType } from '@/app/api/users/[username]/route'
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
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { config } from '@/lib/config'
import { useToast } from '@/lib/use-toast'

interface DataTableRowActionsProps {
	row: Row<Profile>
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
	const router = useRouter()

	const { userId } = useAuth()

	const { toast } = useToast()
	const onError = () => {
		toast({
			variant: 'destructive',
			title: 'Uh oh! Something went wrong.',
			description: 'There was a problem with your request.',
		})
	}

	const { mutate, isPending: isUpdateProfilePending } = useMutation({
		mutationFn: (data: InputType) => {
			return axios.patch<Profile>(`/api/users/${row.original.username}`, data)
		},
		onSuccess: () => {
			router.refresh()
		},
		onError,
	})

	const { mutate: deleteProfile, isPending: isDeleteProfilePending } =
		useMutation({
			mutationFn: () => {
				return axios.delete(`/api/users/${row.original.username}`)
			},
			onSuccess: () => {
				router.refresh()
			},
			onError,
		})

	if (userId === row.original.userId) {
		return null
	}

	const isPending = isUpdateProfilePending || isDeleteProfilePending

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
					<DropdownMenuSub>
						<DropdownMenuSubTrigger>Role</DropdownMenuSubTrigger>
						<DropdownMenuSubContent>
							<DropdownMenuRadioGroup value={row.original.role}>
								{config.rolesMap.map((role) => (
									<DropdownMenuRadioItem
										onClick={() => mutate({ role: role.value })}
										key={role.value}
										value={role.value}
									>
										{role.label}
									</DropdownMenuRadioItem>
								))}
							</DropdownMenuRadioGroup>
						</DropdownMenuSubContent>
					</DropdownMenuSub>
					<DropdownMenuSub>
						<DropdownMenuSubTrigger>Active</DropdownMenuSubTrigger>
						<DropdownMenuSubContent>
							<DropdownMenuRadioGroup value={row.original.active.toString()}>
								{config.activitiesMap.map((active) => (
									<DropdownMenuRadioItem
										onClick={() => mutate({ active: active.value })}
										key={active.label}
										value={active.value.toString()}
									>
										{active.label}
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
						{
							<span className="font-bold">{` ${row.original.username}\'s `}</span>
						}
						profile and remove your data from our servers.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction asChild>
						<Button variant="destructive" onClick={() => deleteProfile()}>
							Continue
						</Button>
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}
