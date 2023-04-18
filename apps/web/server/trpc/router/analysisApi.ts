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
        //todo add review requiremenets
      }),
    )
    .output(GameplayArray)
    .query(async ({ input, ctx }) => {
      /*here query database for api key*/
      const itemCount = await ctx.prisma.gameplay.count();
      const pagenumber = input.page;
      const results = await ctx.prisma.gameplay.findMany({
        skip: pagenumber * 10,
        take: 10,
      });
      if (results == null || !results.length) {
        throw new TRPCError({
          message: 'no gameplay items found',
          code: 'NOT_FOUND',
        });
      }
      const returnarray = {
        gameplay: results.map(result => {
          return {
            id: result.id,
            ytUrl: result.youtubeUrl,
            game: result.gameplayType,
          };
        }),
        totalPages: Math.ceil(itemCount / 10),
        page: pagenumber,
      };
      return returnarray;
    }),
});
