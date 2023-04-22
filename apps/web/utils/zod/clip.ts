import { z } from 'zod';

export const ClipSchema = z.object({
  id: z.string().cuid(),
  gameplayId: z.string().cuid(),
});
