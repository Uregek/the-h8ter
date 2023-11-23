import {
	EyeNoneIcon,
	EyeOpenIcon,
	LightningBoltIcon,
	ValueNoneIcon,
} from '@radix-ui/react-icons'
import {
	ActivityIcon,
	BanIcon,
	LucideIcon,
	PackageIcon,
	ShieldCheckIcon,
	SwordIcon,
	UserIcon,
} from 'lucide-react'
import { Role } from '@prisma/client'

export const config = {
	headerHeight: 57,
	rolesWeights: {
		CONSUMER: 0,
		PROVIDER: 1,
		MODERATOR: 2,
		ADMIN: 3,
	} as Record<Role, number>,
	rolesMap: [
		{
			value: 'CONSUMER',
			label: 'Consumer',
			icon: UserIcon,
		},
		{
			value: 'PROVIDER',
			label: 'Provider',
			icon: PackageIcon,
		},
		{
			value: 'MODERATOR',
			label: 'Moderator',
			icon: SwordIcon,
		},
		{
			value: 'ADMIN',
			label: 'Admin',
			icon: ShieldCheckIcon,
		},
	] as { value: Role; label: string; icon: LucideIcon }[],
	activitiesMap: [
		{
			value: true,
			label: 'Active',
			icon: ActivityIcon,
		},
		{
			value: false,
			label: 'Banned',
			icon: BanIcon,
		},
	],
	promotedMap: [
		{
			value: true,
			label: 'Promoted',
			icon: LightningBoltIcon,
		},
		{
			value: false,
			label: 'Unpromoted',
			icon: ValueNoneIcon,
		},
	],
	visibilityMap: [
		{
			value: true,
			label: 'Visible',
			icon: EyeOpenIcon,
		},
		{
			value: false,
			label: 'Hidden',
			icon: EyeNoneIcon,
		},
	],
}
