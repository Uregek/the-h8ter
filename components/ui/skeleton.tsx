import { ReactNode } from 'react'

import { Slot } from '@radix-ui/react-slot'

import { cn } from '@/lib/utils'

function Skeleton({
	children,
	className,
	asChild,
	...props
}: React.HTMLAttributes<HTMLDivElement> & {
	children?: ReactNode
	asChild?: boolean
}) {
	const Comp = asChild ? Slot : 'div'

	return (
		<Comp className={cn('animate-pulse rounded-md bg-muted', className)}>
			<Comp
				className={className}
				style={{ ...props.style, visibility: 'hidden', padding: 0, margin: 0 }}
			>
				{children}
			</Comp>
		</Comp>
	)
}

export { Skeleton }
