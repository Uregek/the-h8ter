'use client'

import { DrawingPinFilledIcon, DrawingPinIcon } from '@radix-ui/react-icons'
import { useMutation } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import axios from 'axios'
import { useRouter } from 'next/navigation'

import { InputType } from '@/app/api/plots/[plotSlug]/favorite/route'
import { useToast } from '@/lib/use-toast'
import { cn } from '@/lib/utils'

export function FavoritePlot({
	plotSlug,
	username,
	favorited,
	promoted,
}: {
	plotSlug: string
	username: string
	favorited: boolean
	promoted?: boolean
}) {
	const router = useRouter()

	const { toast } = useToast()

	const { mutate, isPending } = useMutation<void, void, InputType>({
		mutationFn: (data) => {
			return axios.patch(`/api/plots/${plotSlug}/favorite`, data)
		},
		onSuccess: () => {
			router.refresh()
		},
		onError: () => {
			toast({
				variant: 'destructive',
				title: 'Uh oh! Something went wrong.',
				description: 'There was a problem with your request.',
			})
		},
	})

	const handleFavoriteClick = () => {
		mutate({ username, favorite: !favorited })
	}

	if (isPending) {
		return <Loader2 className="animate-spin w-[15px] h-[15px]" />
	}

	if (!favorited) {
		return (
			<button onClick={handleFavoriteClick}>
				<DrawingPinIcon
					className={cn(
						'hover:text-accent-foreground',
						promoted && 'hover:text-primary-foreground',
					)}
				/>
			</button>
		)
	}

	return (
		<button onClick={handleFavoriteClick}>
			<DrawingPinFilledIcon
				className={cn(
					'hover:text-accent-foreground',
					promoted && 'hover:text-primary-foreground',
				)}
			/>
		</button>
	)
}
