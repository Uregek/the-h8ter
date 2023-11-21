import { Role } from '@prisma/client'
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

import { config } from './config'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function slugify(string: string) {
	if (!string) return ''

	// make lower case and trim
	var slug = string.toLowerCase().trim()

	// remove accents from charaters
	slug = slug.normalize('NFD').replace(/[\u0300-\u036f]/g, '')

	// replace invalid chars with spaces
	slug = slug.replace(/[^a-z0-9\s-]/g, ' ').trim()

	// replace multiple spaces or hyphens with a single hyphen
	slug = slug.replace(/[\s-]+/g, '-')

	return slug
}

export function isHaveRoleAccess(
	role: Role,
	rights: '>' | '>=' | '<' | '<=' | '==',
	comparedRole: Role,
) {
	return Boolean(
		eval(
			`${config.rolesWeights[role]} ${rights} ${config.rolesWeights[comparedRole]}`,
		),
	)
}
