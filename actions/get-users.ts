import { cache } from 'react'

import { db } from '@/lib/db'

const getUsers = cache(async () => {
	const data = await db.profile.findMany({
		orderBy: { createdAt: 'desc' },
	})
	return data
})

type Profiles = NonNullable<Awaited<ReturnType<typeof getUsers>>>

export { getUsers }
export type { Profiles }
