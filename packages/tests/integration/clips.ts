import { TRPCClientError } from '@trpc/client';

import { cleanUpClips, prisma } from '../utils/db';
import { adminClient, basicClient } from '../utils/trpc';
import { cleanUpUsers, setUpUsers, testUserBasic } from '../utils/users';
import { CheatTypes, GameplayTypes } from 'web/utils/zod/gameplay';

export const gameplayInput1 = {
  youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  gameplayType: GameplayTypes.Enum.CSG,
  cheats: [CheatTypes.Enum.NOCHEAT],
  tsToken: 'mytoken',
};

const NUM_FIXTURES = 5;

/**
 * Standup and teardown before and after tests are run.
 */
let fixtureClipIds: string[] = [];
beforeAll(async () => {
  const gameplay = await prisma.gameplay.create({
    data: {
      userId: testUserBasic.userId,
      youtubeUrl: gameplayInput1.youtubeUrl + 'clip-fixture',
      gameplayType: gameplayInput1.gameplayType,
      cheats: gameplayInput1.cheats,
    },
  });

  for (let i = 0; i < NUM_FIXTURES; i++) {
    const clip = await prisma.clip.create({
      data: {
        gameplayId: gameplay.id,
      },
    });
    fixtureClipIds.push(clip.id);
  }
});

var clipIds: string[] = [];
afterAll(async () => {
  await cleanUpClips([...clipIds, ...fixtureClipIds]);
});

describe('clip CRUD', () => {
  test('create', async () => {
    const gameplay = await adminClient.gameplay.create.mutate({
      ...gameplayInput1,
      youtubeUrl: gameplayInput1.youtubeUrl + 'clipCRUD',
    });

    const clip = await adminClient.clip.create.mutate({
      gameplayId: gameplay.id,
    });
    clipIds.push(clip.id);

    expect(clip.gameplayId).toEqual(gameplay.id);
  });

  test('get', async () => {
    const clipId = fixtureClipIds[0];
    const clip = await adminClient.clip.get.query({ clipId });

    expect(clip.id).toEqual(clipId);
  });

  test('delete', async () => {
    expect.assertions(2);
    const clipId = fixtureClipIds[2];

    // Delete clip
    await adminClient.clip.delete.mutate({ clipId });

    // Make sure clip no longer exists
    try {
      await adminClient.clip.get.query({ clipId });
    } catch (ex) {
      expect(ex instanceof TRPCClientError).toEqual(true);
      if (ex instanceof TRPCClientError)
        expect(ex.data.code).toEqual('NOT_FOUND');
    }
  });
});
