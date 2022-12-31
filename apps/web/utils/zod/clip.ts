import { z } from 'zod';

export const ClipSchema = z.object({
  id: z.string().uuid(),
  gameplayId: z.string().uuid(),
});
