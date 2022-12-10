import { z } from 'zod';

export const ClipZodSchema = z.object({
  uuid: z.string().uuid(),
  footage: z.string().uuid(),
});
export const ClipRetrieveSchema = z.object({
  clips: z.array(ClipZodSchema),
});
