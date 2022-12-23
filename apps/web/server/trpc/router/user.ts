import { TRPCError } from '@trpc/server';
import ytdl from 'ytdl-core';
import { GameplaySchema, GameplayTypes } from '@utils/zod/gameplay';
import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';
import { UserSchema } from '@utils/zod/dash';
import { hasPerms, Perms, Roles } from '@server/utils/hasPerms';
export const userRouter = router({
  blackList: protectedProcedure
    .meta({ openapi: { method: 'PUT', path: '/user' } })
    .input(
      z.object({
        userId: z.string().cuid(),
        blacklisted: z.boolean(),
      }),
    )
    .output(z.object({ message: z.string(), blacklisted: z.boolean() }))
    .mutation(async ({ input, ctx }) => {
      if (
        !hasPerms({
          userId: ctx.session.user.id,
          userRole: ctx.session.user.role,
          requiredPerms: Perms.roleAdmin,
          blacklisted: ctx.session.user.blacklisted,
        })
      )
        throw new TRPCError({
          code: 'UNAUTHORIZED',
        });

      try {
        const userDocument = await ctx.prisma.user.update({
          where: {
            id: input.userId,
          },
          data: {
            blacklisted: input.blacklisted,
          },
        });
        return {
          message: `blacklisted field on user: ${input.userId} changed to ${input.blacklisted}.`,
          blacklisted: input.blacklisted,
        };
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An unknown error has occurred.',
          // not sure if its safe to give this to the user
          cause: error,
        });
      }
    }),
  delete: protectedProcedure
    .meta({ openapi: { method: 'DELETE', path: '/user' } })
    .input(
      z.object({
        userId: z.string().cuid(),
      }),
    )
    .output(z.object({ message: z.string() }))
    .mutation(async ({ input, ctx }) => {
      if (
        !hasPerms({
          userId: ctx.session.user.id,
          userRole: ctx.session.user.role,
          itemOwnerId: input.userId,
          requiredPerms: Perms.isOwner,
          blacklisted: ctx.session.user.blacklisted,
        })
      )
        throw new TRPCError({
          code: 'UNAUTHORIZED',
        });

      try {
        const deletUser = await ctx.prisma.user.delete({
          where: {
            id: input.userId,
          },
        });
        return {
          message: `Successfully removed user ${input.userId}.`,
        };
      } catch (error) {
        console.log(error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message:
            'An error occured while trying to delete user. Please contact support if this contiunes occuring.',
          // not sure if its safe to give this to the user
          cause: error,
        });
      }
    }),
  getLinkedAccounts: protectedProcedure
    .meta({ openapi: { method: 'GET', path: '/user/linkedaccounts' } })

    .output(
      z.array(
        z.object({
          userId: z.string().cuid(),
          provider: z.string(),
          id: z.string().cuid(),
        }),
      ),
    )
    .query(async ({ ctx }) => {
      try {
        const linkedAccounts = await ctx.prisma.account.findMany({
          where: {
            userId: ctx.session.user?.id,
          },
        });
        return linkedAccounts;
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An error occured while trying to contact the database.',
          // not sure if its safe to give this to the user
          cause: error,
        });
      }
    }),
  unlinkAccount: protectedProcedure
    .meta({ openapi: { method: 'DELETE', path: '/user/linkedaccounts' } })
    .input(
      z.object({
        accountId: z.string().cuid(),
      }),
    )
    .output(
      z.object({
        message: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const account = await ctx.prisma.account.findUnique({
        where: {
          id: input.accountId,
        },
      });

      if (
        !hasPerms({
          userId: ctx.session.user.id,
          userRole: ctx.session.user.role,
          itemOwnerId: account?.userId,
          requiredPerms: Perms.isOwner,
          blacklisted: ctx.session.user.blacklisted,
        })
      )
        throw new TRPCError({
          code: 'UNAUTHORIZED',
        });

      try {
        const deleteAccount = await ctx.prisma.account.delete({
          where: {
            id: input.accountId,
          },
        });
        return {
          message: `Successfully deleted the account with id: ${input.accountId}.`,
        };
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          // eslint-disable-next-line max-len
          message: `An error occurred while attempting to delete the account with id: ${input.accountId}.`,
          // not sure if its safe to give this to the user
          cause: error,
        });
      }
    }),
  getUsers: protectedProcedure
    .meta({ openapi: { method: 'GET', path: '/user/dash' } })
    .input(
      z.object({
        page: z.number(),
        filterRoles: z.string().nullable().optional(),
      }),
    )
    .output(z.array(UserSchema))
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

      const takeValue = 10;
      const skipValue = input.page * 10 - 10;
      if (input.filterRoles == null) {
        const userCount: number = await ctx.prisma.user.count();
        try {
          const users = await ctx.prisma.user.findMany({
            take: takeValue,
            skip: skipValue,
          });
          users.forEach((user, index) => {
            Object.assign(users[index], { userCount: userCount });
          });
          return users;
        } catch (error) {
          throw new TRPCError({
            message: 'No clip document with the UUID provided could be found.',
            code: 'NOT_FOUND',
          });
        }
      } else {
        try {
          const userCount = await ctx.prisma.user.count({
            where: {
              role: input.filterRoles,
            },
          });
          const users = await ctx.prisma.user.findMany({
            where: {
              role: input.filterRoles,
            },
            take: takeValue,
            skip: skipValue,
          });
          users.forEach((user, index) => {
            Object.assign(users[index], { userCount: userCount });
          });
          return users;
        } catch (error) {
          throw new TRPCError({
            message: 'No clip document with the UUID provided could be found.',
            code: 'NOT_FOUND',
          });
        }
      }
    }),
  updateRole: protectedProcedure
    .meta({ openapi: { method: 'PATCH', path: '/user/dash' } })
    .input(
      z.object({
        role: z.string(),
        userId: z.string().cuid(),
      }),
    )
    .output(UserSchema)
    .mutation(async ({ input, ctx }) => {
      if (
        !hasPerms({
          userId: ctx.session.user.id,
          userRole: ctx.session.user.role,
          requiredPerms: Perms.roleAdmin,
          blacklisted: ctx.session.user.blacklisted,
        })
      )
        throw new TRPCError({
          code: 'UNAUTHORIZED',
        });
      try {
        const users = await ctx.prisma.user.update({
          where: {
            id: input.userId,
          },
          data: {
            role: input.role,
          },
        });
        return users;
      } catch (error) {
        throw new TRPCError({
          message: 'No clip document with the UUID provided could be found.',
          code: 'NOT_FOUND',
        });
      }
    }),
  search: protectedProcedure
    .meta({ openapi: { method: 'GET', path: '/user/search' } })
    .input(
      z.object({
        name: z.string().nullable(),
      }),
    )
    .output(UserSchema)
    .query(async ({ input, ctx }) => {
      console.log(ctx.session);
      if (
        !hasPerms({
          userId: ctx.session.user.id,
          userRole: ctx.session.user.role,
          requiredPerms: Perms.roleAdmin,
          blacklisted: ctx.session.user.blacklisted,
        })
      )
        throw new TRPCError({
          code: 'UNAUTHORIZED',
        });
      try {
        const user = await ctx.prisma.user.findFirst({
          where: {
            name: {
              contains: input.name,
            },
          },
        });
        return user;
      } catch (error) {
        throw new TRPCError({
          message: 'No user document with the name provided could be found.',
          code: 'NOT_FOUND',
        });
      }
    }),
});
