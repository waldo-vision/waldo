import { rbacProtectedProcedure } from "@server/trpc/trpc";
import { TRPCError } from "@trpc/server";
import * as Sentry from '@sentry/nextjs';
import { GameplayTypes, GameplaysDashSchema } from '@utils/zod/gameplay';

import { z } from 'zod';

const zodInput = z.object({
    page: z.number(),
    filterGames: GameplayTypes.optional(),
});

const zodOutput = z.array(GameplaysDashSchema);

export default rbacProtectedProcedure(["read:all", "read:gameplay"])
.meta({ openapi: { method: 'GET', path: '/gameplay/dash' } })
.input(zodInput)
.output(zodOutput)
.query(async ({ input, ctx }) => {
    const takeValue = 10;
    const skipValue = input.page * 10 - 10;
    if (input.filterGames == null) {
        const gameplayCount: number = await ctx.prisma.gameplay.count();
        try {
            const gameplays = await ctx.prisma.gameplay.findMany({
            take: takeValue,
            skip: skipValue,
            include: {
                user: true,
            },
            });
            gameplays.forEach((gameplay, index: number) => {
            Object.assign(gameplays[index], { gameplayCount: gameplayCount });
            });
            return gameplays;
        } catch (error) {
            Sentry.captureException(error);
            throw new TRPCError({
            message: 'No footage with the inputs provided could be found.',
            code: 'NOT_FOUND',
            });
        }
    } else {
        try {
            const gameplayCount = await ctx.prisma.gameplay.count({
                where: {
                    gameplayType: input.filterGames,
                },
            });
            const gameplays = await ctx.prisma.gameplay.findMany({
                where: {
                    gameplayType: input.filterGames,
                },
                include: {
                    user: true,
                },
                take: takeValue,
                skip: skipValue,
            });
            gameplays.forEach((gameplay, index: number) => {
                Object.assign(gameplays[index], { gameplayCount: gameplayCount });
            });
            return gameplays;
        } catch (error) {
            Sentry.captureException(error);
            throw new TRPCError({
            message: 'No footage with the inputs provided could be found.',
            code: 'NOT_FOUND',
            });
        }
    }
});