import { rbacProtectedProcedure } from '@server/trpc/trpc';
import { genApiKey, genSecretHash } from '@server/utils/apiHelper';
import { TRPCError } from '@trpc/server';
import { KeySchema } from '@utils/zod/apiKey';
import { ApiKeyState } from 'database';
import { z } from 'zod';
import * as Sentry from '@sentry/nextjs';
export default rbacProtectedProcedure(['moderator', 'write:api_key'])
  .meta({ openapi: { method: 'POST', path: '/api/key' } })
  .input(
    z.object({
      name: z.string(),
    }),
  )
  .output(KeySchema)
  .mutation(async ({ input, ctx }) => {
    try {
      const clientKey = genApiKey();
      const serverHashedKey = await genSecretHash(clientKey);
      const apiKey = await ctx.prisma.apiKey.create({
        data: {
          user: {
            connect: {
              id: ctx.session.user.id,
            },
          },
          name: input.name,
          key: serverHashedKey,
          state: ApiKeyState.ACTIVE,
        },
      });

      // so the trpc error is thrown
      if (apiKey === null)
        throw new Error('An error occured creating the key.');

      // add clientKey to the final return object.
      Object.assign(apiKey, { clientKey: clientKey });
      return apiKey;
    } catch (error) {
      Sentry.captureException(error);
      throw new TRPCError({
        message: 'An error occured creating the key.',
        code: 'NOT_FOUND',
      });
    }
  });
