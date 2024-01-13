import { rbacProtectedProcedure } from '@server/trpc/trpc';
import { ReviewItemsGameplaySchema } from '@utils/zod/gameplay';
import * as Sentry from '@sentry/nextjs';

import { z } from 'zod';
import { TRPCError } from '@trpc/server';

const zodInput = z.object({
  tsToken: z.string(),
});

const zodOutput = ReviewItemsGameplaySchema;

export default rbacProtectedProcedure(['user'])
  .meta({ openapi: { method: 'GET', path: '/gameplay/review' } })
  .input(zodInput)
  .output(zodOutput)
  .query(async ({ input, ctx }) => {
    Sentry.getCurrentHub().getScope().addBreadcrumb({
      category: 'trpc.gameplay.getReviewItems',
      level: 'log',
      // message: '',
    });

    try {
      // optimize prisma query
      const [itemCount, reviewItem, userReviewedAmt] =
        await ctx.prisma.$transaction([
          ctx.prisma.gameplay.count(),
          ctx.prisma.gameplay.findMany({
            where: {
              gameplayVotes: { none: { userId: ctx.session.user.id } },
            },
            take: 1,
            include: {
              user: true,
              gameplayVotes: true,
            },
          }),
          ctx.prisma.user.findUnique({
            where: {
              id: ctx.session.user.id,
            },
            include: {
              gameplayVotes: true,
            },
          }),
        ]);

      type ReviewItemOutput = (typeof reviewItem)[number] & {
        _count: {
          gameplayVotes: number;
        };
        total: number;
      };

      if (reviewItem[0] == null || reviewItem[0] == undefined) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      } else {
        // this is so cursed
        Object.assign(reviewItem[0], {
          _count: {
            gameplayVotes: userReviewedAmt
              ? userReviewedAmt.gameplayVotes.length
              : 0,
          },
        });
        Object.assign(reviewItem[0], { total: itemCount });
        return reviewItem[0] as ReviewItemOutput;
      }
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
