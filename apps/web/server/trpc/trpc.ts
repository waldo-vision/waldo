import { initTRPC, TRPCError } from '@trpc/server';
import superjson from 'superjson';
import { OpenApiMeta } from 'trpc-openapi';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis, Requester } from '@upstash/redis';
import { type Context } from './context';
import { Session } from 'next-auth';
import { Prisma, PrismaClient } from 'database';
const redis = new Redis({
  url: `${process.env.UPSTASH_REST_URL}`,
  token: `${process.env.UPSTASH_REST_SECRET}`,
});
type RLType =
  | `${number} ms`
  | `${number} s`
  | `${number} m`
  | `${number} h`
  | `${number} d`;

const ratelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.fixedWindow(
    process.env.RATELIMIT_REQUESTS as unknown as number,
    process.env.RATELIMIT_TIME as unknown as RLType,
  ),
});

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
  var identity = ctx.session?.user?.id?.toString();
  if (!identity) throw new TRPCError({ code: 'NOT_FOUND' });
  var rate = await ratelimit.limit(identity);
  if (!rate.success) {
    throw new TRPCError({ code: 'TOO_MANY_REQUESTS' });
  }
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
export const protectedProcedure = t.procedure.use(isAuthed).use(rateLimit);
