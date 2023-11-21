import { ReactNode } from 'react'

export default function PlotsLayout({
	children,
	plotModal,
	chipModal,
}: {
	children: ReactNode
	plotModal: ReactNode
	chipModal: ReactNode
}) {
	return (
		<>
			{children}
			{plotModal}
			{chipModal}
		</>
	)
}
