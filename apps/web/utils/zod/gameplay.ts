import { z } from 'zod';
import { UserSchema } from './dash';

export const GameplayTypes = z.enum(['VAL', 'CSG', 'TF2', 'APE', 'COD', 'R6S']);

export const GameplaySchema = z.object({
  id: z.string().cuid(),
  userId: z.string(),
  youtubeUrl: z.string().url(),
  footageType: GameplayTypes,
  upVotes: z.number(),
  downVotes: z.number(),
  isAnalyzed: z.boolean(),
});

export const GameplaysDashSchema = z.object({
  id: z.string().cuid(),
  userId: z.string().cuid(),
  youtubeUrl: z.string().url(),
  footageType: GameplayTypes,
  upVotes: z.number(),
  downVotes: z.number(),
  isAnalyzed: z.boolean(),
  user: z.object({
    name: z.string().nullable(),
  }),
  gameplayCount: z.number().optional(),
});

export const GameplayPlusUserSchema = GameplaySchema.merge(
  z.object({
    user: UserSchema,
  }),
);
