import { z } from 'zod';

export const SegmentSchema = z.object({
  id: z.string().cuid(),
  gameplayId: z.string().cuid(),
});
