'use client'

import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'

import { Link1Icon, Pencil1Icon, PlusCircledIcon } from '@radix-ui/react-icons'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { z } from 'zod'

import { ChipsByPlot } from '@/actions/get-chips'
import { PlotWithChips } from '@/actions/get-plots'
import { createPlotSchema, patchPlotSchema } from '@/app/api/plots/_lib/schemas'
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
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
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
import { Skeleton } from '@/components/ui/skeleton'
import { Textarea } from '@/components/ui/textarea'
import { Toggle } from '@/components/ui/toggle'
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@/components/ui/tooltip'
import { useToast } from '@/lib/use-toast'
import { cn, slugify } from '@/lib/utils'

import { ChipForm } from './chip-form'

interface PlotFormProps {
	plot?: PlotWithChips
	type: 'edit' | 'create'
	asModal?: boolean
	handleClose?: () => void
}

export function PlotForm({ plot, asModal, type, handleClose }: PlotFormProps) {
	const [isCreateChipModalOpened, setIsCreateChipModalOpened] = useState(false)
	const [linkSlug, setLinkSlug] = useState(false)

	const router = useRouter()

	const { data, isLoading } = useQuery({
		queryKey: ['chips', plot?.slug],
		queryFn: () => {
			return axios
				.get<ChipsByPlot>(`/api/plots/${plot?.slug}/chips`)
				.then((response) => response.data)
		},
		enabled: type !== 'create',
	})

	const { toast } = useToast()
	const onError = () => {
		toast({
			variant: 'destructive',
			title: 'Uh oh! Something went wrong.',
			description: 'There was a problem with your request.',
		})
	}

	const { mutate: createPlot, isPending: isCreatePlotPending } = useMutation<
		void,
		AxiosError<{
			errors: z.typeToFlattenedError<CreateInputType, string>['fieldErrors']
		}>,
		CreateInputType
	>({
		mutationFn: (data) => {
			return axios.post(`/api/plots/`, data)
		},
		onSuccess: () => {
			handleClose?.()
			router.refresh()
		},
		onError: (e) => {
			if (e.response?.data.errors.slug) {
				form.setError('slug', { message: e.response.data.errors.slug[0] })
			} else {
				onError()
			}
		},
	})

	const { mutate, isPending: isUpdatePlotPending } = useMutation<
		void,
		AxiosError<{
			errors: z.typeToFlattenedError<PatchInputType, string>['fieldErrors']
		}>,
		PatchInputType
	>({
		mutationFn: (data) => {
			return axios.patch(`/api/plots/${plot!.slug}`, data)
		},
		onSuccess: () => {
			if (asModal) {
				router.back()
				router.refresh()
			} else {
				router.push(`/dashboard/plots-and-chips`)
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

	const { mutate: deletePlot, isPending: isDeletePlotPending } = useMutation({
		mutationFn: () => {
			return axios.delete(`/api/plots/${plot!.slug}`)
		},
		onSuccess: () => {
			router.push(`/dashboard/plots-and-chips`)
		},
		onError: () => onError(),
	})

	const form = useForm({
		resolver: zodResolver(
			type === 'create' ? createPlotSchema : patchPlotSchema,
		),
		defaultValues: useMemo(
			() => ({
				title: plot?.title || '',
				slug: plot?.slug || '',
				description: plot?.description || null,
				promoted: plot?.promoted || false,
				visible: plot?.visible || false,
			}),
			[plot],
		),
	})

	useEffect(() => {
		if (plot) {
			form.reset({
				title: plot.title,
				slug: plot.slug,
				description: plot.description,
				promoted: plot.promoted,
				visible: plot.visible,
			})
		}
	}, [plot, form])

	useEffect(() => {
		if (linkSlug) {
			const title = form.getValues('title')
			title && form.setValue('slug', slugify(title))
		}

		const subscription = form.watch((values, { name }) => {
			if (name === 'title') {
				linkSlug && form.setValue('slug', slugify(values.title!))
			}
		})
		return () => subscription.unsubscribe()
	}, [form, form.watch, linkSlug])

	const { isDirty } = form.formState

	return (
		<AlertDialog>
			<Dialog
				open={isCreateChipModalOpened}
				onOpenChange={setIsCreateChipModalOpened}
			>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit((values) => {
							if (type === 'create') {
								createPlot(values)
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
										This is your Plot display name.
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
														pressed={linkSlug}
														defaultPressed={linkSlug}
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
							name="promoted"
							render={({ field }) => (
								<FormItem className="flex flex-row items-start space-x-3 space-y-0">
									<FormControl>
										<Checkbox
											checked={field.value}
											onCheckedChange={field.onChange}
										/>
									</FormControl>
									<div className="space-y-1 leading-none">
										<FormLabel>Promoted</FormLabel>
										<FormDescription>
											You can manage should Plot be of the top list or not.
										</FormDescription>
									</div>
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
											You can manage should Plot be visible or not.
										</FormDescription>
									</div>
								</FormItem>
							)}
						/>

						<div className="flex flex-row gap-2">
							<Button
								type="button"
								variant="secondary"
								disabled={
									!isDirty ||
									isCreatePlotPending ||
									isUpdatePlotPending ||
									isDeletePlotPending
								}
								onClick={() => form.reset()}
								className="flex"
							>
								Reset
							</Button>

							<Button
								disabled={
									!isDirty ||
									isCreatePlotPending ||
									isUpdatePlotPending ||
									isDeletePlotPending
								}
								type="submit"
								className="flex-1"
							>
								{isCreatePlotPending || isUpdatePlotPending ? (
									<Loader2 className="animate-spin w-4 h-4" />
								) : type === 'create' ? (
									'Create'
								) : (
									'Update'
								)}
							</Button>
						</div>

						{type !== 'create' && (
							<>
								<div className="flex flex-row flex-wrap px-2 py-3 relative border rounded-md gap-2">
									<span className="absolute bg-background -top-2 left-2 px-2 justify-center text-xs text-primary">
										Chips
									</span>
									{isLoading &&
										plot?.chips.map(({ id, title }) => (
											<Skeleton
												key={id}
												className="flex-row gap-1 inline-flex items-center rounded-full border px-2.5 py-0.5 text-sm font-semibold"
											>
												<span style={{ visibility: 'hidden' }}>{title}</span>
												<Pencil1Icon style={{ visibility: 'hidden' }} />
											</Skeleton>
										))}

									{data?.map(({ id, title, slug, visible }) => (
										<Badge
											key={id}
											variant="outline"
											className={cn(
												'flex flex-row items-center gap-1 text-sm',
												!visible && 'border-dashed',
											)}
										>
											<Tooltip>
												<TooltipTrigger>{title}</TooltipTrigger>
												<TooltipContent>
													<p>{slug}</p>
												</TooltipContent>
											</Tooltip>

											<Link
												href={`/dashboard/plots-and-chips/${
													plot!.slug
												}/${slug}`}
											>
												<Pencil1Icon />
											</Link>
										</Badge>
									))}

									{!isLoading && (
										<DialogTrigger asChild>
											<Badge asChild className="text-sm">
												<button
													type="button"
													className="flex flex-row items-center gap-1 text-sm"
												>
													<PlusCircledIcon />
													Create Chip
												</button>
											</Badge>
										</DialogTrigger>
									)}
								</div>

								<div className="relative p-3 border border-destructive rounded-md">
									<span className="absolute bg-background -top-2 left-2 px-2 justify-center text-xs text-destructive">
										Danger zone
									</span>

									<AlertDialogTrigger asChild>
										<Button
											type="button"
											variant="destructive"
											disabled={
												isCreatePlotPending ||
												isUpdatePlotPending ||
												isDeletePlotPending
											}
											className="w-full"
										>
											{isDeletePlotPending ? (
												<Loader2 className="animate-spin w-4 h-4" />
											) : (
												'Delete'
											)}
										</Button>
									</AlertDialogTrigger>
								</div>
							</>
						)}
					</form>
				</Form>

				<DialogContent>
					<DialogHeader>
						<DialogTitle>Create Chip</DialogTitle>
						<DialogDescription>
							Make changes to your profile here. Click save when you are done.
						</DialogDescription>
					</DialogHeader>
					<ChipForm
						asModal
						plotSlug={plot?.slug as string}
						type="create"
						handleClose={() => {
							setIsCreateChipModalOpened(false)
						}}
					/>
				</DialogContent>
			</Dialog>

			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
					<AlertDialogDescription>
						This action cannot be undone. This will permanently delete
						{<span className="font-bold">{` ${plot?.title} `}</span>}
						Plot and remove your data from our servers.
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
