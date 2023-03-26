import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';
import { serverSanitize } from '@utils/sanitize';

export async function vUser(tsToken: string) {
  console.log(tsToken);
  const endpoint = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
  const body = `secret=${encodeURIComponent(
    process.env.CLOUDFLARE_TURNSTILE_SECRET,
  )}&response=${encodeURIComponent(tsToken)}`;
  const request = await fetch(endpoint, {
    method: 'POST',
    body,
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
    },
  });
  const result = await request.json();
  console.log(result);
  if (result.success) {
    return true;
  } else {
    return false;
  }
}

export const utilRouter = router({
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
      const result = await vUser(input.tsToken);
      if (result) {
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
