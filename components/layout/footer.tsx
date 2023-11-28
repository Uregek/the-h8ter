import { ToggleMode } from '@/components/ui/toggle-mode'

export function Footer() {
	return (
		<footer className="w-full bg-secondary text-muted-foreground z-10">
			<div className="flex px-2 py-[60px] container items-center justify-between w-full mx-auto border-t border-t-primary">
				<span className="text-xs max-w-[150px]">
					The-H8ter, Inc. © 2023. All rights reserved.
				</span>
				<div className="flex items-center gap-2">
					<ToggleMode />
				</div>
			</div>
		</footer>
	)
}
