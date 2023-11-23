import { auth } from '@clerk/nextjs'
import { Profile } from '@prisma/client'

import { db } from '@/lib/db'

export async function getUser(): Promise<Profile | null> {
	const { userId } = auth()
	let user = null
	if (userId) {
		user = await db.profile.findUnique({
			where: {
				userId,
			},
		})
	}
	return user
}
