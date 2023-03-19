import { TRPCError } from '@trpc/server';
import { serverSanitize } from '@utils/sanitize';
import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';

export const utilRouter = router({
  getYtVidDataFromId: protectedProcedure
    .meta({ openapi: { method: 'PUT', path: '/user' } })
    .input(
      z
        .object({
          videoId: z.string(),
        })
        .transform(input => {
          return {
            videoId: serverSanitize(input.videoId),
          };
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
  verifyUser: protectedProcedure
    .meta({ openapi: { method: 'PUT', path: '/user/verify' } })
    .input(
      z
        .object({
          tsToken: z.string(),
        })
        .transform(input => {
          return {
            tsToken: serverSanitize(input.tsToken),
          };
        }),
    )
    .output(
      z.object({
        result: z.boolean(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const endpoint =
        'https://challenges.cloudflare.com/turnstile/v0/siteverify';
      const body = `secret=${encodeURIComponent(
        process.env.CLOUDFLARE_TURNSTILE_SECRET,
      )}&response=${encodeURIComponent(input.tsToken)}`;
      const request = await fetch(endpoint, {
        method: 'POST',
        body,
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
        },
      });
      const result = await request.json();
      if (result.success) {
        return {
          result: true,
        };
      } else {
        return {
          result: false,
        };
      }
    }),
});
