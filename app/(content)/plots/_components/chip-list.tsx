import { Chip } from '@prisma/client'
import Link from 'next/link'

import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { cn } from '@/lib/utils'

export function ChipList({
	plotSlug,
	chipSlug,
	chips,
}: {
	plotSlug: string
	chipSlug?: string
	chips: Chip[]
}) {
	return (
		<div className="w-full max-w-screen-lg">
			<div className="flex flex-row flex-wrap relative gap-3">
				<p className="absolute uppercase bottom-full mb-[15px] text-xs text-muted-foreground font-normal">
					Chips:
				</p>
				{chips.map(({ title, description, slug, id }) => (
					<Card className={cn(chipSlug === slug && 'bg-accent')} key={id}>
						<Link href={`/plots/${plotSlug}/${slug}`}>
							<CardHeader>
								<CardTitle>{title}</CardTitle>
								<CardDescription>{description}</CardDescription>
							</CardHeader>
						</Link>
					</Card>
				))}
			</div>
		</div>
	)
}
