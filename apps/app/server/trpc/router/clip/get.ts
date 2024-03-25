import { rbacProtectedProcedure } from '@server/trpc/trpc';
import { TRPCError } from '@trpc/server';
import { serverSanitize } from '@utils/sanitize';
import { ClipSchema } from '@utils/zod/clip';
import { z } from 'zod';
import * as Sentry from '@sentry/nextjs';

export default rbacProtectedProcedure([
  'moderator',
  'read:clip',
  'read:gameplay',
])
  .meta({ openapi: { method: 'GET', path: '/clip' } })
  .input(
    z
      .object({
        clipId: z.string().cuid().optional(),
      })
      .transform(input => {
        return {
          clipId:
            input.clipId === undefined
              ? input.clipId
              : serverSanitize(input.clipId),
        };
      }),
  )
  .output(ClipSchema)
  .query(async ({ input, ctx }) => {
    try {
      const clip = await ctx.prisma.clip.findUnique({
        where: {
          id: input.clipId,
          gameplay: {
            userId: ctx.session.user.id,
          },
        },
        include: {
          gameplay: true,
        },
      });

      // so the trpc error is thrown
      if (clip === null) throw new Error('no clip');

      return clip;
    } catch (error) {
      Sentry.captureException(error);
      throw new TRPCError({
        message: 'No clip with the provided id could be found.',
        code: 'NOT_FOUND',
      });
    }
  });
