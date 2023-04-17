import { z } from 'zod';

/*Api Types for link retrieval for analysis group*/

export const GameplayRequirements = z.object({
  minReviews: z.string(),
  rating: z.number(),
});

export const Gameplay = z.object({
  uuid: z.string().cuid(),
  ytUrl: z.string(),
});

export const GameplayRequest = z.object({
  api_key: z.string(),
  requirements: GameplayRequirements,
});

export const GameplayArray = z.object({
  gameplay: z.array(Gameplay),
  page: z.number(),
  totalPages: z.number(),
});
