import { z } from "zod";

export const GameplaySchema = z.object({
  id: z.string().cuid(),
  userId: z.string(),
  youtubeUrl: z.string().url(),
  footageType: z.string(),
  upVotes: z.number().optional(),
  downVotes: z.number().optional(),
  isAnalyzed: z.boolean(),
});

export const GameplayTypes = z.enum(['VAL', 'CSG', 'TF2', 'APE', 'COD']);
