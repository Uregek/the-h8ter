import { Prisma } from '@prisma/client'
import { NextResponse } from 'next/server'
import { z } from 'zod'

import { accessSafeHandler, bodySafeHandler } from '@/app/api/_lib/utils'
import { createChipSchema } from '@/app/api/plots/[plotSlug]/chips/_lib/schemas'
import { db } from '@/lib/db'

export type InputType = z.infer<typeof createChipSchema>

export async function POST(request: Request) {
	return await accessSafeHandler(
		async (currentUser) => {
			return await bodySafeHandler(createChipSchema, request, async (body) => {
				const data = body.data

				try {
					const plot = await db.chip.create({
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

export async function GET(
	request: Request,
	{ params }: { params: { plotSlug: string } },
) {
	return await accessSafeHandler(
		async (currentUser) => {
			const chips = await db.chip.findMany({
				where: {
					plotSlug: params.plotSlug,
				},
				orderBy: { title: 'asc' },
			})

			return Response.json(chips)
		},
		{ operator: '==', comparedRole: 'ADMIN' },
	)
}
