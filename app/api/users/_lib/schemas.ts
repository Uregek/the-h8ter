import { Role } from '@prisma/client'
import { z } from 'zod'

export const patchUserSchema = z.object({
	active: z.optional(z.boolean()),
	role: z.optional(z.nativeEnum(Role)),
})
