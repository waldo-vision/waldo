import { rbacProtectedProcedure } from '@server/trpc/trpc';
import { TRPCError } from '@trpc/server';
import { serverSanitize } from '@utils/sanitize';
import * as Sentry from '@sentry/nextjs';
import { z } from 'zod';

const zodInput = z
  .object({
    gameplayId: z.string().cuid(),
  })
  .transform(input => {
    return {
      gameplayId: serverSanitize(input.gameplayId),
    };
  });

const zodOutput = z.void();

export default rbacProtectedProcedure(['write:all', 'write:gameplay'])
  .meta({ openapi: { method: 'DELETE', path: '/gameplay' } })
  .input(zodInput)
  .output(zodOutput)
  .mutation(async ({ input, ctx }) => {
    try {
      const gameplay = await ctx.prisma.gameplay.findUnique({
        where: {
          id: input.gameplayId,
        },
      });
      if (gameplay == null) {
        throw new TRPCError({
          code: 'NOT_FOUND',
        });
      }

      await ctx.prisma.gameplay.delete({
        where: {
          id: input.gameplayId,
        },
      });
    } catch (error) {
      // throws RecordNotFound if record not found to update
      // but can't import for some reason
      Sentry.captureException(error);

      // if this error throws then we know it's an issue with the actual deleting
      Sentry.captureException(error);

      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An error occurred in the server',
        // not sure if this is secure
        cause: error,
      });
    }
  });
