import { z } from 'zod';

export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  emailVerified: z.date().nullable(),
  image: z.string(),
  blacklisted: z.boolean(),
  role: z.string(),
});
