import { rbacProtectedProcedure } from '@server/trpc/trpc';
import { TRPCError } from '@trpc/server';
import { CheatTypes, GameplaySchema, GameplayTypes } from '@utils/zod/gameplay';
import { z } from 'zod';
import * as Sentry from '@sentry/nextjs';
import { Scope } from 'identity';
const zodInput = z.object({
  youtubeUrl: z.string().url(),
  gameplayType: GameplayTypes,
  cheats: z.array(CheatTypes),
  tsToken: z.string(),
});

const zodOutput = GameplaySchema;

export default rbacProtectedProcedure([
  'write:all',
  Scope.Write.Gameplay.create,
  'user',
])
  .meta({ openapi: { method: 'POST', path: '/gameplay' } })
  .input(zodInput)
  .output(zodOutput)
  .mutation(async ({ input, ctx }) => {
    // add google captcha verification
    const existingGameplay = await ctx.prisma.gameplay.findUnique({
      where: {
        youtubeUrl: input.youtubeUrl,
      },
    });

    // this needs to be handled client side
    if (existingGameplay !== null) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'This youtube url has already been submitted.',
      });
    }
    const isValid =
      // eslint-disable-next-line max-len
      /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;

    if (!input.youtubeUrl.match(isValid)) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'This url does not seem to be from youtube.',
      });
    }
    try {
      // Validate that the URL contains a video that can be downloaded.
      // don't need this yet and its just causing useless errors preventing people from submitting.
      // await ytdl.getInfo(input.youtubeUrl);
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
      const data = await ctx.prisma.gameplay.create({
        data: {
          user: {
            connect: {
              id: ctx.session.user.id,
            },
          },
          youtubeUrl: input.youtubeUrl,
          gameplayType: input.gameplayType,
          cheats: input.cheats,
        },
      });
      return data;
    } catch (error) {
      Sentry.captureException(error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unknown error has occurred.',
        // not sure if its safe to give this to the user
        cause: error,
      });
    }
  });
