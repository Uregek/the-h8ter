import { ReactNode } from 'react'

export default function ContentLayout({
	children,
	favorites,
}: {
	children: ReactNode
	favorites: ReactNode
}) {
	return (
		<>
			<section className="grow">{favorites}</section>
			<section className="grow  w-full mx-auto">{children}</section>
		</>
	)
}
