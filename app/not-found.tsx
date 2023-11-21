import Link from 'next/link'

import { Confetti } from '@/components/animate/confetti'
import { LottieLoader } from '@/components/animate/lottie-loader'

import skullAnimation from '../lotties/skull.json'

export default function NotFound() {
	return (
		<div className="flex flex-col justify-center items-center mx-auto">
			<Confetti full />
			<LottieLoader className="z-10" animationData={skullAnimation} />
			<h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
				Not Found
			</h1>
			<p className="leading-7 mt-2">Could not find requested resource</p>
			<Link href="/" className="leading-7 hover:underline">
				Return Home
			</Link>
		</div>
	)
}
