import { z } from 'zod';
import { GameplayTypes } from './gameplay';

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
export const GPSchema = z.object({
  id: z.string().cuid(),
  userId: z.string(),
  youtubeUrl: z.string().url(),
  footageType: z.string(),
  upVotes: z.number(),
  downVotes: z.number(),
  isAnalyzed: z.boolean(),
  gameplayCount: z.number().optional(),
});
