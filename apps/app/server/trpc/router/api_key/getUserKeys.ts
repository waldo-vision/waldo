import { rbacProtectedProcedure } from '@server/trpc/trpc';
import { TRPCError } from '@trpc/server';
import { KeySchema } from '@utils/zod/apiKey';
import { z } from 'zod';
import * as Sentry from '@sentry/nextjs';
export default rbacProtectedProcedure(['moderator', 'read:api_key'])
  .meta({ openapi: { method: 'GET', path: '/api/key/user' } })
  .output(z.array(KeySchema))
  .query(async ({ ctx }) => {
    try {
      const apiKey = await ctx.prisma.apiKey.findMany({
        where: {
          keyOwnerId: ctx.session.user.id,
        },
      });
      // so the trpc error is thrown
      if (apiKey === null)
        throw new Error(
          'No api keys could be found that were related to the user.',
        );

      return apiKey;
    } catch (error) {
      Sentry.captureException(error);
      throw new TRPCError({
        message: 'No api keys could be found that were related to the user.',
        code: 'NOT_FOUND',
      });
    }
  });
