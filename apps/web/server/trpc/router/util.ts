import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';
import { serverSanitize } from '@utils/sanitize';
import * as Sentry from '@sentry/nextjs';

/**
 * Verifies a user with the Cloudflare Turnstile API
 * @param tsToken turnstile token
 * @returns true if the user is verified, false if not
 */
export async function vUser(tsToken: string) {
  // so we can track how long this takes
  const span = Sentry.getCurrentHub().getScope().getTransaction()?.startChild({
    op: 'turnstile.siteverify',
  });

  Sentry.getCurrentHub().getScope().addBreadcrumb({
    category: 'turnstile.siteverify',
    message: 'Verifying user',
  });

  try {
    const endpoint =
      'https://challenges.cloudflare.com/turnstile/v0/siteverify';
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
    if (result.success) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    Sentry.captureException(error);
    return false;
  } finally {
    span?.finish();
  }
}

export const utilRouter = router({
  verifyUser: protectedProcedure
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
