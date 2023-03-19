import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';

export const utilRouter = router({
  verifyUser: protectedProcedure
    .meta({ openapi: { method: 'PUT', path: '/user/verify' } })
    .input(
      z.object({
        tsToken: z.string(),
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
