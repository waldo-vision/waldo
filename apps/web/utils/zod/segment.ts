import { z } from "zod";

export const SegmentSchema = z.object({
  id: z.string().cuid(),
  footageId: z.string().cuid(),
});
