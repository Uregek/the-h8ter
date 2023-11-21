'use client'

import { useState } from 'react'

import { useRouter } from 'next/navigation'

import { Chip } from '@/actions/get-chips'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'

import { ChipForm } from './chip-form'

export function ChipModal({
	plotSlug,
	chip,
}: {
	plotSlug: string
	chip: Chip
}) {
	const [isOpen, setIsOpen] = useState(true)
	const router = useRouter()

	return (
		<Dialog
			defaultOpen
			open={isOpen}
			onOpenChange={(open) => {
				setIsOpen(open)
				if (!open) {
					router.back()
				}
			}}
		>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Edit Chip {chip.title}</DialogTitle>
					<DialogDescription>
						Make changes to your profile here. Click save when you are done.
					</DialogDescription>
				</DialogHeader>
				<ChipForm asModal plotSlug={plotSlug} chip={chip} type="edit" />
			</DialogContent>
		</Dialog>
	)
}
