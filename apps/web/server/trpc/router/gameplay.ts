import { TRPCError } from '@trpc/server';
import ytdl from 'ytdl-core';
import {
  GameplaySchema,
  GameplayTypes,
  CheatTypes,
  GameplaysDashSchema,
  ReviewItemsGameplaySchema,
} from '@utils/zod/gameplay';
import { z } from 'zod';
import { vUser } from './util';
import { router, protectedProcedure } from '../trpc';
import { SegmentSchema } from '@utils/zod/segment';
import { hasPerms, Perms } from '@server/utils/hasPerms';
import { serverSanitize } from '@utils/sanitize';
export const gameplayRouter = router({
  /**
   * Get a specific gameplay
   */
  get: protectedProcedure
    .meta({ openapi: { method: 'GET', path: '/gameplay' } })
    .input(
      z
        .object({
          gameplayId: z.string().cuid(),
        })
        .transform(input => {
          return {
            gameplayId: serverSanitize(input.gameplayId),
          };
        }),
    )
    .output(GameplaySchema)
    .query(async ({ input, ctx }) => {
      const gameplay = await ctx.prisma.gameplay.findUnique({
        where: {
          id: input.gameplayId,
        },
      });

      // if gameplay not found, or not the user who made it
      if (
        gameplay === null ||
        !hasPerms({
          userId: ctx.session.user.id,
          userRole: ctx.session.user.role,
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

  /**
   * Get many gameplay
   * Admin API
   */
  getMany: protectedProcedure
    .meta({ openapi: { method: 'GET', path: '/gameplay/dash' } })
    .input(
      z.object({
        page: z.number(),
        filterGames: GameplayTypes.nullable(),
      }),
    )
    .output(z.array(GameplaysDashSchema))
    .query(async ({ input, ctx }) => {
      if (
        !hasPerms({
          userId: ctx.session.user.id,
          userRole: ctx.session.user.role,
          requiredPerms: Perms.roleMod,
          blacklisted: ctx.session.user.blacklisted,
        })
      )
        throw new TRPCError({
          code: 'UNAUTHORIZED',
        });

      const takeValue = 10;
      const skipValue = input.page * 10 - 10;
      if (input.filterGames == null) {
        const gameplayCount: number = await ctx.prisma.gameplay.count();
        try {
          const gameplays = await ctx.prisma.gameplay.findMany({
            take: takeValue,
            skip: skipValue,
            include: {
              user: true,
            },
          });
          gameplays.forEach((gameplay, index: number) => {
            Object.assign(gameplays[index], { gameplayCount: gameplayCount });
          });
          return gameplays;
        } catch (error) {
          throw new TRPCError({
            message: 'No footage with the inputs provided could be found.',
            code: 'NOT_FOUND',
          });
        }
      } else {
        try {
          const gameplayCount = await ctx.prisma.gameplay.count({
            where: {
              gameplayType: input.filterGames,
            },
          });
          const gameplays = await ctx.prisma.gameplay.findMany({
            where: {
              gameplayType: input.filterGames,
            },
            include: {
              user: true,
            },
            take: takeValue,
            skip: skipValue,
          });
          gameplays.forEach((gameplay, index: number) => {
            Object.assign(gameplays[index], { gameplayCount: gameplayCount });
          });
          console.log(gameplays);
          return gameplays;
        } catch (error) {
          throw new TRPCError({
            message: 'No footage with the inputs provided could be found.',
            code: 'NOT_FOUND',
          });
        }
      }
    }),

  /**
   * Create a new gameplay
   */
  create: protectedProcedure
    .meta({ openapi: { method: 'POST', path: '/gameplay' } })
    .input(
      z.object({
        youtubeUrl: z.string().url(),
        gameplayType: GameplayTypes,
        cheats: z.array(CheatTypes),
        tsToken: z.string(),
      }),
    )
    .output(GameplaySchema)
    .mutation(async ({ input, ctx }) => {
      const isPerson = await vUser(input.tsToken);
      if (!isPerson) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message:
            'We could not confirm if you were a legitimate user. Please refresh the page and try again.',
          // not sure if its safe to give this to the user
          cause: '',
        });
      }
      const existingGameplay = await ctx.prisma.gameplay.findUnique({
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
        const data = await ctx.prisma.gameplay.create({
          data: {
            userId: ctx.session.user.id,
            youtubeUrl: input.youtubeUrl,
            gameplayType: input.gameplayType,
            cheats: input.cheats,
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
  /**
   * Get gameplay submitted by a user
   */
  getUsers: protectedProcedure
    .meta({ openapi: { method: 'GET', path: '/gameplay/user' } })
    .input(
      z
        .object({
          userId: z.string().cuid().nullish().optional(),
        })
        .transform(input => {
          return {
            userId:
              input.userId === null || input.userId === undefined
                ? input.userId
                : serverSanitize(input.userId),
          };
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
          userRole: ctx.session.user.role,
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
          gameplay: true,
        },
      });

      // if no user
      if (user === null)
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'No user found with the provided ID.',
        });

      return user.gameplay;
    }),
  getClips: protectedProcedure
    .meta({ openapi: { method: 'GET', path: '/gameplay/clips' } })
    .input(
      z
        .object({
          gameplayId: z.string().cuid(),
        })
        .transform(input => {
          return {
            gameplayId: serverSanitize(input.gameplayId),
          };
        }),
    )
    .output(SegmentSchema.array())
    .query(async ({ input, ctx }) => {
      const gameplay = await ctx.prisma.gameplay.findUnique({
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
          userRole: ctx.session.user.role,
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
      z
        .object({
          gameplayId: z.string().cuid(),
          gameplayType: GameplayTypes,
          isAnalyzed: z.boolean(),
        })
        .transform(input => {
          return {
            gameplayId: serverSanitize(input.gameplayId),
            gameplayType: input.gameplayType,
            isAnalyzed: input.isAnalyzed,
          };
        }),
    )
    .output(GameplaySchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const gameplay = await ctx.prisma.gameplay.findUniqueOrThrow({
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
            userRole: ctx.session.user.role,
            itemOwnerId: gameplay.userId,
            requiredPerms,
            blacklisted: ctx.session.user.blacklisted,
          })
        )
          throw new TRPCError({
            code: 'UNAUTHORIZED',
          });

        const updatedGameplay = await ctx.prisma.gameplay.update({
          where: {
            id: input.gameplayId,
          },
          data: {
            isAnalyzed: input.isAnalyzed,
            gameplayType: input.gameplayType,
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
      z
        .object({
          gameplayId: z.string().cuid(),
        })
        .transform(input => {
          return {
            gameplayId: serverSanitize(input.gameplayId),
          };
        }),
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const gameplay = await ctx.prisma.gameplay.findUniqueOrThrow({
          where: {
            id: input.gameplayId,
          },
        });

        if (
          !hasPerms({
            userId: ctx.session.user.id,
            userRole: ctx.session.user.role,
            itemOwnerId: gameplay.userId,
            requiredPerms: Perms.isOwner,
            blacklisted: ctx.session.user.blacklisted,
          })
        )
          throw new TRPCError({
            code: 'UNAUTHORIZED',
          });

        await ctx.prisma.gameplay.delete({
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
    .input(
      z.object({
        tsToken: z.string(),
      }),
    )
    .output(ReviewItemsGameplaySchema)
    .query(async ({ input, ctx }) => {
      const isPerson = await vUser(input.tsToken);
      if (!isPerson) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message:
            'We could not confirm if you were a legitimate user. Please refresh the page and try again.',
          // not sure if its safe to give this to the user
          cause: '',
        });
      }
      const randomPick = (values: string[]) => {
        const index = Math.floor(Math.random() * values.length);
        return values[index];
      };
      const itemCount = await ctx.prisma.gameplay.count();
      const tenDocs = () => {
        return Math.floor(Math.random() * (itemCount - 1 + 1)) + 0;
      };
      const orderBy = randomPick(['userId', 'id', 'youtubeUrl']);
      const orderDir = randomPick([`desc`, 'asc']);
      const reviewItem = await ctx.prisma.gameplay.findMany({
        where: {
          gameplayVotes: { none: { userId: ctx.session.user.id } },
        },
        take: 1,
        skip: tenDocs(),
        orderBy: { [orderBy]: orderDir },
        include: {
          user: true,
          gameplayVotes: true,
        },
      });
      if (reviewItem[0] == null || reviewItem[0] == undefined) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }
      return reviewItem[0];
    }),
  review: protectedProcedure
    .meta({ openapi: { method: 'PATCH', path: '/gameplay/review' } })
    .input(
      z.object({
        gameplayId: z.string().cuid(),
        isGame: z.boolean(),
        actualGame: GameplayTypes,
        tsToken: z.string(),
      }),
    )
    .output(z.object({ message: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const isPerson = await vUser(input.tsToken);
      if (!isPerson) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message:
            'We could not confirm if you were a legitimate user. Please refresh the page and try again.',
          // not sure if its safe to give this to the user
          cause: '',
        });
      }
      const footageVote = await ctx.prisma.gameplayVotes.create({
        data: {
          gameplayId: input.gameplayId,
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
