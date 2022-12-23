import { z } from 'zod';

export const UserSchema = z.object({
  id: z.string(),
  name: z.string().nullable(),
  email: z.string().nullable(),
  emailVerified: z.date().nullable(),
  image: z.string().nullable(),
  blacklisted: z.boolean(),
  role: z.string(),
  userCount: z.number().optional(),
});
