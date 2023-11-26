'use client'

import { ReactNode } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'

import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
} from '@/components/ui/command'
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
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

type FieldSchema = {
	type: 'text' | 'number' | 'textarea' | 'select' | 'radio' | 'checkbox'
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

export type Field =
	| TextFieldProps
	| NumberFieldProps
	| TextareaFieldProps
	| SelectFieldProps
	| RadioFieldProps
	| CheckboxFieldProps

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
					break
				case 'number':
					schema = z.coerce.number()
					break
				case 'checkbox':
					schema = z.array(z.string())
			}
			if (required) {
				schema = schema.min(1, { message: `${label} is required` })
			}
			if (min) {
				schema = schema.min(min, {
					message:
						type === 'number'
							? `${label} must be greater than or equal to ${min}`
							: `${label} must have at least ${min} characters`,
				})
			}
			if (max) {
				schema = schema.max(max, {
					message:
						type === 'number'
							? `${label} must be less than or equal to ${max}`
							: `${label} must not be longer than ${max} characters`,
				})
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
			{} as Record<string, string | string[] | number | undefined>,
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
													value={field.value || undefined}
												/>
											</FormControl>

											<FormMessage />
										</FormItem>
									)
								case 'select':
									return (
										<FormItem className="flex flex-col">
											<FormLabel>{fieldProps.label}</FormLabel>
											<Popover>
												<PopoverTrigger asChild>
													<FormControl>
														<Button
															variant="outline"
															role="combobox"
															className={cn(
																'w-full justify-between',
																!field.value && 'text-muted-foreground',
															)}
														>
															{field.value
																? fieldProps.values.find(
																		({ value }) => value === field.value,
																  )?.label
																: fieldProps.placeholder ||
																  `Select ${fieldProps.label}`}
															<CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
														</Button>
													</FormControl>
												</PopoverTrigger>
												<PopoverContent className="w-full p-0">
													<Command>
														<CommandInput
															placeholder={fieldProps.placeholder}
														/>
														<CommandEmpty>
															{fieldProps.empty ||
																`No ${fieldProps.label} found`}
														</CommandEmpty>
														<CommandGroup>
															{fieldProps.values.map(({ value, label }) => (
																<CommandItem
																	value={label}
																	key={value}
																	onSelect={() => {
																		field.onChange(value)
																	}}
																>
																	<CheckIcon
																		className={cn(
																			'mr-2 h-4 w-4',
																			value === field.value
																				? 'opacity-100'
																				: 'opacity-0',
																		)}
																	/>
																	{label}
																</CommandItem>
															))}
														</CommandGroup>
													</Command>
												</PopoverContent>
											</Popover>
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
															<FormLabel className="font-normal">
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
																<FormLabel className="font-normal">
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
							}
						}}
					/>
				))}

				{children}
			</form>
		</Form>
	)
}
