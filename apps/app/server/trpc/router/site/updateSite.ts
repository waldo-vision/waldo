import { rbacProtectedProcedure } from '@server/trpc/trpc';
import { TRPCError } from '@trpc/server';
import { serverSanitize } from '@utils/sanitize';
import { z } from 'zod';

const zodInput = z
  .object({
    maintenance: z.boolean(),
    isCustomAlert: z.boolean(),
    alertTitle: z.string().nullable(),
    alertDescription: z.string().nullable(),
  })
  .transform(input => {
    return {
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

export default rbacProtectedProcedure(['write:all', 'write:sitemetadata'])
  .meta({ openapi: { method: 'POST', path: '/site/site' } })
  .input(zodInput)
  .output(zodOutput)
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
  });
