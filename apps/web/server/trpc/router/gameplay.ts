import { GameplaySchema } from "@utils/zod/gameplay";
import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../trpc";
import { prisma } from "@utils/client";

export const gameplayRouter = router({
  getGameplay: protectedProcedure.input(z.object({
    id: z.string().cuid(),
  })).output(GameplaySchema.nullish()).query(async ({input}) => {
    const footage = await prisma.footage.findUnique({
      where: {
        id: input.id,
      },
    });

    return footage;
  }),
});
