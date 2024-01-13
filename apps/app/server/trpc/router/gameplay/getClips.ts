import { rbacProtectedProcedure } from '@server/trpc/trpc';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { serverSanitize } from '@utils/sanitize';
import { SegmentSchema } from '@utils/zod/segment';

const zodInput = z
  .object({
    gameplayId: z.string().cuid(),
  })
  .transform(input => {
    return {
      gameplayId: serverSanitize(input.gameplayId),
    };
  });

const zodOutput = SegmentSchema.array();

export default rbacProtectedProcedure(['read:all', 'read:gameplay'])
  .meta({ openapi: { method: 'GET', path: '/gameplay/clips' } })
  .input(zodInput)
  .output(zodOutput)
  .query(async ({ input, ctx }) => {
    const gameplay = await ctx.prisma.gameplay.findUnique({
      where: {
        id: input.gameplayId,
      },
      include: {
        clips: true,
      },
    });

    // if gameplay not found, or not the user who made it
    if (gameplay === null)
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Could not find that requested gameplay',
      });

    return gameplay.clips;
  });
