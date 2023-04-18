import { initTRPC, TRPCError } from '@trpc/server';
import superjson from 'superjson';
import { OpenApiMeta } from 'trpc-openapi';
import { type Context } from './context';
import { genSecretHash } from '@server/utils/apiHelper';

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
const isAuthed = t.middleware(async ({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user)
    throw new TRPCError({ code: 'UNAUTHORIZED' });

  if (ctx.session.user.blacklisted) throw new TRPCError({ code: 'FORBIDDEN' });

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

/**
 * Api middleware
 */

const isApiAuthed = t.middleware(async ({ ctx, next }) => {
  if (ctx.headers == null || ctx.headers.authorization == null) {
    throw new TRPCError({
      message: 'no auth headers found',
      code: 'NOT_FOUND',
    });
  }
  const id = await genSecretHash(ctx.headers.authorization);
  const result = await ctx.prisma.apiKey.findUnique({
    where: {
      id: id,
    },
    select: { user: true }, //return associated user object
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
      code: 'FORBIDDEN',
    });
  }
  //add token expiration check here in future (v2)

  return next({
    ctx: {},
  });
});

export const protectedProcedure = t.procedure.use(isAuthed);
export const apiProcedure = t.procedure.use(isApiAuthed);
