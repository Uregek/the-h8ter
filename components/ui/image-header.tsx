'use client'

import * as React from 'react'

import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const imageHeaderVariants = cva('w-full max-w-screen-lg absolute -z-10', {
	variants: {
		variant: {
			onTop: 'top-0',
			onBottom: 'bottom-0',
		},
		size: {
			default: 'h-[300px] ',
			lg: 'h-[600px]',
		},
	},
	defaultVariants: {
		variant: 'onTop',
		size: 'default',
	},
})

export interface ImageHeaderProps
	extends React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof imageHeaderVariants> {
	imageSrc: string
}

const ImageHeader = React.forwardRef<HTMLDivElement, ImageHeaderProps>(
	({ className, style, imageSrc, variant = 'onTop', size, ...props }, ref) => (
		<div
			className={cn(imageHeaderVariants({ variant, size, className }))}
			style={{
				background: `radial-gradient(50% 100% at 50% ${
					variant === 'onTop' ? '0' : '100%'
				},hsl(var(--background) / 25%) 0,hsl(var(--background)) 100%),center / cover no-repeat url(${imageSrc})`,
				...style,
			}}
			ref={ref}
			{...props}
		/>
	),
)
ImageHeader.displayName = 'ImageHeader'

export { ImageHeader }
