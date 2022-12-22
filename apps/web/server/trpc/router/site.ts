import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';

export const siteRouter = router({
  getPageData: protectedProcedure
    .meta({ openapi: { method: 'GET', path: '/site' } })
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
      const pageData = await ctx.prisma.waldoPage.findUnique({
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
      console.log(pageData);
      // no error checking because the docs will never be deleted.
      return pageData;
    }),
  updatePage: protectedProcedure
    .meta({ openapi: { method: 'PUT', path: '/site' } })
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
      // no error checking because the docs will never be deleted.
      return {
        message: `Updated page ${input.pageName}'s isDisabled value to ${input.isDisabled}`,
      };
    }),
});
