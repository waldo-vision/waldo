import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';

export const siteRouter = router({
  isPageDisabled: protectedProcedure
    .meta({ openapi: { method: 'GET', path: '/site' } })
    .input(
      z.object({
        pageName: z.string(),
      }),
    )
    .output(z.object({ isDisabled: z.boolean() }))
    .query(async ({ input, ctx }) => {
      const isPageDisabled = await ctx.prisma.waldoPage.findUnique({
        where: {
          name: input.pageName,
        },
      });
      if (isPageDisabled == null) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Waldo Page not found in the database.',
        });
      }
      // no error checking because the docs will never be deleted.
      return { isDisabled: isPageDisabled.disabled };
    }),
  updatePage: protectedProcedure
    .meta({ openapi: { method: 'PUT', path: '/site' } })
    .input(
      z.object({
        pageName: z.string(),
        isDisabled: z.boolean(),
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
