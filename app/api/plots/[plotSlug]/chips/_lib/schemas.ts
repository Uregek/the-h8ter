import { z } from 'zod'

export const createChipSchema = z.object({
	plotSlug: z.string(),
	title: z.string().min(1, 'Title is required'),
	slug: z.string().min(1, 'Slug is required'),
	description: z.nullable(z.string()),
	visible: z.optional(z.boolean()),
})

export const patchChipSchema = z
	.object({
		title: z.string().min(1, 'Title is required'),
		slug: z.string().min(1, 'Slug is required'),
		description: z.nullable(z.string()),
		visible: z.boolean(),
	})
	.partial()
