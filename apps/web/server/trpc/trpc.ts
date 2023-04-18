import { initTRPC, TRPCError } from '@trpc/server';
import superjson from 'superjson';
import { OpenApiMeta } from 'trpc-openapi';
import { type Context } from './context';
// import * as Sentry from '@sentry/nextjs';
import * as Sentry from '@sentry/nextjs';

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
  if (!ctx.session || !ctx.session.user)
    throw new TRPCError({ code: 'UNAUTHORIZED' });

  if (ctx.session.user.blacklisted) throw new TRPCError({ code: 'FORBIDDEN' });

  // set the user on the sentry scope
  // so we can track effected users
  Sentry.getCurrentHub().getScope().setUser({ id: ctx.session.user.id });

  return next({
    ctx: {
      // infers the `session` as non-nullable
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});

/**
 * Protected procedure
 **/
export const protectedProcedure = t.procedure
  .use(sentryMiddleware)
  .use(isAuthed);
