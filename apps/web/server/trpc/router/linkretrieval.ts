import { GameplayArray } from '@utils/zod/analysis';
import { router, apiProcedure } from '../trpc';
import { GameplayType } from 'database';
import { z } from 'zod';
import { GameplayTypes } from '@utils/zod/gameplay';
export const linkRetrievalRouter = router({
  getLinks: apiProcedure //this needs to be public, since python is stateless
    .meta({
      openapi: { method: 'GET', path: '/analysis/urls' },
    })
    .input(
      z.object({
        //pages are 10 clips
        page: z.number(),
        type: GameplayTypes,
        //todo add review requiremenets
      }),
    )
    .output(GameplayArray)
    .query(async ({ input, ctx }) => {
      /*here query database for api key*/
      const itemCount = await ctx.prisma.gameplay.count();
      const requiredgameplay = input.type;
      const pagenumber = 0;
      const results = await ctx.prisma.gameplay.findMany({
        skip: pagenumber * 10,
        take: 10,
        where: {
          gameplayType: requiredgameplay as GameplayType,
        },
      });
      if (results != null) {
        const returnarray = {
          gameplay: results.map(results => [results.id, results.youtubeUrl]),
          totalPages: itemCount / 10,
          page: pagenumber,
        };
        return returnarray;
      }
    }),
});
