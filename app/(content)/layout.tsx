import { ReactNode } from 'react'

export default function ContentLayout({ children }: { children: ReactNode }) {
	return <section className="grow max-w-screen-xl mx-auto">{children}</section>
}
