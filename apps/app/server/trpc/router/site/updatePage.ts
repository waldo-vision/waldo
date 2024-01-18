import { rbacProtectedProcedure } from '@server/trpc/trpc';
import { TRPCError } from '@trpc/server';
import { serverSanitize } from '@utils/sanitize';
import { z } from 'zod';

const zodInput = z
  .object({
    name: z.string(),
    maintenance: z.boolean(),
    isCustomAlert: z.boolean(),
    alertTitle: z.string().nullable(),
    alertDescription: z.string().nullable(),
  })
  .transform(input => {
    return {
      name: serverSanitize(input.name),
      maintenance: input.maintenance,
      isCustomAlert: input.isCustomAlert,
      alertTitle:
        input.alertTitle === null ? null : serverSanitize(input.alertTitle),
      alertDescription:
        input.alertDescription === null
          ? null
          : serverSanitize(input.alertDescription),
    };
  });

const zodOutput = z.object({ message: z.string() });

export default rbacProtectedProcedure([
  'write:all',
  'write:pagemetadata',
  'admin',
])
  .meta({ openapi: { method: 'POST', path: '/site/page' } })
  .input(zodInput)
  .output(zodOutput)
  .mutation(async ({ input, ctx }) => {
    try {
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
          message: 'Waldo Vision Page not found in the database.',
        });
      }
      // no error checking because the docs will never be deleted.
      return {
        message: `Updated page ${input.name}'s maintenance value to ${input.maintenance}`,
      };
    } catch (error) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An error occured while executing a query.',
      });
    }
  });
