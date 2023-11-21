import { ReactNode } from 'react'

import { notFound } from 'next/navigation'

import { getUserRole } from '@/lib/get-user-role'
import { isHaveRoleAccess } from '@/lib/utils'

export default async function DashboardLayout({
	children,
}: {
	children: ReactNode
}) {
	const role = await getUserRole()

	if (!isHaveRoleAccess(role, '==', 'ADMIN')) {
		notFound()
	}

	return <section className="flex w-full">{children}</section>
}
