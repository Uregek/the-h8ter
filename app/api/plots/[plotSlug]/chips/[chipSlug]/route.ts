import { Prisma } from '@prisma/client'
import { NextResponse } from 'next/server'
import { z } from 'zod'

import { accessSafeHandler, bodySafeHandler } from '@/app/api/_lib/utils'
import { patchChipSchema } from '@/app/api/plots/[plotSlug]/chips/_lib/schemas'
import { db } from '@/lib/db'

export type InputType = z.infer<typeof patchChipSchema>

export async function PATCH(
	request: Request,
	{ params }: { params: { plotSlug: string; chipSlug: string } },
) {
	return await accessSafeHandler(
		async (currentUser) => {
			return await bodySafeHandler(patchChipSchema, request, async (body) => {
				const data = body.data

				try {
					const plot = await db.chip.update({
						where: {
							uniqueSlugWithinPlot: {
								plotSlug: params.plotSlug,
								slug: params.chipSlug,
							},
						},
						data,
					})

					return Response.json({ plot })
				} catch (e) {
					if (e instanceof Prisma.PrismaClientKnownRequestError) {
						if (e.code === 'P2002') {
							const errors: z.typeToFlattenedError<
								InputType,
								string
							>['fieldErrors'] = {
								slug: ['Chip with slug already exists in Plot'],
							}
							return NextResponse.json({ errors }, { status: 400 })
						}
					}
					throw e
				}
			})
		},
		{ operator: '==', comparedRole: 'ADMIN' },
	)
}

export async function DELETE(
	request: Request,
	{ params }: { params: { plotSlug: string; chipSlug: string } },
) {
	return await accessSafeHandler(
		async (currentUser) => {
			await db.chip.delete({
				where: {
					uniqueSlugWithinPlot: {
						plotSlug: params.plotSlug,
						slug: params.chipSlug,
					},
				},
			})

			return new Response('Deleted', { status: 200 })
		},
		{ operator: '==', comparedRole: 'ADMIN' },
	)
}
