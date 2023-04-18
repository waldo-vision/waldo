import { z } from 'zod';

/*Api Types for link retrieval for analysis group*/

export const Gameplay = z.object({
  uuid: z.string().cuid(),
  ytUrl: z.string(),
});

export const GameplayArray = z.object({
  gameplay: z.array(Gameplay),
  page: z.number(),
  totalPages: z.number(),
});
