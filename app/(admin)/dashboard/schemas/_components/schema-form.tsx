'use client'

import { ReactNode } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { Checkbox } from '@/components/ui/checkbox'
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'

type FieldSchema = {
	type:
		| 'text'
		| 'number'
		| 'textarea'
		| 'select'
		| 'radio'
		| 'checkbox'
		| 'switch'
}

type DefaultProps = {
	label: string
	placeholder?: string
	description?: string
	required?: boolean
	min?: number
	max?: number
}

export type TextFieldProps = FieldSchema &
	DefaultProps & {
		type: 'text'
		defaultValue?: string
	}

export type NumberFieldProps = FieldSchema &
	DefaultProps & {
		type: 'number'
		defaultValue?: number
	}

export type TextareaFieldProps = FieldSchema &
	DefaultProps & {
		type: 'textarea'
		defaultValue?: string
	}

export type SelectFieldProps = FieldSchema &
	DefaultProps & {
		type: 'select'
		defaultValue?: string
		values: { label: string; value: string }[]
		empty?: string
	}

export type RadioFieldProps = FieldSchema &
	DefaultProps & {
		type: 'radio'
		defaultValue?: string
		values: { label: string; value: string }[]
		empty?: string
	}

export type CheckboxFieldProps = FieldSchema &
	DefaultProps & {
		type: 'checkbox'
		defaultValue?: string[]
		values: { label: string; value: string }[]
		empty?: string
	}

export type SwitchFieldProps = FieldSchema &
	DefaultProps & {
		type: 'switch'
		defaultValue?: boolean
	}

export type Field =
	| TextFieldProps
	| NumberFieldProps
	| TextareaFieldProps
	| SelectFieldProps
	| RadioFieldProps
	| CheckboxFieldProps
	| SwitchFieldProps

export type Fields = Record<string, Field>

function generateZodSchema(fields: Fields) {
	const fieldSchemas = Object.entries(fields).reduce(
		(acc, [name, { label, type, required, min, max }]) => {
			let schema
			switch (type) {
				case 'text':
				case 'textarea':
				case 'select':
				case 'radio':
					schema = z.string()
					if (required) {
						schema = schema.min(1, { message: `${label} is required` })
					}
					if (min) {
						schema = schema.min(min, {
							message: `${label} must have at least ${min} characters`,
						})
					}
					if (max) {
						schema = schema.max(max, {
							message: `${label} must not be longer than ${max} characters`,
						})
					}
					break
				case 'number':
					schema = z.coerce.number()
					if (required) {
						schema = schema.min(1, { message: `${label} is required` })
					}
					if (min) {
						schema = schema.min(min, {
							message: `${label} must be greater than or equal to ${min}`,
						})
					}
					if (max) {
						schema = schema.max(max, {
							message: `${label} must be less than or equal to ${max}`,
						})
					}
					break
				case 'checkbox':
					schema = z.array(z.string())
					if (required) {
						schema = schema.min(1, { message: `${label} is required` })
					}
					if (min) {
						schema = schema.min(min, {
							message: `${label} must contain at least ${min} selected elements`,
						})
					}
					if (max) {
						schema = schema.max(max, {
							message: `${label} must contain no more than ${max} selected elements`,
						})
					}
					break
				case 'switch':
					schema = z.coerce.boolean()
					break
			}
			acc[name] = schema
			return acc
		},
		{} as Record<string, z.ZodTypeAny>,
	)

	const schema = z.object(fieldSchemas)

	return schema
}

export interface SchemaFormProps {
	children?: ReactNode
	fields: Fields
	onSubmit: SubmitHandler<FieldValues>
}

export function SchemaForm({ children, fields, onSubmit }: SchemaFormProps) {
	const zodSchema = generateZodSchema(fields)

	const form = useForm({
		resolver: zodResolver(zodSchema),
		defaultValues: Object.entries(fields).reduce(
			(acc, [name, field]) => {
				acc[name] = field.defaultValue || ''

				return acc
			},
			{} as Record<string, string | string[] | number | boolean | undefined>,
		),
	})

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
				{Object.entries(fields).map(([name, fieldProps]) => (
					<FormField
						key={name}
						control={form.control}
						name={name}
						render={({ field }) => {
							switch (fieldProps.type) {
								case 'text':
								case 'number':
									return (
										<FormItem>
											<FormLabel>{fieldProps.label}</FormLabel>
											<FormControl>
												<Input
													placeholder={fieldProps.placeholder}
													type={
														fieldProps.type == 'number' ? 'number' : undefined
													}
													{...field}
													value={
														field.value as
															| string
															| string[]
															| number
															| undefined
													}
												/>
											</FormControl>
											<FormDescription>
												{fieldProps.description}
											</FormDescription>
											<FormMessage />
										</FormItem>
									)
								case 'textarea':
									return (
										<FormItem>
											<div className="mb-4">
												<FormLabel>{fieldProps.label}</FormLabel>
												<FormDescription>
													{fieldProps.description}
												</FormDescription>
											</div>
											<FormControl>
												<Textarea
													placeholder={fieldProps.placeholder}
													max={fieldProps.max}
													maxLength={fieldProps.max}
													{...field}
													value={
														(field.value as
															| string
															| string[]
															| number
															| undefined) || undefined
													}
												/>
											</FormControl>

											<FormMessage />
										</FormItem>
									)
								case 'select':
									return (
										<FormItem>
											<FormLabel>{fieldProps.label}</FormLabel>
											<Select
												onValueChange={field.onChange}
												defaultValue={fieldProps.defaultValue}
											>
												<FormControl>
													<SelectTrigger>
														<SelectValue
															placeholder={
																fieldProps.placeholder ||
																`Select ${fieldProps.label}`
															}
														/>
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													{fieldProps.values.map(({ value, label }) => (
														<SelectItem key={value} value={value}>
															{label}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
											<FormDescription>
												{fieldProps.description}
											</FormDescription>
											<FormMessage />
										</FormItem>
									)
								case 'radio':
									return (
										<FormItem>
											<div className="mb-4">
												<FormLabel>{fieldProps.label}</FormLabel>
												<FormDescription>
													{fieldProps.description}
												</FormDescription>
											</div>
											<FormControl>
												<RadioGroup
													onValueChange={field.onChange}
													defaultValue={fieldProps.defaultValue}
													className="flex flex-col"
												>
													{fieldProps.values.map(({ value, label }) => (
														<FormItem
															key={value}
															className="flex items-center space-x-3 space-y-0"
														>
															<FormControl>
																<RadioGroupItem value={value} />
															</FormControl>
															<FormLabel className="font-normal text-sm">
																{label}
															</FormLabel>
														</FormItem>
													))}
												</RadioGroup>
											</FormControl>
											<FormMessage />
										</FormItem>
									)
								case 'checkbox':
									return (
										<FormItem>
											<div className="mb-4">
												<FormLabel>{fieldProps.label}</FormLabel>
												<FormDescription>
													{fieldProps.description}
												</FormDescription>
											</div>
											{fieldProps.values.map(({ value, label }) => (
												<FormField
													key={value}
													control={form.control}
													name={name}
													render={({ field }) => {
														return (
															<FormItem
																key={value}
																className="flex flex-row items-start space-x-3 space-y-0"
															>
																<FormControl>
																	<Checkbox
																		checked={(
																			field.value as undefined | string[]
																		)?.includes(value)}
																		onCheckedChange={(checked) => {
																			return checked
																				? field.onChange([
																						...(field.value as string[]),
																						value,
																				  ])
																				: field.onChange(
																						(
																							field.value as
																								| undefined
																								| string[]
																						)?.filter((val) => val !== value),
																				  )
																		}}
																	/>
																</FormControl>
																<FormLabel className="font-normal text-sm">
																	{label}
																</FormLabel>
															</FormItem>
														)
													}}
												/>
											))}
											<FormMessage />
										</FormItem>
									)
								case 'switch':
									return (
										<FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
											<div className="space-y-0.5">
												<FormLabel>{fieldProps.label}</FormLabel>
												<FormDescription>
													{fieldProps.description}
												</FormDescription>
											</div>
											<FormControl>
												<Switch
													checked={field.value as boolean | undefined}
													onCheckedChange={field.onChange}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)
							}
						}}
					/>
				))}

				{children}
			</form>
		</Form>
	)
}
