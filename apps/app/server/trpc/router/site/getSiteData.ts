import { publicProcedure,  } from '../../trpc';
import { z } from 'zod';
import { serverSanitize } from '@utils/sanitize';
import { TRPCError } from '@trpc/server';

const zodInput = z.object({
    siteName: z.string(),
}).transform(input => {
    return {
        siteName: serverSanitize(input.siteName),
    };
});
const zodOutput = z.object({
    name: z.string(),
    maintenance: z.boolean(),
    isCustomAlert: z.boolean(),
    alertTitle: z.string().nullable(),
    alertDescription: z.string().nullable(),
});


export default publicProcedure
.meta({ openapi: { method: 'GET', path: '/site/site' } })
.input(zodInput)
.output(zodOutput)
.query(async ({ input, ctx }) => {
  const siteData = await ctx.prisma.waldoSite.findUnique({
    where: {
      name: input.siteName,
    },
  });
  if (siteData == null) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'Waldo Vision Page not found in the database.',
    });
  }
  return siteData;
});