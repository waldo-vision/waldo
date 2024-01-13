import { rbacProtectedProcedure } from "@server/trpc/trpc";
import { TRPCError } from "@trpc/server";
import { serverSanitize } from "@utils/sanitize";
import { GameplaySchema } from '@utils/zod/gameplay';
import { z } from 'zod';

const zodInput = z.object({
  gameplayId: z.string().cuid(),
}).transform(input => {
  return {
    gameplayId: serverSanitize(input.gameplayId),
  };
});

const zodOutput = GameplaySchema;

//TODO: find a way to still have RBAC and have the user be able to read their own gameplay data, I'll think about it.
export default rbacProtectedProcedure(["read:all", "read:gameplay"])
.meta({ openapi: { method: 'GET', path: '/gameplay' } })
.input(zodInput)
.output(zodOutput)
.query(async ({ input, ctx }) => {
  const gameplay = await ctx.prisma.gameplay.findUnique({
    where: {
      id: input.gameplayId,
    }
  });
  // if gameplay not found, or not the user who made it
  if (gameplay === null)
  throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'Could not find that requested gameplay',
  });

  return gameplay;
});