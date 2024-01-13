import { rbacProtectedProcedure } from "@server/trpc/trpc";
import { TRPCError } from "@trpc/server";
import { serverSanitize } from "@utils/sanitize";
import { GameplaySchema } from "@utils/zod/gameplay";
import { z } from "zod";

const zodInput = z.object({
    userId: z.string().cuid().optional(),
}).transform(input => {
    return {
    userId:
        input.userId === null || input.userId === undefined
        ? input.userId
        : serverSanitize(input.userId),
    };
});

const zodOutput = GameplaySchema.array();

//TODO: find a way to still have RBAC and have the user be able to read their own gameplay data, I'll think about it.
export default rbacProtectedProcedure(["user"])
.meta({ openapi: { method: 'GET', path: '/gameplay/user' } })
.input(zodInput)
.output(zodOutput)
.query(async ({ input, ctx }) => {
    const doesUserHaveRequiredScope = ctx.session.hasScope(["read:users"]);
    if(!doesUserHaveRequiredScope && input.userId) input.userId = ctx.session.user.id;
    // if no user id provided, use user id from session
    // userId should only be passed by system admins, not avg users
    const userId =
    input.userId === undefined ? ctx.session.user.id : input.userId;

    const user = await ctx.prisma.user.findUnique({
        where: {
            id: userId,
        },
        include: {
            gameplay: true,
        },
    });

    // if no user
    if (user === null)
    throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'No user found with the provided ID.',
    });

    return user.gameplay;
});