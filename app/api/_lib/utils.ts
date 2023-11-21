import { auth } from '@clerk/nextjs'
import { Profile, Role } from '@prisma/client'
import { NextResponse } from 'next/server'
import { z } from 'zod'

import { config } from '@/lib/config'
import { db } from '@/lib/db'

export async function bodySafeHandler<T>(
	schema: z.Schema<T>,
	request: Request,
	handler: (body: z.SafeParseSuccess<T>) => Promise<NextResponse | Response>,
) {
	const body = await request.json()

	const validationResult = schema.safeParse(body)
	if (!validationResult.success) {
		return NextResponse.json(
			{ errors: validationResult.error.flatten().fieldErrors },
			{ status: 400 },
		)
	}

	return await handler(validationResult)
}

export async function accessSafeHandler(
	handler: (user: Profile) => Promise<NextResponse | Response>,
	accessPermissions?: {
		operator: '>' | '>=' | '<' | '<=' | '=='
		comparedRole: Role
	},
) {
	const { userId } = auth()

	if (!userId) {
		return new NextResponse('Unauthenticated', { status: 403 })
	}

	const user = await db.profile.findUnique({
		where: {
			userId,
		},
	})

	if (!user) {
		return new NextResponse('Unauthenticated', { status: 403 })
	}

	if (accessPermissions) {
		const isHaveRoleAccess = Boolean(
			eval(
				`${config.rolesWeights[user.role]} ${accessPermissions.operator} ${
					config.rolesWeights[accessPermissions.comparedRole]
				}`,
			),
		)

		if (!isHaveRoleAccess) {
			return new NextResponse('Forbidden', { status: 403 })
		}
	}

	return await handler(user)
}
