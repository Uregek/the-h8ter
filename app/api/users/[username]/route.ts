import { NextResponse } from 'next/server'
import { z } from 'zod'

import { accessSafeHandler, bodySafeHandler } from '@/app/api/_lib/utils'
import { patchUserSchema } from '@/app/api/users/_lib/schemas'
import { db } from '@/lib/db'

export type InputType = z.infer<typeof patchUserSchema>

export async function PATCH(
	request: Request,
	{ params }: { params: { username: string } },
) {
	return await accessSafeHandler(
		async (currentUser) => {
			return await bodySafeHandler(patchUserSchema, request, async (body) => {
				const data = body.data

				if (params.username === currentUser.username) {
					return new NextResponse('Bad request', { status: 400 })
				}

				const user = await db.profile.update({
					where: {
						username: params.username,
					},
					data,
				})

				return Response.json({ user })
			})
		},
		{ operator: '==', comparedRole: 'ADMIN' },
	)
}

export async function DELETE(
	request: Request,
	{ params }: { params: { username: string } },
) {
	return await accessSafeHandler(
		async (currentUser) => {
			if (params.username === currentUser.username) {
				return new NextResponse('Bad request', { status: 400 })
			}

			await db.profile.delete({
				where: {
					username: params.username,
				},
			})

			return new Response('Deleted', { status: 200 })
		},
		{ operator: '==', comparedRole: 'ADMIN' },
	)
}
