import { z } from 'zod';
import { GameplayTypes } from './gameplay';
export const UserSchema = z.object({
  id: z.string(),
  name: z.string().nullable().optional(),
  email: z.string().nullable().optional(),
  emailVerified: z.date().nullable().optional(),
  image: z.string().nullable().optional(),
  blacklisted: z.boolean(),
  role: z.string(),
  userCount: z.number().optional(),
});

export const PublicUserSchema = z.object({
  name: z.string().nullable().optional(),
  image: z.string().nullable().optional(),
});

export const GPSchema = z.object({
  id: z.string().cuid(),
  userId: z.string(),
  youtubeUrl: z.string().url(),
  gameplayType: z.string(),
  isAnalyzed: z.boolean(),
  gameplayCount: z.number().optional(),
});
