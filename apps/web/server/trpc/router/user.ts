import { TRPCError } from '@trpc/server';
import ytdl from 'ytdl-core';
import { GameplaySchema, GameplayTypes } from '@utils/zod/gameplay';
import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';

export const userRouter = router({
  blackListUser: protectedProcedure
    .meta({ openapi: { method: 'POST', path: '/user' } })
    .input(
      z.object({
        userId: z.string().cuid(),
        blacklisted: z.boolean(),
      }),
    )
    .output(z.object({ message: z.string(), blacklisted: z.boolean() }))
    .mutation(async ({ input, ctx }) => {
      try {
        const userDocument = await ctx.prisma.user.update({
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
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An unknown error has occurred.',
          // not sure if its safe to give this to the user
          cause: error,
        });
      }

      // if gameplay not found, or not the user who made it
      // TODO: need to do role checking
    }),
});
