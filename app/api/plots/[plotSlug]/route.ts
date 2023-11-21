import { Prisma } from '@prisma/client'
import { NextResponse } from 'next/server'
import { z } from 'zod'

import { accessSafeHandler, bodySafeHandler } from '@/app/api/_lib/utils'
import { patchPlotSchema } from '@/app/api/plots/_lib/schemas'
import { db } from '@/lib/db'

export type InputType = z.infer<typeof patchPlotSchema>

export async function PATCH(
	request: Request,
	{ params }: { params: { plotSlug: string } },
) {
	return await accessSafeHandler(
		async (currentUser) => {
			return await bodySafeHandler(patchPlotSchema, request, async (body) => {
				const data = body.data

				try {
					const plot = await db.plot.update({
						where: {
							slug: params.plotSlug,
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
							>['fieldErrors'] = { slug: ['Plot with slug already exists'] }
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
	{ params }: { params: { plotSlug: string } },
) {
	return await accessSafeHandler(
		async (currentUser) => {
			await db.plot.delete({
				where: {
					slug: params.plotSlug,
				},
			})

			return new Response('Deleted', { status: 200 })
		},
		{ operator: '==', comparedRole: 'ADMIN' },
	)
}
