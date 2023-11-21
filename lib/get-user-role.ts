import { auth } from '@clerk/nextjs'
import { Role } from '@prisma/client'

import { db } from '@/lib/db'

export async function getUserRole(): Promise<Role> {
	let role: Role = 'CONSUMER'
	const { userId } = auth()
	if (userId) {
		const user = await db.profile.findUnique({
			where: {
				userId,
			},
		})
		if (user) role = user.role
	}
	return role
}
