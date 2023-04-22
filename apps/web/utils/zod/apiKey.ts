import { z } from 'zod';

const ApiKeyStates = z.enum(['ACTIVE', 'EXPIRED']);

export const KeySchema = z.object({
  id: z.string().cuid(),
  keyOwnerId: z.string().cuid(),
  state: ApiKeyStates,
  name: z.string().optional(),
  // will only be returned once!!!
  clientKey: z.string().optional(),

  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});
