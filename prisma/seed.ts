import { db } from '../lib/db'
import { slugify } from '../lib/utils'

import data from './data.json'

async function main() {
	data.map(async ({ title, chips }) => {
		await db.plot.create({
			data: {
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
		})
	})
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
