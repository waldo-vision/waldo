import { rbacProtectedProcedure } from '@server/trpc/trpc';
import * as Sentry from '@sentry/nextjs';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

export default rbacProtectedProcedure(['moderator', 'write:api_key'])
  .meta({ openapi: { method: 'DELETE', path: '/api/key' } })
  .input(
    z.object({
      id: z.string().cuid(),
    }),
  )
  .output(z.object({ msg: z.string() }))
  .mutation(async ({ input, ctx }) => {
    try {
      const apiKey = await ctx.prisma.apiKey.delete({
        where: {
          id: input.id,
          keyOwnerId: ctx.session.user.id,
        },
      });

      // so the trpc error is thrown
      if (apiKey === null)
        throw new Error('An error occured deleting the key.');

      return { msg: 'Successfully deleted the api key.' };
    } catch (error) {
      Sentry.captureException(error);
      throw new TRPCError({
        message: 'An error occured deleting the key.',
        code: 'NOT_FOUND',
      });
    }
  });
