import { z } from 'zod'

export const createPlotSchema = z.object({
	title: z.string().min(1, 'Title is required'),
	previewUrl: z.nullable(z.string()),
	slug: z.string().min(1, 'Slug is required'),
	description: z.nullable(z.string()),
	pronoted: z.optional(z.boolean()),
	visible: z.optional(z.boolean()),
})

export const patchPlotSchema = z
	.object({
		title: z.string().min(1, 'Title is required'),
		previewUrl: z.nullable(z.string()),
		slug: z.string().min(1, 'Slug is required'),
		description: z.nullable(z.string()),
		promoted: z.boolean(),
		visible: z.boolean(),
	})
	.partial()

export const favoritePlotSchema = z.object({
	username: z.string(),
	favorite: z.boolean(),
})
