import { TRPCError } from "@trpc/server";
import ytdl from 'ytdl-core';
import { GameplaySchema, GameplayTypes } from "@utils/zod/gameplay";
import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../trpc";

export const gameplayRouter = router({
  getGameplay: protectedProcedure.input(z.object({
    gameplayId: z.string().cuid(),
  })).output(GameplaySchema).query(async ({input, ctx}) => {
    const gameplay = await ctx.prisma.footage.findUnique({
      where: {
        id: input.gameplayId,
      },
    });

    // if gameplay not found, or not the user who made it
    // TODO: need to do role checking
    if (gameplay === null || (gameplay !== null && gameplay.userId !== ctx.session.user.id))
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Could not find that requested gameplay"
      })

    return gameplay;
  }),
  createGameplay: protectedProcedure.input(z.object({
    youtubeUrl: z.string().url(),
    gameplayType: GameplayTypes,
  })).output(GameplaySchema).query(async ({input, ctx}) => {
    const existingGameplay = await ctx.prisma.footage.findUnique({
      where: {
        youtubeUrl: input.youtubeUrl
      },
    });

    // this needs to be handled client side
    if (existingGameplay !== null) throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'This youtube url has already been submitted.',
    })

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
        code: "INTERNAL_SERVER_ERROR",
        message: "An unknown error has occurred.",
        // not sure if its safe to give this to the user
        cause: error
      })
    }
  }),
  getUserGameplay: protectedProcedure.input(z.object({
    userId: z.string().cuid().nullish(),
  })).output(GameplaySchema.array()).query(async ({input, ctx}) => {

    // if no user id provided, use user id from session
    // userId should only be passed by system admins, not avg users
    // TODO: check roles and prevent users from getting other users
    const userId = input.userId === null ? ctx.session.user.id : input.userId;

    const user = await ctx.prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        footage: true
      },
    });

    // if no user
    if (user === null)
      throw new TRPCError({
        code: "NOT_FOUND",
        message: 'No user found with the provided User ID.'
      })

    return user.footage;
  })
});
