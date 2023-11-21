import { notFound } from 'next/navigation'

import { getPlots, Plot, Plots } from '@/actions/get-plots'
import { getUserRole } from '@/lib/get-user-role'
import { isHaveRoleAccess } from '@/lib/utils'

import { columns } from './_components/columns'
import { DataTable } from './_components/data-table'

function extractFirstLetter(plots: Plots) {
	const withLetter: (Plot & { letter: string })[] = []
	const letterSet = new Set<string>()

	plots.forEach((plot) => {
		const letter = plot.title.charAt(0).toUpperCase()
		letterSet.add(letter)
		withLetter.push({ ...plot, letter })
	})

	const letters: { value: string; label: string }[] = []
	letterSet.forEach((value) => {
		letters.push({ value, label: value })
	})

	return [withLetter, letters] as const
}

export default async function DashboardPage() {
	const plots = await getPlots()

	const role = await getUserRole()

	if (!isHaveRoleAccess(role, '==', 'ADMIN')) {
		notFound()
	}

	const [plotsWithLetter, letters] = extractFirstLetter(plots)

	return (
		<div className="max-w-screen-xl w-full flex grow items-center justify-center mx-auto py-[50px]">
			<DataTable data={plotsWithLetter} letters={letters} columns={columns} />
		</div>
	)
}
