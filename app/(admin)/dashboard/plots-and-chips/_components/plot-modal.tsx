'use client'

import { useRouter } from 'next/navigation'

import { PlotWithChips } from '@/actions/get-plots'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'

import { PlotForm } from './plot-form'

export function PlotModal({ plot }: { plot: PlotWithChips }) {
	const router = useRouter()

	return (
		<Dialog
			defaultOpen
			onOpenChange={(open) => {
				if (!open) {
					router.back()
				}
			}}
		>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Edit Plot {plot.title}</DialogTitle>
					<DialogDescription>
						Make changes to your profile here. Click save when you are done.
					</DialogDescription>
				</DialogHeader>
				<PlotForm asModal plot={plot} type="edit" />
			</DialogContent>
		</Dialog>
	)
}
