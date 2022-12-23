import { z } from 'zod';
import { ClipSchema } from '@utils/zod/clip';

import { protectedProcedure, router } from '../trpc';
import { TRPCError } from '@trpc/server';
import { hasPerms, Perms, Roles } from '@server/utils/hasPerms';

export const clipRouter = router({
  get: protectedProcedure
    .meta({ openapi: { method: 'GET', path: '/clip' } })
    .input(
      z.object({
        clipId: z.string().uuid().optional(),
      }),
    )
    .output(ClipSchema)
    .query(async ({ input, ctx }) => {
      if (
        !hasPerms({
          userId: ctx.session.user.id,
          userRole: ctx.session.user.role,
          requiredPerms: Perms.roleMod,
          // when this api is used check for owner
          // itemOwnerId: clip.footage.userId,
          blacklisted: ctx.session.user.blacklisted,
        })
      )
        throw new TRPCError({
          code: 'UNAUTHORIZED',
        });

      try {
        const clip = await ctx.prisma.clip.findUnique({
          where: {
            id: input.clipId,
          },
          include: {
            footage: true,
          },
        });

        // so the trpc error is thrown
        if (clip === null) throw new Error('no clip');

        return clip;
      } catch (error) {
        throw new TRPCError({
          message: 'No clip with the provided id could be found.',
          code: 'NOT_FOUND',
        });
      }
    }),
  delete: protectedProcedure
    .meta({ openapi: { method: 'DELETE', path: '/clip' } })
    .input(
      z.object({
        clipId: z.string().uuid().optional(),
      }),
    )
    .output(z.object({ message: z.string() }))
    .mutation(async ({ input, ctx }) => {
      if (
        !hasPerms({
          userId: ctx.session.user.id,
          userRole: ctx.session.user.role,
          requiredPerms: Perms.roleMod,
          // when this api is used check for owner
          // itemOwnerId: clip.footage.userId,
          blacklisted: ctx.session.user.blacklisted,
        })
      )
        throw new TRPCError({
          code: 'UNAUTHORIZED',
        });

      try {
        const result = await ctx.prisma.clip.delete({
          where: {
            id: input.clipId,
          },
        });
        return {
          message: `Clip with uuid: ${result.id} was deleted successfully.`,
        };
      } catch (error) {
        throw new TRPCError({
          message: 'No clip with the provided id could be found.',
          code: 'NOT_FOUND',
        });
      }
    }),
  create: protectedProcedure
    .meta({ openapi: { method: 'POST', path: '/clip' } })
    .input(
      z.object({
        footageId: z.string().uuid(),
      }),
    )
    .output(ClipSchema)
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
        const clip = await ctx.prisma.clip.create({
          data: {
            footageId: input.footageId,
          },
        });
        return clip;
      } catch (error) {
        throw new TRPCError({
          message: `Unable to create a clip.`,
          code: 'INTERNAL_SERVER_ERROR',
        });
      }
    }),
});
