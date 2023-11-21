'use client'

import { ReactNode, useState } from 'react'

import { Check, Copy } from 'lucide-react'

export interface CopyToClipboardProps {
	children: ReactNode
	valueToCopy: string
}

const CopyToClipboard = ({ children, valueToCopy }: CopyToClipboardProps) => {
	const [copied, setCopied] = useState(false)

	const onCopy = () => {
		navigator.clipboard.writeText(valueToCopy)
		setCopied(true)

		setTimeout(() => {
			setCopied(false)
		}, 1000)
	}

	return (
		<>
			{children}
			<button onClick={!copied ? onCopy : undefined}>
				{copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
			</button>
		</>
	)
}
CopyToClipboard.displayName = 'CopyToClipboard'

export { CopyToClipboard }
