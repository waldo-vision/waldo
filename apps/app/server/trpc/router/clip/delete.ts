import { rbacProtectedProcedure } from '@server/trpc/trpc';
import { TRPCError } from '@trpc/server';
import * as Sentry from '@sentry/nextjs';
import { z } from 'zod';
import { serverSanitize } from '@utils/sanitize';
export default rbacProtectedProcedure([
  'moderator',
  'write:clip',
  'read:gameplay',
])
  .meta({ openapi: { method: 'DELETE', path: '/clip' } })
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
  .output(z.object({ message: z.string() }))
  .mutation(async ({ input, ctx }) => {
    try {
      const result = await ctx.prisma.clip.delete({
        where: {
          id: input.clipId,
          gameplay: {
            userId: ctx.session.user.id,
          },
        },
      });
      return {
        message: `Clip with cuid: ${result.id} was deleted successfully.`,
      };
    } catch (error) {
      Sentry.captureException(error);
      throw new TRPCError({
        message: 'No clip with the provided id could be found.',
        code: 'NOT_FOUND',
      });
    }
  });
