import { Request, Response } from 'express';
import { v4 as uuidv4, validate } from 'uuid';
import { z } from 'zod';
import { ClipZodSchema, ClipRetrieveSchema } from '@utils/zod/clip';

import { protectedProcedure, router } from '../trpc';
import { TRPCError } from '@trpc/server';

export const clipRouter = router({
  getClip: protectedProcedure
    .meta({ openapi: { method: 'GET', path: '/clip' } })
    .input(
      z.object({
        uuid: z.string().uuid().optional(),
      }),
    )
    .output(ClipRetrieveSchema)
    .query(async ({ input, ctx }) => {
      const uuid = input.uuid;
      const clipResult: any[] = [];
      try {
        const clip = await ctx.prisma.clip.findUnique({
          where: {
            id: uuid,
          },
        });
        return { clips: clipResult };
      } catch (error) {
        throw new TRPCError({
          message: 'No clip document with the UUID provided could be found.',
          code: 'NOT_FOUND',
        });
      }
    }),
  deleteClip: protectedProcedure
    .meta({ openapi: { method: 'DELETE', path: '/clip' } })
    .input(
      z.object({
        uuid: z.string().uuid().optional(),
      }),
    )
    .output(z.object({ message: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const uuid = input.uuid;
      try {
        const deleteResult = await ctx.prisma.clip.delete({
          where: {
            id: uuid,
          },
        });
        return { message: `Clip with uuid: ${uuid} was deleted successfully.` };
      } catch (error) {
        throw new TRPCError({
          message: `Couldn't find the clip associated with uuid ${uuid}.`,
          code: 'NOT_FOUND',
        });
      }
    }),
  createClip: protectedProcedure
    .meta({ openapi: { method: 'POST', path: '/clip' } })
    .input(
      z.object({
        uuid: z.string().uuid(),
      }),
    )
    .output(ClipZodSchema)
    .mutation(async ({ input, ctx }) => {
      const uniqueId = uuidv4();
      try {
        const createClip = await ctx.prisma.clip.create({
          data: {
            id: uniqueId,
            footageId: input.uuid,
          },
        });
        return { uuid: uniqueId };
      } catch (error) {
        throw new TRPCError({
          message: `Unable to create a clip document.`,
          code: 'INTERNAL_SERVER_ERROR',
        });
      }
    }),
});
