import { apiProcedure } from '@server/trpc/trpc';
import { TRPCError } from '@trpc/server';
import { GameplayArray } from '@utils/zod/analysis';
import { z } from 'zod';

export default apiProcedure
  .meta({
    openapi: { method: 'GET', path: '/analysis/urls' },
  })
  .input(
    z.object({
      page: z.number(), //pages are 10 clips
      rating: z.number(), //minimum rating for clips in yesvotes/totalvotes as integer for percentage (100 => 100% and so on)(0 to not check)
      minReviews: z.number(), //minimum amount of reviews as integer (0 to not check)
    }),
  )
  .output(GameplayArray)
  .query(async ({ input, ctx }) => {
    /*here query database for gameplay*/
    const [itemCount, results] = await ctx.prisma.$transaction([
      ctx.prisma.gameplay.count(), //total gameplay count for pagination
      ctx.prisma.gameplay.findMany({
        //10 gameplays with included gameplayVotes
        skip: input.page * 10,
        take: 10,
        include: {
          gameplayVotes: {},
        },
      }),
    ]);
    if (results == null || !results.length) {
      throw new TRPCError({
        message: 'no gameplay items found',
        code: 'NOT_FOUND',
      });
    }
    const returnarray = {
      gameplay: results
        .filter(result => {
          // Every gameplay gets checked for yes/total votes percentage
          const yesCounts = result.gameplayVotes.filter(
            vote => vote.isGame === true,
          ).length;
          const noCounts = result.gameplayVotes.filter(
            vote => vote.isGame === false,
          ).length;
          //Total votes for current gameplay for percentage calculation and minvotes
          const totalVotes = yesCounts + noCounts;
          if (totalVotes < input.minReviews) {
            return false; //sort out submissions, which do not have minimum reviews
          }
          // yesPercentage is pretty explanatory here.
          const yesPercentage = (yesCounts / totalVotes) * 100;
          // this checks if the yesPercentage is greater than or equal to the rating input. This just makes sure there is a minimum result.
          return yesPercentage >= input.rating;
        })
        // just loops through all of the results and formats the result;
        .map(result => {
          return {
            id: result.id,
            ytUrl: result.youtubeUrl,
            game: result.gameplayType,
          };
        }),
      totalPages: Math.floor(itemCount / 10),
      page: input.page,
    };
    if (returnarray.gameplay.length == 0) {
      throw new TRPCError({
        message:
          'no gameplay items could be found with the provided rating percentage or minimum votes parameter',
        code: 'NOT_FOUND',
      });
    }
    return returnarray;
  });
