import { z } from 'zod';

import { protectedProcedure, router } from '../trpc';
import { TRPCError } from '@trpc/server';
import { hasPerms, Perms } from '@server/utils/hasPerms';
import { KeySchema } from '@utils/zod/apiKey';
import { genApiKey, genSecretHash } from '@utils/helpers/apiHelper';
import { ApiKeyState } from 'database';
import * as Sentry from '@sentry/nextjs';
export const apiKeyRouter = router({
  get: protectedProcedure
    .meta({ openapi: { method: 'GET', path: '/api/key' } })
    .input(
      z.object({
        keyId: z.string().cuid(),
      }),
    )
    .output(KeySchema)
    .query(async ({ input, ctx }) => {
      if (
        !hasPerms({
          userId: ctx.session.user.id,
          userRole: ctx.session.user.role,
          requiredPerms: Perms.roleMod,
          blacklisted: ctx.session.user.blacklisted,
        })
      )
        throw new TRPCError({
          code: 'UNAUTHORIZED',
        });

      try {
        const apiKey = await ctx.prisma.apiKey.findFirst({
          where: {
            id: input.keyId,
          },
        });

        // so the trpc error is thrown
        if (apiKey === null) throw new Error('no api key found.');

        return apiKey;
      } catch (error) {
        Sentry.captureException(error);
        throw new TRPCError({
          message: 'No apikey with the provided id could be found.',
          code: 'NOT_FOUND',
        });
      }
    }),
  getUserApiKeys: protectedProcedure
    .meta({ openapi: { method: 'GET', path: '/api/key/user' } })
    .input(
      z.object({
        userId: z.string().cuid(),
      }),
    )
    .output(z.array(KeySchema))
    .query(async ({ input, ctx }) => {
      if (
        !hasPerms({
          userId: ctx.session.user.id,
          userRole: ctx.session.user.role,
          requiredPerms: Perms.roleMod,
          blacklisted: ctx.session.user.blacklisted,
        })
      )
        throw new TRPCError({
          code: 'UNAUTHORIZED',
        });

      try {
        const apiKey = await ctx.prisma.apiKey.findMany({
          where: {
            keyOwnerId: input.userId,
          },
        });

        // so the trpc error is thrown
        if (apiKey === null)
          throw new Error(
            'No api keys could be found that were related to the user.',
          );

        return apiKey;
      } catch (error) {
        Sentry.captureException(error);
        throw new TRPCError({
          message: 'No api keys could be found that were related to the user.',
          code: 'NOT_FOUND',
        });
      }
    }),
  create: protectedProcedure
    .meta({ openapi: { method: 'POST', path: '/api/key' } })
    .input(
      z.object({
        userId: z.string().cuid(),
        name: z.string(),
      }),
    )
    .output(KeySchema)
    .mutation(async ({ input, ctx }) => {
      if (
        !hasPerms({
          userId: ctx.session.user.id,
          userRole: ctx.session.user.role,
          requiredPerms: Perms.roleMod,
          blacklisted: ctx.session.user.blacklisted,
        })
      )
        throw new TRPCError({
          code: 'UNAUTHORIZED',
        });

      try {
        const clientKey = genApiKey();
        const serverHashedKey = await genSecretHash(clientKey);
        const apiKey = await ctx.prisma.apiKey.create({
          data: {
            keyOwnerId: input.userId,
            name: input.name,
            key: serverHashedKey,
            state: ApiKeyState.ACTIVE,
          },
        });

        // so the trpc error is thrown
        if (apiKey === null)
          throw new Error('An error occured creating the key.');

        // add clientKey to the final output object.
        Object.assign(apiKey, { clientKey: clientKey });
        return apiKey;
      } catch (error) {
        throw new TRPCError({
          message: 'An error occured creating the key.',
          code: 'NOT_FOUND',
        });
      }
    }),
  delete: protectedProcedure
    .meta({ openapi: { method: 'DELETE', path: '/api/key' } })
    .input(
      z.object({
        id: z.string().cuid(),
      }),
    )
    .output(z.object({ msg: z.string() }))
    .mutation(async ({ input, ctx }) => {
      if (
        !hasPerms({
          userId: ctx.session.user.id,
          userRole: ctx.session.user.role,
          requiredPerms: Perms.roleMod,
          blacklisted: ctx.session.user.blacklisted,
        })
      )
        throw new TRPCError({
          code: 'UNAUTHORIZED',
        });

      try {
        const apiKey = await ctx.prisma.apiKey.delete({
          where: {
            id: input.id,
          },
        });

        // so the trpc error is thrown
        if (apiKey === null)
          throw new Error('An error occured deleting the key.');

        return { msg: 'Successfully deleted the api key.' };
      } catch (error) {
        throw new TRPCError({
          message: 'An error occured deleting the key.',
          code: 'NOT_FOUND',
        });
      }
    }),
});
