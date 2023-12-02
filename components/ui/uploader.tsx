'use client'

import React, { useCallback, useEffect, useState } from 'react'

import { FileWithPath } from '@uploadthing/react'
import { useDropzone } from '@uploadthing/react/hooks'
import { Loader2, TrashIcon, UploadIcon } from 'lucide-react'
import { capitalize } from 'lodash'
import Image from 'next/image'
import { generateClientDropzoneAccept } from 'uploadthing/client'

import { useUploadThing } from '@/lib/uploadthing'
import { useToast } from '@/lib/use-toast'

import { Skeleton } from './skeleton'

export interface UploaderProps
	extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
	value: string | string[] | null
	onChange: (value?: string | string[] | null) => void
	endpoint: 'plotPreviewImageUploader'
}

const Uploader = React.forwardRef<HTMLDivElement, UploaderProps>(
	({ className, endpoint, value, onChange, ...props }, ref) => {
		const { toast } = useToast()

		const [uploadingInfo, setUploadingInfo] = useState<{
			progress: null | number
			count: null | number
			files: string[]
		}>({
			progress: null,
			count: null,
			files: Array.isArray(value) ? [...value] : value ? [value] : [],
		})

		useEffect(() => {
			setUploadingInfo((prev) => ({
				...prev,
				files: Array.isArray(value) ? [...value] : value ? [value] : [],
			}))
		}, [value])

		const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
			setUploadingInfo((prev) => ({ ...prev, count: acceptedFiles.length }))
			startUpload(acceptedFiles)
		}, [])

		const { startUpload, permittedFileInfo } = useUploadThing(endpoint, {
			onUploadProgress: (progress) => {
				setUploadingInfo((prev) => ({ ...prev, progress }))
			},
			onClientUploadComplete: (res) => {
				onChange(
					Array.isArray(value) ? res?.map((file) => file.url) : res?.[0].url,
				)
				setUploadingInfo((prev) => ({ ...prev, progress: null, count: null }))
			},
			onUploadError: (e) => {
				toast({
					variant: 'destructive',
					title: 'Uh oh! Something went wrong.',
					description: 'There was a problem with your request.',
				})
				setUploadingInfo((prev) => ({ ...prev, progress: null, count: null }))
			},
		})

		const fileTypes = permittedFileInfo?.config
			? Object.keys(permittedFileInfo?.config)
			: []

		const { getRootProps, getInputProps } = useDropzone({
			onDrop,
			accept: fileTypes ? generateClientDropzoneAccept(fileTypes) : undefined,
		})

		return (
			<div
				{...getRootProps()}
				className="flex ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 flex-row gap-1 flex-wrap relative p-4 border border-dashed rounded-md cursor-pointer"
				ref={ref}
				{...props}
			>
				<span className="absolute bg-background -top-2 left-2 px-2 justify-center text-xs flex flex-row gap-1 items-center">
					Upload zone
					{uploadingInfo.progress !== null && (
						<>
							<Loader2 className="animate-spin w-[15px] h-[15px]" />
							<span className="text-xs text-muted-foreground">
								{uploadingInfo.progress}%
							</span>
						</>
					)}
				</span>

				<input {...getInputProps()} />

				{Array.isArray(value) ? (
					value.map((url) => (
						<div key={url} className="relative w-[50px] h-[50px] rounded-md">
							<button
								onClick={(e) => {
									e.stopPropagation()
									onChange(value.filter((url) => url !== url))
								}}
								className="absolute top-0 right-0 z-10 p-1 bg-destructive rounded-full cursor-pointer ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
								type="button"
							>
								<TrashIcon />
							</button>
							<Image className="rounded-md" fill src={url} alt="wdd" />
						</div>
					))
				) : value?.length ? (
					<div className="relative w-[100px] h-[100px] rounded-md">
						<button
							onClick={(e) => {
								e.stopPropagation()
								onChange(null)
							}}
							className="absolute -top-[5px] -right-[5px] z-10 p-1 bg-destructive rounded-full cursor-pointer ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
							type="button"
						>
							<TrashIcon className="w-4 h-4" />
						</button>
						<Image
							className="rounded-md"
							fill
							objectFit="cover"
							src={value}
							alt="wdd"
						/>
					</div>
				) : null}

				{!value && uploadingInfo.progress === null && (
					<div className="grow flex flex-col gap-1 justify-center items-center">
						<UploadIcon />
						<span>Choose files or drag and drop</span>
						{permittedFileInfo &&
							permittedFileInfo.config &&
							fileTypes.length && (
								<span className="text-sm text-muted-foreground">
									{`Accepted: ${fileTypes.map(
										(type) =>
											`${capitalize(type)} (${
												//@ts-ignore
												permittedFileInfo.config[type].maxFileSize //@ts-ignore
											}) x${permittedFileInfo.config[type].maxFileCount}`,
									)}`}
								</span>
							)}
					</div>
				)}

				{uploadingInfo.progress !== null && (
					<>
						{[...Array(uploadingInfo.count)].map((el, index) => (
							<Skeleton
								key={index}
								className="w-[100px] h-[100px] rounded-md"
							/>
						))}
					</>
				)}
			</div>
		)
	},
)

Uploader.displayName = 'Uploader'

export { Uploader }
