import { ReactNode } from 'react'

export default function AuthLayout({ children }: { children: ReactNode }) {
	return (
		<section className="grow flex justify-center items-center">
			{children}
		</section>
	)
}
