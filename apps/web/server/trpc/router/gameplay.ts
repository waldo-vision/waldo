import { TRPCError } from '@trpc/server';
import ytdl from 'ytdl-core';
import { GameplaySchema, GameplayTypes } from '@utils/zod/gameplay';
import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';
import { SegmentSchema } from '@utils/zod/segment';

export const gameplayRouter = router({
  getGameplay: protectedProcedure
    .meta({ openapi: { method: 'GET', path: '/gameplay' } })
    .input(
      z.object({
        gameplayId: z.string().cuid(),
      }),
    )
    .output(GameplaySchema)
    .query(async ({ input, ctx }) => {
      const gameplay = await ctx.prisma.footage.findUnique({
        where: {
          id: input.gameplayId,
        },
      });

      // if gameplay not found, or not the user who made it
      // TODO: need to do role checking
      if (
        gameplay === null ||
        (gameplay !== null && gameplay.userId !== ctx.session.user.id)
      )
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Could not find that requested gameplay',
        });

      return gameplay;
    }),
  createGameplay: protectedProcedure
    .meta({ openapi: { method: 'POST', path: '/gameplay' } })
    .input(
      z.object({
        youtubeUrl: z.string().url(),
        gameplayType: GameplayTypes,
      }),
    )
    .output(GameplaySchema)
    .mutation(async ({ input, ctx }) => {
      const existingGameplay = await ctx.prisma.footage.findUnique({
        where: {
          youtubeUrl: input.youtubeUrl,
        },
      });

      // this needs to be handled client side
      if (existingGameplay !== null)
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'This youtube url has already been submitted.',
        });

      try {
        const data = await ctx.prisma.footage.create({
          data: {
            userId: ctx.session.user.id as string,
            youtubeUrl: input.youtubeUrl as string,
            footageType: input.gameplayType,
          },
        });

        // Validate that the URL contains a video that can be downloaded.
        await ytdl.getInfo(input.youtubeUrl);
        // Download video and save as a local MP4 to be used for processing.
        // await ytdl(url).pipe(fs.createWriteStream(`${data.id}.mp4`));

        // TODO: Implement functionality to trigger python kill shot parsing script.
        // https://www.tutorialspoint.com/run-python-script-from-node-js-using-child-process-spawn-method
        // https://github.com/waldo-vision/aimbot-detection-prototype/blob/main/auto_clip.py
        // If we get resulting clips, then isCsgoFootage should be true.

        // TODO: Implement functionality to trigger logic to shrink video capture width & height.
        // It would be best to do this logic directly within Python script when saving the clip files.
        // Otherwise cropping could be achieved by using FFMPEG or something along those lines.

        // TODO: Submit clips with unique IDs and association to footage ID (API to set DB & FS to create clip file).
        // Each clip should be submitted to the database as a ClipInput.
        // Each clip should be stored to a location on the local server where it can be obtained by the Analysis team.

        return data;
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An unknown error has occurred.',
          // not sure if its safe to give this to the user
          cause: error,
        });
      }
    }),
  getUserGameplay: protectedProcedure
    .meta({ openapi: { method: 'GET', path: '/gameplay/user' } })
    .input(
      z.object({
        userId: z.string().cuid().nullish().optional(),
      }),
    )
    .output(GameplaySchema.array())
    .query(async ({ input, ctx }) => {
      // if no user id provided, use user id from session
      // userId should only be passed by system admins, not avg users
      // TODO: check roles and prevent users from getting other users
      const userId =
        input.userId === null ? ctx.session.user?.id : input.userId;
      console.log(userId);
      const user = await ctx.prisma.user.findUnique({
        where: {
          id: userId,
        },
        include: {
          footage: true,
        },
      });

      // if no user
      if (user === null)
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'No user found with the provided ID.',
        });

      return user.footage;
    }),
  getGameplayClips: protectedProcedure
    .meta({ openapi: { method: 'GET', path: '/gameplay/clips' } })
    .input(
      z.object({
        gameplayId: z.string().cuid(),
      }),
    )
    .output(SegmentSchema.array())
    .query(async ({ input, ctx }) => {
      const gameplay = await ctx.prisma.footage.findUnique({
        where: {
          id: input.gameplayId,
        },
        include: {
          clips: true,
        },
      });

      // if gameplay not found, or not the user who made it
      // TODO: need to do role checking
      if (gameplay === null || gameplay.userId !== ctx.session.user.id)
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Could not find that requested gameplay',
        });

      return gameplay.clips;
    }),
  updateGameplay: protectedProcedure
    .meta({ openapi: { method: 'PATCH', path: '/gameplay' } })
    .input(
      z.object({
        gameplayId: z.string().cuid(),
        footageType: GameplayTypes,
        isAnalyzed: z.boolean(),
      }),
    )
    .output(GameplaySchema)
    .mutation(async ({ input, ctx }) => {
      // TODO: need check if user making request is the
      // user who owns the gameplay

      // TODO: need to prevent users from modifying isAnalyzed
      // need to do a role check here

      try {
        const gameplay = await ctx.prisma.footage.update({
          where: {
            id: input.gameplayId,
          },
          data: {
            isAnalyzed: input.isAnalyzed,
            footageType: input.footageType,
          },
        });

        return gameplay;
      } catch (error) {
        // throws RecordNotFound if record not found to update
        // but can't import for some reason

        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An error occurred in the server',
          // not sure if this is secure
          cause: error,
        });
      }
    }),
  deleteGameplay: protectedProcedure
    .meta({ openapi: { method: 'DELETE', path: '/gameplay' } })
    .input(
      z.object({
        gameplayId: z.string().cuid(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      // TODO: need check if user making request is the
      // user who owns the gameplay

      try {
        await ctx.prisma.footage.delete({
          where: {
            id: input.gameplayId,
          },
        });
      } catch (error) {
        // throws RecordNotFound if record not found to update
        // but can't import for some reason

        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An error occurred in the server',
          // not sure if this is secure
          cause: error,
        });
      }
    }),
});
