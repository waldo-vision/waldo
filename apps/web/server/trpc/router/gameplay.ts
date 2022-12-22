import { TRPCError } from '@trpc/server';
import ytdl from 'ytdl-core';
import {
  GameplayPlusUserSchema,
  GameplaySchema,
  GameplayTypes,
} from '@utils/zod/gameplay';
import { input, z } from 'zod';
import { router, protectedProcedure } from '../trpc';
import { SegmentSchema } from '@utils/zod/segment';
import { hasPerms, Perms, Roles } from '@server/utils/hasPerms';

export const gameplayRouter = router({
  get: protectedProcedure
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
      if (
        gameplay === null ||
        !hasPerms({
          userId: ctx.session.user.id,
          userRole: Roles.User,
          itemOwnerId: gameplay.userId,
          requiredPerms: Perms.isOwner,
          blacklisted: ctx.session.user.blacklisted,
        })
      )
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Could not find that requested gameplay',
        });

      return gameplay;
    }),
  create: protectedProcedure
    .meta({ openapi: { method: 'POST', path: '/gameplay' } })
    .input(
      z.object({
        youtubeUrl: z.string().url(),
        gameplayType: GameplayTypes,
      }),
    )
    .output(GameplaySchema)
    .mutation(async ({ input, ctx }) => {
      // will mostly get thrown if
      if (
        !hasPerms({
          userId: ctx.session.user.id,
          userRole: Roles.User,
          requiredPerms: Perms.isOwner,
          blacklisted: ctx.session.user.blacklisted,
        })
      )
        throw new TRPCError({
          code: 'UNAUTHORIZED',
        });

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
            userId: ctx.session.user.id,
            youtubeUrl: input.youtubeUrl,
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
  getUsers: protectedProcedure
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
      const userId = input.userId === null ? ctx.session.user.id : input.userId;

      if (
        !hasPerms({
          userId: ctx.session.user.id,
          userRole: Roles.User,
          itemOwnerId: userId,
          requiredPerms: Perms.isOwner,
          blacklisted: ctx.session.user.blacklisted,
        })
      )
        throw new TRPCError({
          code: 'UNAUTHORIZED',
        });

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
  getClips: protectedProcedure
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
      if (gameplay === null)
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Could not find that requested gameplay',
        });

      if (
        !hasPerms({
          userId: ctx.session.user.id,
          userRole: Roles.User,
          itemOwnerId: gameplay.userId,
          requiredPerms: Perms.roleMod,
          blacklisted: ctx.session.user.blacklisted,
        })
      )
        throw new TRPCError({
          code: 'UNAUTHORIZED',
        });

      return gameplay.clips;
    }),
  update: protectedProcedure
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
      try {
        const gameplay = await ctx.prisma.footage.findUniqueOrThrow({
          where: {
            id: input.gameplayId,
          },
        });

        // if modifying isAnalyzed, require mod role
        const requiredPerms =
          gameplay.isAnalyzed === input.isAnalyzed
            ? Perms.isOwner
            : Perms.roleMod;

        if (
          !hasPerms({
            userId: ctx.session.user.id,
            userRole: Roles.User,
            itemOwnerId: gameplay.userId,
            requiredPerms,
            blacklisted: ctx.session.user.blacklisted,
          })
        )
          throw new TRPCError({
            code: 'UNAUTHORIZED',
          });

        const updatedGameplay = await ctx.prisma.footage.update({
          where: {
            id: input.gameplayId,
          },
          data: {
            isAnalyzed: input.isAnalyzed,
            footageType: input.footageType,
          },
        });

        return updatedGameplay;
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
  delete: protectedProcedure
    .meta({ openapi: { method: 'DELETE', path: '/gameplay' } })
    .input(
      z.object({
        gameplayId: z.string().cuid(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const gameplay = await ctx.prisma.footage.findUniqueOrThrow({
          where: {
            id: input.gameplayId,
          },
        });

        if (
          !hasPerms({
            userId: ctx.session.user.id,
            userRole: Roles.User,
            itemOwnerId: gameplay.userId,
            requiredPerms: Perms.isOwner,
            blacklisted: ctx.session.user.blacklisted,
          })
        )
          throw new TRPCError({
            code: 'UNAUTHORIZED',
          });

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
  getReviewItems: protectedProcedure
    .meta({ openapi: { method: 'GET', path: '/gameplay/review' } })
    .output(GameplayPlusUserSchema)
    .query(async ({ input, ctx }) => {
      const randomPick = (values: string[]) => {
        const index = Math.floor(Math.random() * values.length);
        return values[index];
      };
      const itemCount = await ctx.prisma.footage.count();
      const tenDocs = () => {
        return Math.floor(Math.random() * (itemCount - 1 + 1)) + 0;
      };

      const orderBy = randomPick(['userId', 'id', 'youtubeUrl']);
      const orderDir = randomPick([`desc`, 'asc']);
      const reviewItems = await ctx.prisma.footage.findMany({
        take: 1,
        skip: tenDocs(),
        orderBy: { [orderBy]: orderDir },
        include: {
          user: true,
        },
      });
      if (reviewItems === null)
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `Could not query gameplay documents`,
        });
      return reviewItems[0];
    }),
  review: protectedProcedure
    .meta({ openapi: { method: 'PATCH', path: '/gameplay/review' } })
    .input(
      z.object({
        gameplayId: z.string().cuid(),
        isGame: z.boolean(),
        actualGame: GameplayTypes,
      }),
    )
    .output(z.object({ message: z.string() }))
    .mutation(async ({ input, ctx }) => {
      console.log(input.gameplayId);
      if (!ctx.session.user?.id) {
        return { message: 'No user' };
      }
      const footageVote = await ctx.prisma.footageVotes.create({
        data: {
          footageId: input.gameplayId,
          isGame: input.isGame,
          actualGame: input.actualGame,
          userId: ctx.session.user?.id,
        },
      });
      if (!footageVote)
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `Could not find a gameplay document with id:${input.gameplayId}.`,
        });

      return { message: 'Updated the gameplay document successfully.' };
    }),
});
