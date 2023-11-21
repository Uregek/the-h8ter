'use client'

import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'

import { Link1Icon } from '@radix-ui/react-icons'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { useRouter } from 'next/navigation'
import { z } from 'zod'

import { Chip } from '@/actions/get-chips'
import {
	createChipSchema,
	patchChipSchema,
} from '@/app/api/plots/[plotSlug]/chips/_lib/schemas'
import { InputType as PatchInputType } from '@/app/api/plots/[plotSlug]/route'
import { InputType as CreateInputType } from '@/app/api/plots/route'
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
import { Checkbox } from '@/components/ui/checkbox'
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Toggle } from '@/components/ui/toggle'
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@/components/ui/tooltip'
import { useToast } from '@/lib/use-toast'
import { slugify } from '@/lib/utils'

interface PlotFormProps {
	plotSlug: string
	chip?: Chip
	type: 'edit' | 'create'
	asModal?: boolean
	handleClose?: () => void
}

export function ChipForm({
	plotSlug,
	chip,
	asModal,
	type,
	handleClose,
}: PlotFormProps) {
	const queryClient = useQueryClient()

	const [linkSlug, setLinkSlug] = useState(false)

	const router = useRouter()

	const { toast } = useToast()
	const onError = () => {
		toast({
			variant: 'destructive',
			title: 'Uh oh! Something went wrong.',
			description: 'There was a problem with your request.',
		})
	}

	const { mutate: createChip, isPending: isCreateChipPending } = useMutation<
		void,
		AxiosError<{
			errors: z.typeToFlattenedError<CreateInputType, string>['fieldErrors']
		}>,
		CreateInputType
	>({
		mutationFn: (data) => {
			return axios.post(`/api/plots/${plotSlug}/chips`, data)
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['chips', plotSlug] })
			handleClose?.()
		},
		onError: (e) => {
			if (e.response?.data.errors.slug) {
				form.setError('slug', { message: e.response.data.errors.slug[0] })
			} else {
				onError()
			}
		},
	})

	const { mutate, isPending: isUpdateChipPending } = useMutation<
		void,
		AxiosError<{
			errors: z.typeToFlattenedError<PatchInputType, string>['fieldErrors']
		}>,
		PatchInputType
	>({
		mutationFn: (data) => {
			return axios.patch(`/api/plots/${plotSlug}/chips/${chip!.slug}`, data)
		},
		onSuccess: () => {
			if (asModal) {
				router.back()
				queryClient.invalidateQueries({ queryKey: ['chips', plotSlug] })
			} else {
				router.push(`/dashboard/plots-and-chips/${plotSlug}`)
			}
		},
		onError: (e) => {
			if (e.response?.data.errors.slug) {
				form.setError('slug', { message: e.response.data.errors.slug[0] })
			} else {
				onError()
			}
		},
	})

	const { mutate: deleteChip, isPending: isDeleteChipPending } = useMutation({
		mutationFn: () => {
			return axios.delete(`/api/plots/${plotSlug}/chips/${chip!.slug}`)
		},
		onSuccess: () => {
			if (asModal) {
				router.back()
				queryClient.invalidateQueries({ queryKey: ['chips', plotSlug] })
			} else {
				router.push(`/dashboard/plots-and-chips/${plotSlug}`)
			}
		},
		onError: () => onError(),
	})

	const form = useForm({
		resolver: zodResolver(
			type === 'create' ? createChipSchema : patchChipSchema,
		),
		defaultValues: useMemo(
			() => ({
				plotSlug,
				title: chip?.title || '',
				slug: chip?.slug || '',
				description: chip?.description || null,
				visible: chip?.visible || false,
			}),
			[chip, plotSlug],
		),
	})

	useEffect(() => {
		if (chip) {
			form.reset({
				plotSlug,
				title: chip.title,
				slug: chip.slug,
				description: chip.description,
				visible: chip.visible,
			})
		}
	}, [chip, form, plotSlug])

	useEffect(() => {
		if (linkSlug) {
			const title = form.getValues('title')
			title && form.setValue('slug', slugify(title))
		}

		const subscription = form.watch((values, { name, type }) => {
			if (name === 'title') {
				linkSlug && form.setValue('slug', slugify(values.title!))
			}
		})
		return () => subscription.unsubscribe()
	}, [form, form.watch, linkSlug])

	const { isDirty } = form.formState

	return (
		<AlertDialog>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit((values) => {
						if (type === 'create') {
							createChip(values)
						} else {
							mutate(values)
						}
					})}
					className="space-y-8 w-full"
				>
					<FormField
						control={form.control}
						name="title"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Title</FormLabel>
								<FormControl>
									<Input placeholder="Title" {...field} />
								</FormControl>
								<FormDescription>
									This is your Chip display name.
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="description"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Description</FormLabel>
								<FormControl>
									<Textarea
										placeholder="Some description"
										{...field}
										value={field.value || undefined}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="slug"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Slug</FormLabel>
								<FormControl>
									<div className="flex flex-row gap-2">
										<Input placeholder="Slug" {...field} />
										<Tooltip>
											<TooltipTrigger type="button">
												<Toggle
													onPressedChange={setLinkSlug}
													defaultPressed={linkSlug}
													pressed={linkSlug}
													variant="outline"
													aria-label="Toggle italic"
												>
													<Link1Icon className="h-4 w-4" />
												</Toggle>
											</TooltipTrigger>
											<TooltipContent>
												<p>Link with Title</p>
											</TooltipContent>
										</Tooltip>
									</div>
								</FormControl>
								<FormDescription>
									The unique identifying part of a web address.
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="visible"
						render={({ field }) => (
							<FormItem className="flex flex-row items-start space-x-3 space-y-0">
								<FormControl>
									<Checkbox
										checked={field.value}
										onCheckedChange={field.onChange}
									/>
								</FormControl>
								<div className="space-y-1 leading-none">
									<FormLabel>Visible</FormLabel>
									<FormDescription>
										You can manage should Chip be visible in Plot or not.
									</FormDescription>
								</div>
							</FormItem>
						)}
					/>

					<div className="flex flex-row justify-end gap-2">
						<Button
							type="button"
							variant="secondary"
							disabled={
								!isDirty ||
								isCreateChipPending ||
								isUpdateChipPending ||
								isDeleteChipPending
							}
							onClick={() => form.reset()}
						>
							Reset
						</Button>

						<Button
							disabled={
								!isDirty ||
								isCreateChipPending ||
								isUpdateChipPending ||
								isDeleteChipPending
							}
							type="submit"
							className="flex-1"
						>
							{isCreateChipPending || isUpdateChipPending ? (
								<Loader2 className="animate-spin w-4 h-4" />
							) : type === 'create' ? (
								'Create'
							) : (
								'Update'
							)}
						</Button>
					</div>

					{type !== 'create' && (
						<div className="relative p-3 border border-destructive rounded-md">
							<span className="absolute bg-background -top-2 left-2 px-2 justify-center text-xs text-destructive">
								Danger zone
							</span>

							<AlertDialogTrigger asChild>
								<Button
									type="button"
									variant="destructive"
									disabled={
										isCreateChipPending ||
										isUpdateChipPending ||
										isDeleteChipPending
									}
									className="w-full"
								>
									{isDeleteChipPending ? (
										<Loader2 className="animate-spin w-4 h-4" />
									) : (
										'Delete'
									)}
								</Button>
							</AlertDialogTrigger>
						</div>
					)}
				</form>
			</Form>

			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
					<AlertDialogDescription>
						This action cannot be undone. This will permanently delete
						{<span className="font-bold">{` ${chip?.title} `}</span>}
						Chip and remove your data from our servers.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction asChild>
						<Button variant="destructive" onClick={() => deleteChip()}>
							Continue
						</Button>
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}
