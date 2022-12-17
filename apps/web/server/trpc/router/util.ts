import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';

export const utilRouter = router({
  getYtVidDataFromId: protectedProcedure
    .meta({ openapi: { method: 'PUT', path: '/user' } })
    .input(
      z.object({
        videoId: z.string(),
      }),
    )
    .output(z.object({ title: z.string() }))
    .query(async ({ input, ctx }) => {
      const baseUrl =
        'https://www.googleapis.com/youtube/v3/videos?part=snippet&id=';
      const options = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      };
      const url =
        baseUrl + input.videoId + '&key=' + `${process.env.YOUTUBE_API_KEY}`;
      try {
        const request = await fetch(url, options);
        const res = await request.json();
        return res.items[0].snippet;
      } catch (error) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Error contacting youtube API.',
        });
      }
    }),
});
