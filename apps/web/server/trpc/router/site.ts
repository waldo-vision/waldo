import { hasPerms, Roles, Perms } from '@server/utils/hasPerms';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';

export const siteRouter = router({
  getPageData: protectedProcedure
    .meta({ openapi: { method: 'GET', path: '/site/page' } })
    .input(
      z.object({
        pageName: z.string(),
      }),
    )
    .output(
      z.object({
        disabled: z.boolean(),
        name: z.string(),
        siteName: z.string(),
        customReason: z.string(),
        isCustomReason: z.boolean(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const pageData = await ctx.prisma.waldoPage.findFirst({
        where: {
          name: input.pageName,
        },
      });
      if (pageData == null) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Waldo Page not found in the database.',
        });
      }
      // no error checking because the docs will never be deleted.
      return pageData;
    }),
  getSiteData: protectedProcedure
    .meta({ openapi: { method: 'GET', path: '/site/site' } })
    .input(
      z.object({
        siteName: z.string(),
      }),
    )
    .output(
      z.object({
        siteName: z.string(),
        maintenance: z.boolean(),
        showLpAlert: z.boolean(),
        lpAlertTitle: z.string(),
        lpAlertDescription: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const siteData = await ctx.prisma.waldoSite.findUnique({
        where: {
          siteName: input.siteName,
        },
      });
      if (siteData == null) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Waldo Page not found in the database.',
        });
      }
      return siteData;
    }),
  updatePage: protectedProcedure
    .meta({ openapi: { method: 'POST', path: '/site/page' } })
    .input(
      z.object({
        pageName: z.string(),
        isDisabled: z.boolean(),
        isCustomReason: z.boolean(),
        customReason: z.string(),
      }),
    )
    .output(z.object({ message: z.string() }))
    .mutation(async ({ input, ctx }) => {
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

      const updatePage = await ctx.prisma.waldoPage.update({
        where: {
          name: input.pageName,
        },
        data: {
          disabled: input.isDisabled,
          isCustomReason: input.isCustomReason,
          customReason: input.customReason,
        },
      });
      if (updatePage == null) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Waldo Page not found in the database.',
        });
      }
      console.log(updatePage, '!*&!&*!&*!*&!&*&*!&*!&*!&*!&*!&*!&*');
      // no error checking because the docs will never be deleted.
      return {
        message: `Updated page ${input.pageName}'s isDisabled value to ${input.isDisabled}`,
      };
    }),
  updateSite: protectedProcedure
    .meta({ openapi: { method: 'POST', path: '/site/site' } })
    .input(
      z.object({
        isMaintenance: z.boolean(),
        showLpAlert: z.boolean(),
        lpAlertTitle: z.string(),
        lpAlertDescription: z.string(),
      }),
    )
    .output(z.object({ message: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const updateSite = await ctx.prisma.waldoSite.update({
        where: {
          siteName: 'waldo',
        },
        data: {
          maintenance: input.isMaintenance,
          showLpAlert: input.showLpAlert,
          lpAlertDescription: input.lpAlertDescription,
          lpAlertTitle: input.lpAlertTitle,
        },
      });
      if (updateSite == null) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Site not found in the database.',
        });
      }
      // no error checking because the docs will never be deleted.
      return {
        message: `Updated site.`,
      };
    }),
});
