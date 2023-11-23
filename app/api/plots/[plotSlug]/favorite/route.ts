import { z } from 'zod'

import { bodySafeHandler } from '@/app/api/_lib/utils'
import { db } from '@/lib/db'

import { favoritePlotSchema } from '../../_lib/schemas'

export type InputType = z.infer<typeof favoritePlotSchema>

export async function PATCH(
	request: Request,
	{ params }: { params: { plotSlug: string } },
) {
	return await bodySafeHandler(favoritePlotSchema, request, async (body) => {
		const { username, favorite } = body.data

		if (favorite) {
			await db.profile.update({
				where: {
					username,
				},

				data: {
					favoritedPlots: {
						connect: { slug: params.plotSlug },
					},
				},
			})
		} else {
			await db.profile.update({
				where: {
					username,
				},

				data: {
					favoritedPlots: {
						disconnect: { slug: params.plotSlug },
					},
				},
			})
		}

		return Response.json({})
	})
}
