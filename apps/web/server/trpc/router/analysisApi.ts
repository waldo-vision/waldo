import { GameplayArray } from '@utils/zod/analysis';
import { router, apiProcedure } from '../trpc';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';
export const analysisApiRouter = router({
  getLinks: apiProcedure //this needs to be public, since python is stateless
    .meta({
      openapi: { method: 'GET', path: '/analysis/urls' },
    })
    .input(
      z.object({
        //pages are 10 clips
        page: z.number(),
        rating: z.number(),
        minReviews: z.number(),
        //todo add review requiremenets
      }),
    )
    .output(GameplayArray)
    .query(async ({ input, ctx }) => {
      /*here query database for api key*/
      const [itemCount, noCounts, results] = await ctx.prisma.$transaction([
        ctx.prisma.gameplay.count(),
        ctx.prisma.gameplayVotes.count({
          where: { isGame: false },
        }),
        ctx.prisma.gameplay.findMany({
          skip: input.page * 10,
          take: 10,
          include: { gameplayVotes: { where: { isGame: true } } },
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
            // since query includes gameplayvotes if isGame is true, then this is the total amt of yes votes.
            const yesCounts = result.gameplayVotes.length;

            // no votes is just a prisma count query where isGame if false. This just adds
            // the total amt of no votes + the yesCounts.
            const totalVotes = yesCounts + noCounts;
            if (totalVotes < input.minReviews) {
              throw new TRPCError({
                message:
                  'no gameplay items were found with the provided minVotes param.',
                code: 'NOT_FOUND',
              });
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
            'no gameplay items could be found with the provided rating percentage',
          code: 'NOT_FOUND',
        });
      }
      return returnarray;
    }),
});
