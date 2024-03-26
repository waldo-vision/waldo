import { z } from 'zod';
import { GameplayTypes } from './gameplay';
/*Api Types for link retrieval for analysis group*/

export const Gameplay = z.object({
  id: z.string().cuid(),
  ytUrl: z.string(),
  game: GameplayTypes,
});

export const GameplayArray = z.object({
  gameplay: z.array(Gameplay),
  page: z.number(),
  totalPages: z.number(),
});
