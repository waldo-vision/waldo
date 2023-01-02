import { hasPerms, Perms } from '@server/utils/hasPerms';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';

export const siteRouter = router({
  getPageData: protectedProcedure
    .meta({ openapi: { method: 'GET', path: '/site/page' } })
    .input(
      z.object({
        name: z.string(),
      }),
    )
    .output(
      z.object({
        maintenance: z.boolean(),
        name: z.string(),
        parentName: z.string(),
        alertDescription: z.string().nullable(),
        alertTitle: z.string().nullable(),
        isCustomAlert: z.boolean(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const pageData = await ctx.prisma.waldoPage.findFirst({
        where: {
          name: input.name,
        },
      });
      if (pageData == null) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'WALDO Page not found in the database.',
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
        name: z.string(),
        maintenance: z.boolean(),
        isCustomAlert: z.boolean(),
        alertTitle: z.string().nullable(),
        alertDescription: z.string().nullable(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const siteData = await ctx.prisma.waldoSite.findUnique({
        where: {
          name: input.siteName,
        },
      });
      if (siteData == null) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'WALDO Page not found in the database.',
        });
      }
      return siteData;
    }),
  updatePage: protectedProcedure
    .meta({ openapi: { method: 'POST', path: '/site/page' } })
    .input(
      z.object({
        name: z.string(),
        maintenance: z.boolean(),
        isCustomAlert: z.boolean(),
        alertTitle: z.string().nullable(),
        alertDescription: z.string().nullable(),
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
          name: input.name,
        },
        data: {
          maintenance: input.maintenance,
          isCustomAlert: input.isCustomAlert,
          alertTitle: input.alertTitle,
          alertDescription: input.alertDescription,
        },
      });
      if (updatePage == null) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'WALDO Page not found in the database.',
        });
      }
      // no error checking because the docs will never be deleted.
      return {
        message: `Updated page ${input.name}'s maintenance value to ${input.maintenance}`,
      };
    }),
  updateSite: protectedProcedure
    .meta({ openapi: { method: 'POST', path: '/site/site' } })
    .input(
      z.object({
        maintenance: z.boolean(),
        isCustomAlert: z.boolean(),
        alertTitle: z.string().nullable(),
        alertDescription: z.string().nullable(),
      }),
    )
    .output(z.object({ message: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const updateSite = await ctx.prisma.waldoSite.update({
        where: {
          name: 'waldo',
        },
        data: {
          maintenance: input.maintenance,
          isCustomAlert: input.isCustomAlert,
          alertDescription: input.alertDescription,
          alertTitle: input.alertTitle,
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
