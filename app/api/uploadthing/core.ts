import { auth } from '@clerk/nextjs'
import { Role } from '@prisma/client'
import { createUploadthing, type FileRouter } from 'uploadthing/next'

import { db } from '@/lib/db'
import { isHaveRoleAccess } from '@/lib/utils'

const f = createUploadthing()

const handleAuth = async (accessRole: Role = 'ADMIN') => {
	const { userId } = auth()

	if (!userId) {
		throw new Error('You must be logged in to upload something')
	}

	const user = await db.profile.findUnique({
		where: {
			userId,
		},
	})

	if (!user) {
		throw new Error('You must be logged in to upload something')
	}

	if (!isHaveRoleAccess(user.role, '>=', accessRole)) {
		throw new Error('No role access')
	}

	return user
}

export const ourFileRouter = {
	plotPreviewImageUploader: f({
		image: { maxFileSize: '8MB', maxFileCount: 1 },
	})
		.middleware(() => handleAuth())
		.onUploadComplete(() => {}),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
