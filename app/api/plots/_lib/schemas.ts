import { z } from 'zod'

export const createPlotSchema = z.object({
	title: z.string().min(1, 'Title is required'),
	slug: z.string().min(1, 'Slug is required'),
	description: z.nullable(z.string()),
	visible: z.optional(z.boolean()),
})

export const patchPlotSchema = z
	.object({
		title: z.string().min(1, 'Title is required'),
		slug: z.string().min(1, 'Slug is required'),
		description: z.nullable(z.string()),
		visible: z.boolean(),
	})
	.partial()

export const favoritePlotSchema = z.object({
	username: z.string(),
	favorite: z.boolean(),
})
