'use client'

import { Button } from '@/components/ui/button'
import { lorem } from '@/lib/utils'

import { SchemaForm, SchemaFormProps } from './_components/schema-form'

export default function SchemasPage() {
	const fields: SchemaFormProps['fields'] = {
		text: {
			type: 'text',
			label: lorem.generateWords(2),
			placeholder: 'Text placeholder',
			defaultValue: 'Text default value',
			description: lorem.generateWords(25),
			required: true,
			min: 10,
			max: 20,
		},
		textarea: {
			type: 'textarea',
			label: lorem.generateWords(2),
			placeholder: 'Textarea placeholder',
			defaultValue: 'Textarea default value',
			description: lorem.generateWords(25),
			required: true,
			min: 10,
			max: 25,
		},
		number: {
			type: 'number',
			label: lorem.generateWords(2),
			placeholder: '10000$',
			defaultValue: 20,
			description: lorem.generateWords(25),
			required: true,
			min: 10,
			max: 20,
		},
		select: {
			type: 'select',
			label: lorem.generateWords(2),
			defaultValue: '1',
			description: lorem.generateWords(25),
			required: true,
			values: [
				{ value: '1', label: 'Select 1' },
				{ value: '2', label: 'Select 2' },
			],
		},
		radio: {
			type: 'radio',
			label: lorem.generateWords(2),
			defaultValue: '1',
			description: lorem.generateWords(25),
			required: true,
			values: [
				{ value: '1', label: 'Radio 1' },
				{ value: '2', label: 'Radio 2' },
			],
		},
		checkbox: {
			type: 'checkbox',
			label: lorem.generateWords(2),
			defaultValue: ['1', '2'],
			description: lorem.generateWords(25),
			required: true,
			values: [
				{ value: '1', label: 'Checkbox 1' },
				{ value: '2', label: 'Checkbox 2' },
				{ value: '3', label: 'Checkbox 3' },
				{ value: '4', label: 'Checkbox 4' },
			],
		},
	}

	const onSubmit: SchemaFormProps['onSubmit'] = (values) => {
		console.log(
			'values',
			Object.entries(values).reduce<
				Record<string, { type: string; value: string | number }>
			>((acc, [key, value]) => {
				acc[key] = { type: fields[key].type, value }
				return acc
			}, {}),
		)
	}
	return (
		<div className="max-w-[300px] mx-auto my-[50px]">
			<SchemaForm fields={fields} onSubmit={onSubmit}>
				<Button type="submit">Submit</Button>
			</SchemaForm>
		</div>
	)
}
