import { ReactNode } from 'react'

const Plot = ({ children }: { children: ReactNode }) => (
	<code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-extrabold text-primary">
		{children}
	</code>
)

Plot.displayName = 'Plot'

export { Plot }
