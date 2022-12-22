import { z } from 'zod';

export const users = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  emailVerified: z.boolean().nullable(),
  image: z.string(),
  blacklisted: z.boolean().nullable(),
  role: z.string(),
  userCount: z.number().optional()
})
