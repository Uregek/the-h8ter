import { Fragment } from 'react'

import Link from 'next/link'

export interface BreadcrumbsProps {
	links: { title: string; href: string }[]
}

const Breadcrumbs = ({ links }: BreadcrumbsProps) => {
	return (
		<div className="flex flex-wrap gap-1">
			<span className="text-muted-foreground">/</span>
			<Link href="/" className="hover:underline">
				Home
			</Link>
			{links.map(({ title, href }) => (
				<Fragment key={href}>
					<span className="text-muted-foreground">/</span>
					<Link href={href} className="hover:underline">
						{title}
					</Link>
				</Fragment>
			))}
		</div>
	)
}
Breadcrumbs.displayName = 'Breadcrumbs'

export { Breadcrumbs }
