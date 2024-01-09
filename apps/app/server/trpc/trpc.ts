import { initTRPC, TRPCError } from '@trpc/server';
import superjson from 'superjson';
import { OpenApiMeta } from 'trpc-openapi';
import { type Context } from './context';
import { compareKeyAgainstHash } from '@server/utils/apiHelper';
// import * as Sentry from '@sentry/nextjs';
import * as Sentry from '@sentry/nextjs';
import { type Session } from 'next-auth';

const t = initTRPC
  .context<Context>()
  .meta<OpenApiMeta>()
  .create({
    transformer: superjson,
    errorFormatter({ shape }) {
      return shape;
    },
  });

export const router = t.router;

// create a sentry transaction/span for each endpoint
const sentryMiddleware = t.middleware(
  Sentry.Handlers.trpcMiddleware({
    attachRpcInput: true,
  }),
);

/**
 * Unprotected procedure
 **/
export const publicProcedure = t.procedure.use(sentryMiddleware);

/**
 * Reusable middleware to ensure
 * users are logged in
 * rate limit middleware
 */
const isAuthed = t.middleware(async ({ ctx, next }) => {
  if (!ctx.session || !ctx.session.logto_id)
    throw new TRPCError({ code: 'UNAUTHORIZED' });

  // set the user on the sentry scope
  // so we can track effected users
  Sentry.getCurrentHub().getScope().setUser({ id: ctx.session.logto_id });

  return next({
    ctx: {
      // infers the `session` as non-nullable
      session: { ...ctx.session, user: ctx.session },
    },
  });
});

/**
 * Protected procedure
 **/

/**
 * Api middleware
 */

const isApiAuthed = t.middleware(async ({ ctx, next }) => {
  if (
    ctx.headers == null ||
    ctx.headers.authorization == null ||
    ctx.headers.authorization_id == null
  ) {
    throw new TRPCError({
      message: 'no auth headers found',
      code: 'NOT_FOUND',
    });
  }
  const authorization_id: string =
    ctx.headers.authorization_id instanceof Array<string>
      ? ctx.headers.authorization_id[0]
      : ctx.headers.authorization_id;
  const api_key = ctx.headers.authorization;
  const result = await ctx.prisma.apiKey.findUnique({
    where: {
      id: authorization_id as string,
    },
    select: { user: true, key: true }, //return associated user object to detect blacklisted or not
  });
  if (result == null) {
    throw new TRPCError({
      message: 'api key invalid',
      code: 'UNAUTHORIZED',
    });
  }
  if (result.user.blacklisted) {
    throw new TRPCError({
      message: 'api key blacklisted',
      code: 'UNAUTHORIZED',
    });
  }

  // check if keys match w argon
  const dbApiKey_hashed = result.key;
  const areKeysValid = await compareKeyAgainstHash(dbApiKey_hashed, api_key);
  if (!areKeysValid) {
    throw new TRPCError({
      message: 'api key invalid',
      code: 'UNAUTHORIZED',
    });
  }

  //add token expiration check here in future (v2)

  return next({
    ctx: {},
  });
});

export const apiProcedure = t.procedure.use(sentryMiddleware).use(isApiAuthed);

export const protectedProcedure = t.procedure
  .use(sentryMiddleware)
  .use(isAuthed);
