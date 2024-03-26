import { rbacProtectedProcedure } from '@server/trpc/trpc';
import { TRPCError } from '@trpc/server';
import * as Sentry from '@sentry/nextjs';
import { serverSanitize } from '@utils/sanitize';
import { ClipSchema } from '@utils/zod/clip';
import { z } from 'zod';
export default rbacProtectedProcedure([
  'moderator',
  'write:clip',
  'read:gameplay',
])
  .meta({ openapi: { method: 'POST', path: '/clip' } })
  .input(
    z
      .object({
        gameplayId: z.string().cuid(),
      })
      .transform(input => {
        return {
          gameplayId: serverSanitize(input.gameplayId),
        };
      }),
  )
  .output(ClipSchema)
  .mutation(async ({ input, ctx }) => {
    try {
      const clip = await ctx.prisma.clip.create({
        data: {
          gameplay: {
            connect: {
              userId: ctx.session.user.id,
              id: input.gameplayId,
            },
          },
        },
      });
      return clip;
    } catch (error) {
      Sentry.captureException(error);
      throw new TRPCError({
        message: `Unable to create a clip.`,
        code: 'INTERNAL_SERVER_ERROR',
      });
    }
  });
