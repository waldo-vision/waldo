import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';
import { UserSchema, UsersSchema } from '@utils/zod/dash';
import { hasPerms, Perms } from '@server/utils/hasPerms';
import type { Roles, User } from 'database';
import { serverSanitize } from '@utils/sanitize';
import * as Sentry from '@sentry/nextjs';
export const userRouter = router({
  blackList: protectedProcedure
    .input(
      z
        .object({
          userId: z.string().cuid(),
          blacklisted: z.boolean(),
        })
        .transform(input => {
          return {
            userId: serverSanitize(input.userId),
            blacklisted: input.blacklisted,
          };
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
        Sentry.captureException(error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An unknown error has occurred.',
          // not sure if its safe to give this to the user
          cause: error,
        });
      }
    }),
  delete: protectedProcedure
    .input(
      z
        .object({
          userId: z.string().cuid(),
        })
        .transform(input => {
          return {
            userId: serverSanitize(input.userId),
          };
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
        Sentry.captureException(error);
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
    .input(z.void())
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
      // no need for security check here as you can only get your own linked accounts

      try {
        const linkedAccounts = await ctx.prisma.account.findMany({
          where: {
            userId: ctx.session.user?.id,
          },
        });
        return linkedAccounts;
      } catch (error) {
        Sentry.captureException(error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An error occured while trying to contact the database.',
          // not sure if its safe to give this to the user
          cause: error,
        });
      }
    }),
  unlinkAccount: protectedProcedure
    .input(
      z
        .object({
          accountId: z.string().cuid(),
        })
        .transform(input => {
          return {
            accountId: serverSanitize(input.accountId),
          };
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
        Sentry.captureException(error);
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
    .input(
      z
        .object({
          page: z.number(),
          filterRoles: z.string().optional(),
        })
        .transform(input => {
          return {
            page: input.page,
            filterRoles:
              input.filterRoles === null || input.filterRoles === undefined
                ? input.filterRoles
                : serverSanitize(input.filterRoles),
          };
        }),
    )
    .output(z.object({ users: UsersSchema, userCount: z.number() }))
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

      // Check that skip value is in valid range
      if (skipValue < 0) {
        throw new TRPCError({
          message: `Invalid page number "${input.page}"`,
          code: 'BAD_REQUEST',
        });
      }

      if (input.filterRoles == null) {
        const userCount: number = await ctx.prisma.user.count();
        try {
          const users = await ctx.prisma.user.findMany({
            take: takeValue,
            skip: skipValue,
          });
          return { users, userCount };
        } catch (error) {
          Sentry.captureException(error);
          throw new TRPCError({
            message: 'No user with the CUID provided could be found.',
            code: 'NOT_FOUND',
          });
        }
      } else {
        try {
          const userCount = await ctx.prisma.user.count({
            where: {
              role: input.filterRoles as Roles,
            },
          });
          const users = await ctx.prisma.user.findMany({
            where: {
              role: input.filterRoles as Roles,
            },
            take: takeValue,
            skip: skipValue,
          });
          return { users, userCount };
        } catch (error) {
          Sentry.captureException(error);
          throw new TRPCError({
            message: 'No user with the CUID provided could be found.',
            code: 'NOT_FOUND',
          });
        }
      }
    }),
  updateRole: protectedProcedure
    .input(
      z
        .object({
          role: z.string(),
          userId: z.string().cuid(),
        })
        .transform(input => {
          return {
            role: serverSanitize(input.role),
            userId: serverSanitize(input.userId),
          };
        }),
    )
    .output(z.object({ message: z.string() }))
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
            role: input.role as Roles,
          },
        });
        return { message: 'success' };
      } catch (error) {
        Sentry.captureException(error);
        throw new TRPCError({
          message: 'No clip document with the CUID provided could be found.',
          code: 'NOT_FOUND',
        });
      }
    }),
  search: protectedProcedure
    .input(
      z
        .object({
          name: z.string().optional(),
        })
        .transform(input => {
          return {
            name:
              input.name === null
                ? input.name
                : serverSanitize(input.name as string),
          };
        }),
    )
    .output(UserSchema.array())
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
      if (input.name == undefined) throw new TRPCError({ code: 'BAD_REQUEST' });
      try {
        const users = await ctx.prisma.user.findMany({
          where: {
            OR: [
              {
                name: {
                  contains: input.name,
                  mode: 'insensitive',
                },
              },
              {
                email: {
                  contains: input.name,
                  mode: 'insensitive',
                },
              },
            ],
          },
        });
        if (users == null) {
          throw new TRPCError({ code: 'NOT_FOUND' });
        }
        return users;
      } catch (error) {
        Sentry.captureException(error);
        throw new TRPCError({
          message: 'No user document with the name provided could be found.',
          code: 'NOT_FOUND',
        });
      }
    }),
});
