import Link from 'next/link'

import {
	Menubar,
	MenubarContent,
	MenubarItem,
	MenubarMenu,
	MenubarSeparator,
	MenubarShortcut,
	MenubarSub,
	MenubarSubContent,
	MenubarSubTrigger,
	MenubarTrigger,
} from '@/components/ui/menubar'
import { getUserRole } from '@/lib/get-user-role'
import { isHaveRoleAccess } from '@/lib/utils'

export async function Navigation() {
	const role = await getUserRole()

	return (
		<Menubar>
			<MenubarMenu>
				<MenubarTrigger>
					Search <MenubarShortcut>⌘T</MenubarShortcut>
				</MenubarTrigger>
				<MenubarContent>
					<MenubarItem>Share</MenubarItem>
					<MenubarSeparator />
					<MenubarItem>Print</MenubarItem>
				</MenubarContent>
			</MenubarMenu>
			<MenubarMenu>
				<MenubarTrigger>Dashboard</MenubarTrigger>
				<MenubarContent>
					{isHaveRoleAccess(role, '>=', 'ADMIN') && (
						<MenubarSub>
							<MenubarSubTrigger>Manage</MenubarSubTrigger>
							<MenubarSubContent>
								<MenubarItem asChild>
									<Link href="/dashboard/users">Users</Link>
								</MenubarItem>
								<MenubarItem asChild>
									<Link href="/dashboard/plots-and-chips">Plots & Chips</Link>
								</MenubarItem>
								<MenubarItem asChild>
									<Link href="/dashboard/schemas">Schemas</Link>
								</MenubarItem>
								<MenubarItem asChild>
									<Link href="/dashboard/lots">Lots</Link>
								</MenubarItem>
							</MenubarSubContent>
							<MenubarSeparator />
						</MenubarSub>
					)}

					<MenubarItem asChild>
						<Link prefetch={false} href="/dashboard">
							Statistics <MenubarShortcut>⌘T</MenubarShortcut>
						</Link>
					</MenubarItem>
					<MenubarItem>New Window</MenubarItem>
					<MenubarSeparator />
					<MenubarItem>Share</MenubarItem>
					<MenubarSeparator />
					<MenubarItem>Print</MenubarItem>
				</MenubarContent>
			</MenubarMenu>
		</Menubar>
	)
}
