import { rbacProtectedProcedure } from "@server/trpc/trpc";
import { TRPCError } from "@trpc/server";
import { serverSanitize } from "@utils/sanitize";
import { GameplaySchema, GameplayTypes } from "@utils/zod/gameplay";
import * as Sentry from '@sentry/nextjs';

import { z } from "zod";

const zodInput = z.object({
  gameplayId: z.string().cuid(),
  gameplayType: GameplayTypes,
  isAnalyzed: z.boolean(),
}).transform(input => {
  return {
    gameplayId: serverSanitize(input.gameplayId),
    gameplayType: input.gameplayType,
    isAnalyzed: input.isAnalyzed,
  };
});

const zodOutput = GameplaySchema;

export default rbacProtectedProcedure(["write:all", "write:gameplay", "user"])
.meta({ openapi: { method: 'PATCH', path: '/gameplay' } })
.input(zodInput)
.output(zodOutput)
.mutation(async ({ input, ctx }) => {
    try {
        const gameplay = await ctx.prisma.gameplay.findUniqueOrThrow({
            where: {
                id: input.gameplayId,
            },
        });
        
        const isUserOwner = gameplay.userId === ctx.session.user.id;
        const requiredScope = (gameplay.isAnalyzed === input.isAnalyzed) && isUserOwner ? "user" : "write:gameplay"

        if(!ctx.session.hasScope([requiredScope]))
        throw new TRPCError({
            code: 'UNAUTHORIZED',
        });

        const updatedGameplay = await ctx.prisma.gameplay.update({
            where: {
                id: input.gameplayId,
            },
            data: {
                isAnalyzed: input.isAnalyzed,
                gameplayType: input.gameplayType,
            },
        });

        return updatedGameplay;
    } catch (error) {
        // throws RecordNotFound if record not found to update
        // but can't import for some reason
        Sentry.captureException(error);

        throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'An error occurred in the server',
            // not sure if this is secure
            cause: error,
        });
    }
})