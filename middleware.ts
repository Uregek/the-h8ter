import { authMiddleware } from '@clerk/nextjs'

export default authMiddleware({
	publicRoutes: ['/', '/plots/(.*)', '/api/uploadthing'],
})

export const config = {
	matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}
