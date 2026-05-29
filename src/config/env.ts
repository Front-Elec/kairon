import { z } from 'zod'

const envSchema = z.object({
  VITE_API_BASE_URL: z.url(),
})

const parsedEnv = envSchema.safeParse({
  VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
})

if (!parsedEnv.success) {
  const formattedError = parsedEnv.error.issues
    .map((issue) => `- ${issue.path.join('.')}: ${issue.message}`)
    .join('\n')

  throw new Error(`Invalid environment variables:\n${formattedError}`)
}

export const env = parsedEnv.data
