import { rbacProtectedProcedure } from '@server/trpc/trpc';
import * as Sentry from '@sentry/nextjs';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';

export default rbacProtectedProcedure(['read:all', 'user'])
  .meta({ openapi: { method: 'DELETE', path: '/user' } })

  .output(z.object({ message: z.string() }))
  .mutation(async ({ ctx }) => {
    // make sure user is trying to delete THEIR account
    // and no t someone elses.
    const userId = ctx.session.user.id;
    const objOwnerId = ctx.session.user.id;

    if (userId !== objOwnerId) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'Unable to delete the requested user account.',
        cause: 'Requested user ID & current server session ID DO NOT MATCH.',
      });
    }

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
