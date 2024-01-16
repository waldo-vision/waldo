import { rbacProtectedProcedure } from '@server/trpc/trpc';
import * as Sentry from '@sentry/nextjs';
import { serverSanitize } from '@utils/sanitize';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';

export default rbacProtectedProcedure([
  'write:user',
  'write:infractions',
  'write:infractions:perma_suspend',
])
  .meta({ openapi: { method: 'PUT', path: '/user' } })
  .input(
    // this will be edited in the future to use the new infractions method of user "punishments" instead of a general blacklist.
    z
      .object({
        userId: z.string().cuid(),
        blacklisted: z.boolean(),
      })
      .transform(input => {
        return {
          userId: serverSanitize(input.userId),
          blacklisted: input.blacklisted,
        };
      }),
  )
  .output(z.object({ message: z.string(), blacklisted: z.boolean() }))
  .mutation(async ({ input, ctx }) => {
    try {
      await ctx.prisma.user.update({
        where: {
          id: input.userId,
        },
        data: {
          blacklisted: input.blacklisted,
        },
      });
      return {
        message: `blacklisted field on user: ${input.userId} changed to ${input.blacklisted}.`,
        blacklisted: input.blacklisted,
      };
    } catch (error) {
      Sentry.captureException(error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unknown error has occurred.',
        // not sure if its safe to give this to the user
        cause: error,
      });
    }
  });
