import { rbacProtectedProcedure } from '@server/trpc/trpc';
import * as Sentry from '@sentry/nextjs';
import { z } from 'zod';
import { GameplayTypes } from '@utils/zod/gameplay';
import { vUser } from '../util';
import { TRPCError } from '@trpc/server';

const zodInput = z.object({
  gameplayId: z.string().cuid(),
  isGame: z.boolean(),
  actualGame: GameplayTypes,
  tsToken: z.string(),
});

const zodOutput = z.object({ message: z.string() });

export default rbacProtectedProcedure(['user'])
  .meta({ openapi: { method: 'PATCH', path: '/gameplay/review' } })
  .input(zodInput)
  .output(zodOutput)
  .mutation(async ({ input, ctx }) => {
    Sentry.getCurrentHub()
      .getScope()
      .addBreadcrumb({
        category: 'trpc.gameplay.review',
        level: 'log',
        data: {
          gameplayId: input.gameplayId,
        },
      });
    try {
      // veryify user with turnstile
      const isPerson = await vUser(input.tsToken);
      if (!isPerson) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message:
            'We could not confirm if you were a legitimate user. Please refresh the page and try again.',
          // not sure if its safe to give this to the user
          cause: '',
        });
      }
      const footageVote = await ctx.prisma.gameplayVotes.create({
        data: {
          gameplay: {
            connect: {
              id: input.gameplayId,
            },
          },
          isGame: input.isGame,
          actualGame: input.actualGame,
          user: {
            connect: {
              id: ctx.session.user.id,
            },
          },
        },
      });
      if (!footageVote) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `Could not find a gameplay document with id:${input.gameplayId}.`,
        });
      }
      return { message: 'Updated the gameplay document successfully.' };
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error;
      }
      Sentry.captureException(error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
      });
    }
  });
