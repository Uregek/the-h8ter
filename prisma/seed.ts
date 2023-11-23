import { db } from '../lib/db'
import { slugify } from '../lib/utils'

import data from './data.json'

async function main() {
	// await db.profile.update({
	// 	where: {
	// 		username: 'uregek',
	// 	},
	// 	data: {
	// 		role: 'ADMIN',
	// 	},
	// })
	for (const { title, chips } of data) {
		await db.plot.upsert({
			where: {
				slug: slugify(title),
			},
			create: {
				title,
				slug: slugify(title),
				chips: {
					createMany: {
						data: chips.map((chip) => ({
							title: chip,
							slug: slugify(chip),
						})),
					},
				},
			},
			update: {
				title,
				slug: slugify(title),
				chips: {
					createMany: {
						data: chips.map((chip) => ({
							title: chip,
							slug: slugify(chip),
						})),
						skipDuplicates: true,
					},
				},
			},
		})
	}
}
main()
	.then(async () => {
		await db.$disconnect()
	})
	.catch(async (e) => {
		console.error(e)
		await db.$disconnect()
		process.exit(1)
	})
