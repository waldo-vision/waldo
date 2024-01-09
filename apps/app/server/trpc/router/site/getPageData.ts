import { rbacProtectedProcedure } from '../../trpc';
import { z } from 'zod';
import { serverSanitize } from '@utils/sanitize';
import { TRPCError } from '@trpc/server';

export default rbacProtectedProcedure(["read:all", "read:pagemetadata"])
    .meta({ openapi: { method: 'GET', path: '/site/page' } })
    .input(
      z
        .object({
          name: z.string(),
        })
        .transform(input => {
          return {
            name: serverSanitize(input.name),
          };
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
          message: 'Waldo Vision Page not found in the database.',
        });
      }
      // no error checking because the docs will never be deleted.
      return pageData;
    });