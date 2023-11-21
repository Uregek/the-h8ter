import { auth } from '@clerk/nextjs'

import { getUsers } from '@/actions/get-users'

import { columns } from './_components/columns'
import { DataTable } from './_components/data-table'

export default async function DashboardPage() {
	const users = await getUsers()
	const { userId } = auth()
	return (
		<div className="max-w-screen-xl w-full flex grow items-center justify-center mx-auto py-[50px]">
			<DataTable data={users} columns={columns} />
		</div>
	)
}
