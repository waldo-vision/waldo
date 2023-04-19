import { PrismaClient } from 'database';

export const prisma = new PrismaClient({
  log: ['warn', 'error'],
});

/**
 * Delete a list of clips. Used for cleaning up at the end of testing.
 * Without doing this, the user clean up step may fail.
 * @param clipIds
 */
export const cleanUpClips = async (clipIds: string[]) => {
  await prisma.clip.deleteMany({
    where: {
      id: {
        in: clipIds,
      },
    },
  });
};
