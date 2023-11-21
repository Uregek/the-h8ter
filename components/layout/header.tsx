import { EnterIcon } from '@radix-ui/react-icons'
import {
	ClerkLoaded,
	ClerkLoading,
	SignedIn,
	SignedOut,
	UserButton,
} from '@clerk/nextjs'
import Link from 'next/link'

import { getPlotsWithChips } from '@/actions/get-plots'
import { Navigation } from '@/components/layout/navigation'
import { Button } from '@/components/ui/button'
import { Search } from '@/components/ui/search'
import { Skeleton } from '@/components/ui/skeleton'
import { ToggleMode } from '@/components/ui/toggle-mode'

import { Plot } from '../ui/plot'

export async function Header() {
	const data = await getPlotsWithChips(true)

	return (
		<header className="w-full sticky bg-background/50 backdrop-blur-sm z-20 top-0">
			<div className="flex p-2 container items-center justify-between w-full mx-auto border-b">
				<Link href="/" className="leading-7">
					<Plot>The H8ter</Plot>
				</Link>
				<Search
					data={data}
					searchOptions={{ keys: ['title'] }}
					type="plots&chips"
				/>
				<Navigation />
				<div className="flex items-center gap-2">
					<div className="flex items-center justify-center w-[40px] h-[40px]">
						<ClerkLoading>
							<Skeleton className="w-[32px] h-[32px] rounded-full" />
						</ClerkLoading>
						<ClerkLoaded>
							<SignedIn>
								<UserButton afterSignOutUrl="/" />
							</SignedIn>
							<SignedOut>
								<Button asChild variant="ghost" size="icon">
									<Link href="/sign-in">
										<EnterIcon />
									</Link>
								</Button>
							</SignedOut>
						</ClerkLoaded>
					</div>
					<ToggleMode />
				</div>
			</div>
		</header>
	)
}
