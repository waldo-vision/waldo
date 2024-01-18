import { rbacProtectedProcedure } from '@server/trpc/trpc';
import * as Sentry from '@sentry/nextjs';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';

export default rbacProtectedProcedure(['read:user', 'write:user', 'user'])
  .meta({ openapi: { method: 'DELETE', path: '/user' } })

  .output(z.object({ message: z.string() }))
  .mutation(async ({ ctx }) => {
    // make sure user is trying to delete THEIR account
    // and no t someone elses.
    const objOwnerId = ctx.session.user.id;

    try {
      await ctx.prisma.user.delete({
        where: {
          id: objOwnerId,
        },
      });
      return {
        message: `Successfully removed user ${objOwnerId}.`,
      };
    } catch (error) {
      console.log(error);
      Sentry.captureException(error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message:
          'An error occured while trying to delete user. Please contact support if this contiunes occuring.',
        // not sure if its safe to give this to the user
        cause: error,
      });
    }
  });
