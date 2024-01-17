import { publicProcedure } from '../../trpc';
import { z } from 'zod';
import { serverSanitize } from '@utils/sanitize';
import { TRPCError } from '@trpc/server';
const zodInput = z
  .object({
    name: z.string(),
  })
  .transform(input => {
    return {
      name: serverSanitize(input.name),
    };
  });

const zodOutput = z.object({
  maintenance: z.boolean(),
  name: z.string(),
  parentName: z.string(),
  alertDescription: z.string().nullable(),
  alertTitle: z.string().nullable(),
  isCustomAlert: z.boolean(),
});

export default publicProcedure
  .meta({ openapi: { method: 'GET', path: '/site/page' } })
  .input(zodInput)
  .output(zodOutput)
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
