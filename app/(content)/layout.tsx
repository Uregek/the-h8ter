import { ReactNode } from 'react'

export default function ContentLayout({ children }: { children: ReactNode }) {
	return <section className="grow relative w-full mx-auto">{children}</section>
}
