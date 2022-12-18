import { initTRPC, TRPCError } from '@trpc/server';
import superjson from 'superjson';
import { OpenApiMeta } from 'trpc-openapi';
import { Ratelimit } from '@upstash/ratelimit';
import { type Context } from './context';
import { Session } from 'next-auth';
import { Prisma, PrismaClient } from 'database';
import { redisClient } from '@server/utils/redisClient';
import RateLimiter from 'async-ratelimiter';

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

/**
 * Unprotected procedure
 **/
export const publicProcedure = t.procedure;

/**
 * Reusable middleware to ensure
 * users are logged in
 * rate limit middleware
 */
const isAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({
    ctx: {
      // infers the `session` as non-nullable
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});

const rateLimit = t.middleware(async ({ ctx, next }) => {
  return next({
    ctx: {
      // infers the `session` as non-nullable
      session: { ...ctx.session, user: ctx.session?.user },
    },
  });
});

/**
 * Protected procedure
 **/
export const protectedProcedure = t.procedure.use(isAuthed);
